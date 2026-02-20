"use client"

import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {useEffect, useState} from "react";
import {homeUrl} from "@/utils/url";
import {userAvatar} from "@/utils/image";
import Link from "next/link";
import UserApi from "@/api/user.api";
import {Modal, Spinner} from "react-bootstrap";
import dayjs from "@/utils/dayjs";
import {compactNumber, showToast} from "@/utils/helpers";
import {setLoggedUser} from "@/redux/features/authSlice";
import UserName from "@/components/user/Name";

const UserUpgradeRoxPageContent = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const [vipPackagesList, setVipPackagesList] = useState([])
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showModalSuccess, setShowModalSuccess] = useState(false)
    const [showModalError, setShowModalError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState(null)

    const getVipPackagesList = async () => {
        const {result} = await UserApi.vipPackagesList()
        if (result) {
            setVipPackagesList(result)
        }
    }

    const handlePackageClick = async (item) => {
        setShowModalConfirm(true)
        setSelectedPackage(item)
    }

    const handleUpgradeRoxClick = async () => {
        if(isLoading) return

        setIsLoading(true)
        const {status, msg, result} = await UserApi.upgradeRox({package_id: selectedPackage.id})
        setIsLoading(false)
        if (status) {
            setShowModalConfirm(false)
            setShowModalSuccess(true)
            dispatch(setLoggedUser(result.user))
        } else {
            // showToast({message: msg, type: "error"})
            setShowModalConfirm(false)
            setShowModalError(true)
        }
    }

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            return router.push(homeUrl())
        }

        getVipPackagesList()
    }, [loggedUser, isLoadingUserInfo]);


    if (loggedUser && !isLoadingUserInfo)
        return (
            <>
                <div id="wrapper" className="premium-wrap">
                    <div className="premium-center">
                        <div className="pc-header">
                            <div className="heading">Tài khoản RoX</div>
                            <div className="description text-center">Sở hữu tài khoản RoX để nhận nhiều quyền lợi và
                                tăng
                                trải nghiệm xem phim.
                            </div>
                        </div>
                        <div className="pc-main">
                            <div className="pc-sbs">
                                <div className="block-mine">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <img src={userAvatar(loggedUser)} alt={loggedUser.name}/>
                                        </div>
                                        <div className="info">
                                            <UserName user={loggedUser}/>
                                            <div className="my-group">{loggedUser.is_vip ? `Tài khoản RoX tới: ${dayjs.unix(loggedUser.vip_expires_at).format("DD/MM/YYYY")}`: `Bạn đang là thành viên miễn phí.`}</div>
                                            <div className="wallet-display mt-1">
                                                <div className="is-display s-size line-center gap-3">
                                                    <div className="my-wallet line-center">
                                                        <i className="fa-solid fa-wallet"></i>
                                                        <span>Số dư</span>
                                                    </div>
                                                    <div className="amount flex-grow-0 line-center gap-2">
                                                        <span>{compactNumber(loggedUser.coin_balance)}</span>
                                                        <div className="ro-coin"></div>
                                                    </div>
                                                    <Link className="btn btn-xs btn-light py-0 px-1"
                                                          style={{minHeight: "20px"}}
                                                          href="/user/nap-rocoin">
                                                        <i className="fa-solid fa-plus"></i>
                                                        <span>Nạp</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="block-upgrade">
                                    <div className="bu-top">
                                        <div className="bu-title">
                                            <div className="heading-xl text-center mb-0">Nâng cấp tài khoản RoX ngay bây
                                                giờ
                                            </div>
                                        </div>
                                        <div className="bu-tabs">
                                            {vipPackagesList.map((item, index) => {
                                                return (
                                                    <div className={`item ${item.highlight ? 'suggest' : ''}`}
                                                         key={`vp-${index}`}>
                                                        <div className="info">
                                                            <div className="name">{item.duration_months} tháng</div>
                                                            <div className="price">
                                                                {item.original_price > item.sale_price &&
                                                                    <span className="old">{compactNumber(item.original_price)}</span>}
                                                                <span className="new">{compactNumber(item.sale_price)}</span>
                                                                <div className="ro-coin"></div>
                                                                {item.percent_decrease > 0 &&
                                                                    <span
                                                                        className="tiny-badge">Giảm {item.percent_decrease}%</span>}
                                                            </div>
                                                        </div>
                                                        <div className="notice">
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Tắt quảng cáo</span>
                                                            </div>
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Xem phim chất lượng 4K</span>
                                                            </div>
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Chat không cần chờ</span>
                                                            </div>
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Chat sử dụng stickers và Gifs</span>
                                                            </div>
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Tải lên ảnh đại diện của bạn</span>
                                                            </div>
                                                            <div>
                                                                <i className="fa-solid fa-check"></i>
                                                                <span>Tên được gắn nhãn ROX</span>
                                                            </div>
                                                        </div>
                                                        <div className="buttons">
                                                            <button className="btn w-100 btn-light"
                                                                    onClick={() => handlePackageClick(item)}>
                                                                <span>Chọn</span>
                                                                <i className="fa-solid fa-angles-up"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal className="v-modal modal-sm modal-rox-confirm" centered={true} show={showModalConfirm}
                       onHide={() => setShowModalConfirm(!showModalConfirm)}>
                    <div className="is-header mb-2">
                        <h4 className="heading-sm text-light mb-0 text-center">Xác nhận</h4>
                    </div>
                    <div className="description text-center text-light">
                        <div className="line-center gap-0 mb-1">
                            <div className="me-2">Bạn đang chọn gói <strong
                                className="text-primary">RoX {selectedPackage?.duration_months} tháng</strong>
                            </div>
                            (
                            <div className="line-center gap-1"><strong>{compactNumber(selectedPackage?.sale_price)}</strong>
                                <div className="ro-coin"></div>
                            </div>
                            )
                        </div>
                        <div className="small" style={{color: "#fff8"}}>Bắt đầu {dayjs().format("DD/MM/YYYY")} - Hết
                            hạn: {dayjs().add(selectedPackage?.duration_months, 'month').format("DD/MM/YYYY")}</div>
                    </div>
                    <div className="buttons w-100 mt-4">
                        <button className="btn w-100 btn-primary" onClick={() => handleUpgradeRoxClick()}>
                            <i className="fa-solid fa-check"></i>
                            <span>Đồng ý</span>
                            {isLoading && <Spinner
                                className="ms-2"
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                        </button>
                        <button className="btn w-100 btn-outline mt-2" onClick={() => setShowModalConfirm(false)}>Đóng
                        </button>
                    </div>
                </Modal>
                <Modal className="v-modal modal-sm modal-rox-confirm" centered={true} show={showModalSuccess}
                       onHide={() => setShowModalSuccess(!showModalSuccess)}>
                    <div className="logo-small text-center mb-3">
                        <img src="/images/logo_rox.svg" style={{height: "50px", width: "auto"}}/>
                    </div>
                    <div className="is-header mb-2">
                        <h4 className="heading-sm text-primary mb-0 text-center">Nâng cấp RoX thành công</h4>
                    </div>
                    <div className="description text-center text-light">Chúc mừng bạn đã nâng cấp tài khoản RoX thành
                        công
                    </div>
                    <div className="user-info line-center justify-content-center gap-3 mt-4">
                        <div className="user-avatar">
                            <img src={userAvatar(loggedUser)} alt={loggedUser?.name}/>
                        </div>
                        <div className="info text-light">
                            <UserName user={loggedUser} />
                            <div className="my-group">Tài khoản RoX
                                tới: <span>{dayjs.unix(loggedUser?.vip_expires_at).format('DD/MM/YYYY')}</span></div>
                        </div>
                    </div>
                    <div className="buttons mt-4">
                        <button className="btn w-100 btn-light" onClick={() => setShowModalSuccess(false)}>Đóng</button>
                    </div>
                </Modal>
                <Modal className="v-modal modal-sm" centered={true} show={showModalError}
                       onHide={() => setShowModalError(!showModalError)}>
                        <div className="d-block text-center mb-2">
                            <div className="ro-coin is-large less"></div>
                        </div>
                        <div className="is-header mb-1">
                            <h4 className="heading-sm mb-0 text-center">Ro-coin không đủ</h4>
                        </div>
                        <div className="description text-center text-light">Nạp thêm Ro-coin vào ví để nâng cấp / gia
                            hạn tài khoản.
                        </div>
                        <div className="buttons d-flex align-items-center justify-content-center gap-2 mt-4">
                            <Link className="btn btn-light" href="/user/nap-rocoin">Đi đến trang nạp <i
                                className="fa-solid fa-arrow-right"></i></Link>
                            <button className="btn btn-outline" onClick={()=>setShowModalError(false)}>Đóng</button>
                        </div>
                </Modal>
            </>
        )
}

export default UserUpgradeRoxPageContent