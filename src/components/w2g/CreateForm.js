"use client"

import {genImageUrl} from "@/utils/image";
import {useEffect, useRef, useState} from "react";
import {Spinner} from "react-bootstrap";
import W2gApi from "@/api/w2g.api"
import {DateTimePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {ThemeProvider, createTheme} from '@mui/material/styles'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "@/utils/dayjs";
import Link from "next/link";
import {movieWatchUrl} from "@/utils/url";
import {useRouter} from "next/navigation";
import {showToast} from "@/utils/helpers";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const W2gCreateForm = ({movie, ss, ep}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [startAuto, setStartAuto] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [estimatedTime, setEstimatedTime] = useState(0)
    const [posterIndex, setPosterIndex] = useState(0)
    const inputNameRef = useRef(null)
    const loggedUser = useAppSelector(s => s.auth.loggedUser)

    const now = dayjs();
    const after30Minutes = now.add(30, 'minute');
    const minutes = after30Minutes.minute();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    const defaultValue = after30Minutes.minute(roundedMinutes).second(0);

    useEffect(() => {
        if (startAuto) setEstimatedTime(defaultValue.unix())
    }, [startAuto]);

    const handleCreateRoom = async () => {
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }

        setIsLoading(true)

        const posterId = movie.images.posters[posterIndex]._id

        const data = {
            title: inputNameRef.current.value,
            estimated_time: estimatedTime,
            is_private: isPrivate,
            poster_id: posterId,
            movie_id: movie._id
        }
        if (movie.type === 2) {
            data.season = ss
            data.episode = ep
        }

        const {result, status, msg, errors} = await W2gApi.createRoom(data)
        if (status) {
            showToast({message: msg, type: 'success'})
            router.push(`/xem-chung/${result._id}`)
        } else {
            if (errors) {
                for (const [key, error] of Object.entries(errors)) {
                    showToast({message: error, type: "error"})
                }
            } else {
                showToast({message: msg, type: "error"})
            }
        }
        setIsLoading(false)

    }

    const handleChangeStartTime = (time) => {
        setEstimatedTime(time.unix())
    }

    return (
        <div className="w2g-step">
            <div className="step-row is-name">
                <div className="step-name mb-3">1. Tên phòng</div>
                <div className="form-group mb-0">
                    <input type="text" className="form-control size-lg v-form-control" placeholder="Nhập tên phòng"
                           maxLength={100} minLength={10} defaultValue={`Cùng xem ${movie.title} nhé`}
                           ref={inputNameRef}/>
                </div>
            </div>
            <div className="step-row is-poster">
                <div className="line-center align-items-start w-100">
                    <div className="d-flex flex-column flex-grow-1">
                        <div className="step-name">2. Chọn poster hiển thị</div>
                    </div>
                    <div className="d-poster line-center gap-3">
                        {movie.images.posters.map((item, index) => (
                            <div className={`item ${index === posterIndex ? 'active' : ''}`} key={`m-p-${index}`}
                                 onClick={() => setPosterIndex(index)}>
                                <div className="v-thumbnail">
                                    <img src={genImageUrl({path: item.path, size: "150-0"})}
                                         alt={`poster ${index + 1}`} loading="lazy"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="step-row is-time">
                <div className="step-name">3. Cài đặt thời gian</div>
                <p className="step-desc">Có thể bắt đầu thủ công hoặc tự động theo thời gian cài đặt.</p>
                {startAuto && (<ThemeProvider theme={darkTheme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker ampm={false}
                                        onChange={handleChangeStartTime}
                                        label="Thời gian"
                                        format="DD-MM-YYYY HH:mm"
                                        defaultValue={defaultValue}
                                        minDateTime={dayjs().add(20, "minute")}
                                        maxDateTime={dayjs().add(7, 'day')}/>
                    </LocalizationProvider>
                </ThemeProvider>)}
                <div className="start-manual">
                    <div className="line-center gap-2">
                        <div className="v-toggle" onClick={() => setStartAuto(!startAuto)}>
                            <div id="live-manual" className={`toggle-x ${startAuto ? 'on' : 'off'}`}>
                                <span></span>
                            </div>
                        </div>
                        <div className="text">Tôi muốn bắt đầu tự động</div>
                    </div>
                </div>
            </div>
            <div className="step-row is-public">
                <div className="line-center w-100 mb-2">
                    <div className="step-name mb-0 flex-grow-1">4. Bạn chỉ muốn xem với bạn bè?</div>
                    <div className="v-toggle" onClick={() => setIsPrivate(!isPrivate)}>
                        <div id="live-public" className={`toggle-x ${isPrivate ? 'on' : 'off'}`}>
                            <span></span>
                        </div>
                    </div>
                </div>
                <p className="step-desc mb-0">Nếu bật, chỉ có thành viên có link mới xem được phòng này.</p>
            </div>
            <div className="is-submit mt-4">
                <div className="buttons line-center gap-3 w-100">
                    <button className="btn btn-xl btn-primary flex-grow-1" onClick={() => handleCreateRoom()}>
                        Tạo phòng
                        {isLoading && <Spinner
                            className="ms-2"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />}
                    </button>
                    <Link className="btn btn-xl btn-light" href={movieWatchUrl(movie)}>Huỷ bỏ</Link>
                </div>
            </div>
        </div>
    )
}

export default W2gCreateForm