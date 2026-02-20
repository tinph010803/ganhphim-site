"use client"

import {Modal, Spinner} from "react-bootstrap";
import {memo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {toggleShowReportModal} from "@/redux/features/movieSlice";
import {showToast} from "@/utils/helpers";
import ReportApi from "@/api/report.api";
import axios from "axios";
import {UAParser} from "ua-parser-js";

const MovieReportModal = ({movie}) => {
    const dispatch = useAppDispatch()
    const {showReportModal, curSeason, curEpisode, curVersion} = useAppSelector(state => state.movie)
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const contentInputRef = useRef(null)

    const getIpInfo = async () => {
        try {
            const {data} = await axios.get('https://ipinfo.io/json')
            return {
                ip: data.ip,
                hostname: data.hostname,
                city: data.city,
                region: data.region,
                country: data.country,
                loc: data.loc,
                org: data.org,
                postal: data.postal,
            }
        } catch (e) {

        }

        return null
    }

    const getDeviceInfo = async () => {
        const parser = new UAParser();
        const uaResult = parser.getResult();

        return {
            ua: navigator.userAgent,
            browser: uaResult.browser,
            os: uaResult.os,
            device: uaResult.device,
            language: navigator.language,
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                pixelRatio: window.devicePixelRatio,
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    }

    const handleErrorClick = (type) => {
        if (errors.includes(type)) {
            setErrors(prevState => prevState.filter(item => item !== type))
        } else {
            setErrors(prevState => [...prevState, type])
        }
    }

    const handleSubmitReport = async () => {
        if (!isLoading) {
            if (errors.length === 0) {
                showToast({message: `Vui lòng chọn vấn đề bạn đang gặp phải.`, type: 'error'})
                return
            }

            setIsLoading(true)

            const data = {
                movie_id: movie._id,
                errors: errors,
                content: contentInputRef.current.value,
                version: curVersion
            }
            if (movie.type === 2) {
                data.season_number = curSeason.season_number
                data.episode_number = curEpisode.episode_number
            }

            const [ipInfo, deviceInfo] = await Promise.all([
                getIpInfo(),
                getDeviceInfo()
            ])

            data.client_info = JSON.stringify({ipInfo, deviceInfo})

            const {msg, status} = await ReportApi.submit(data)

            if (status) {
                setErrors([])
                contentInputRef.current.value = ''
                showToast({message: msg, type: 'success'})
            } else {
                showToast({message: msg, type: 'error'})
            }

            setIsLoading(false)
            dispatch(toggleShowReportModal())
        }
    }

    return (
        <Modal centered={true} show={showReportModal} className="v-modal modal-sm" onHide={() => {
            dispatch(toggleShowReportModal())
        }}>
            <button className="btn modal-close" onClick={() => dispatch(toggleShowReportModal())}>
                <i className="fa-solid fa-times"></i>
            </button>
            <div className="is-header mb-2">
                <h4 className="heading-sm mb-0 ">Báo lỗi</h4>
            </div>
            <div className="is-body mb-4">
                <p>Bạn đang gặp vấn đề gì?</p>
                <div className="reason-list">
                    <div className={`h-item ${errors.includes(1) ? 'active' : ''}`} onClick={() => handleErrorClick(1)}>
                        <div className="rl-icon">
                            <i className="fa-solid fa-image"></i>
                        </div>
                        <span>Hình ảnh</span>
                    </div>
                    <div className={`h-item ${errors.includes(2) ? 'active' : ''}`} onClick={() => handleErrorClick(2)}>
                        <div className="rl-icon">
                            <i className="fa-solid fa-volume-high"></i>
                        </div>
                        <span>Âm thanh</span>
                    </div>
                    <div className={`h-item ${errors.includes(3) ? 'active' : ''}`} onClick={() => handleErrorClick(3)}>
                        <div className="rl-icon">
                            <i className="fa-solid fa-closed-captioning"></i>
                        </div>
                        <span>Ngôn ngữ / Phụ đề</span>
                    </div>
                </div>
                <div className="reason-other mt-4">
                    <textarea ref={contentInputRef} className="form-control v-form-control" rows="3" cols="3"
                              maxLength={300} minLength={1}
                              placeholder="Mô tả chi tiết lỗi (tuỳ chọn)"></textarea>
                </div>
            </div>
            <div className="is-footer">
                <button type="button" className="btn btn-sm btn-primary" onClick={handleSubmitReport}>
                    Gửi đi
                    {isLoading && <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                </button>
                <button type="button" className="btn btn-sm btn-light px-4"
                        onClick={() => dispatch(toggleShowReportModal())}>Đóng
                </button>
            </div>
        </Modal>
    )
}

export default memo(MovieReportModal)