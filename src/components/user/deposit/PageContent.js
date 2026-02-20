"use client"

import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useRef, useState} from "react";
import {homeUrl} from "@/utils/url";
import {userAvatar} from "@/utils/image";
import PaymentApi from "@/api/payment.api";
import DepositCardForm from "@/components/user/deposit/CardForm";
import Link from "next/link";
import UserName from "@/components/user/Name";
import {fetchBillingInfo, setBillingId, setBillingInfo, setStatus} from "@/redux/features/paymentSlice";
import DepositTimeCountdown from "@/components/user/deposit/TimeCountDown";
import LoadingElement from "@/components/loading/Element";
import {compactNumber, showToast} from "@/utils/helpers";
import {fetchUserInfo} from "@/redux/features/authSlice";

const UserDepositPageContent = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const paymentStatus = useAppSelector(state => state.payment.status)
    const billingId = useAppSelector(state => state.payment.billingId)
    const billingInfo = useAppSelector(state => state.payment.billingInfo)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [bankInfo, setBankInfo] = useState(null)
    const [m2Info, setM2Info] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [packages, setPackages] = useState([])
    const getBillingInfoIntervalRef = useRef(null)

    const getListPackages = async () => {
        try {
            const {result} = await PaymentApi.getListPackages()
            setPackages(result)
        } catch (error) {

        }
    }

    const getPaymentMethodInfo = async () => {
        if (isLoading) return

        setIsLoading(true)

        const {result} = await PaymentApi.getPaymentMethodInfo({method: paymentMethod, package_id: selectedPackage.id})

        setIsLoading(false)

        if (result) {
            if (paymentMethod === "bank") {
                setBankInfo(result)
            } else {
                setM2Info(result)
            }

            dispatch(setStatus("processing"))
            dispatch(setBillingId(result.billing_id))
        }
    }

    const getBillingInfo = (id) => {
        if (getBillingInfoIntervalRef.current) {
            clearInterval(getBillingInfoIntervalRef.current);
        }

        getBillingInfoIntervalRef.current = setInterval(async () => {
            try {
                dispatch(fetchBillingInfo(id))
            } catch (error) {

            }
        }, 5000)
    }

    const handlePaymentMethodClick = async (method) => {
        if (!selectedPackage) return

        if (method === "momo") {
            showToast({message: `Thanh toán qua ví Momo đang được bảo trì. Vui lòng thử lại sau!`, type: "error"})
            return
        }

        if (method === "mobileCard") {
            showToast({message: `Thanh toán qua thẻ điện thoại đang được bảo trì. Vui lòng thử lại sau!`, type: "error"})
            return
        }

        setPaymentMethod(method)
        setBankInfo(null)
        setM2Info(null)
        dispatch(setStatus(null))
    }

    const handlePackageClick = async (pack) => {
        if (paymentMethod) return
        setSelectedPackage(pack)
    }

    const resetDeposit = () => {
        setSelectedPackage(null)
        setPaymentMethod(null)
        dispatch(setBillingId(null))
        dispatch(setBillingInfo(null))
        dispatch(setStatus(null))
    }

    useEffect(() => {
        if (["bank", "momo"].includes(paymentMethod) && selectedPackage) {
            getPaymentMethodInfo()
        }
    }, [paymentMethod, selectedPackage]);

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            return router.push(homeUrl())
        }

        getListPackages()

        return () => {
            if (getBillingInfoIntervalRef.current) {
                clearInterval(getBillingInfoIntervalRef.current);
            }
        }
    }, [loggedUser, isLoadingUserInfo]);

    useEffect(() => {
        if (paymentStatus === "processing" && billingId) {
            getBillingInfo(billingId)
        } else {
            clearInterval(getBillingInfoIntervalRef.current)
        }

        if (paymentStatus === "timeout") {
            console.log(`get payment method info new`)
            getPaymentMethodInfo()
        }
    }, [paymentStatus, billingId]);

    useEffect(() => {
        if (paymentStatus !== "processing") {
            clearInterval(getBillingInfoIntervalRef.current)
            setBankInfo(null)
            setM2Info(null)
            dispatch(setBillingId(null))
        }
        if (paymentStatus === "success") {
            dispatch(fetchUserInfo())
        }
    }, [paymentStatus]);

    if (loggedUser && !isLoadingUserInfo)
        return (
            <div className="premium-center">
                <div className="pc-header mb-4">
                    <div className="heading">Nạp Ro-coin vào tài khoản</div>
                </div>
                <div className="pc-main">
                    <div className="pc-sbs pc-split">
                        <div className="block-mine">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <img src={userAvatar(loggedUser)} alt={loggedUser.name}/>
                                </div>
                                <div className="info">
                                    <UserName user={loggedUser}/>
                                    <div className="wallet-display">
                                        <div className="is-display s-size line-center gap-3">
                                            <div className="my-wallet line-center">
                                                <i className="fa-solid fa-wallet"></i>
                                                <span>Số dư</span>
                                            </div>
                                            <div className="amount flex-grow-0 line-center gap-2">
                                                <span>{compactNumber(loggedUser.coin_balance)}</span>
                                                <div className="ro-coin"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-logs">
                                        <Link href="/user/nap-rocoin/lich-su" className="small text-light line-center">
                                            <span>Xem lịch sử nạp</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="coin-packs">
                            <div className="cp-step">
                                <span className="text-primary me-2">Bước 1:</span>
                                <span>Chọn gói Ro-coin thích hợp</span>
                            </div>
                            <div className="coin-pack-list">
                                {packages.map((item) => {
                                    return (
                                        <div className={`item ${selectedPackage?.id === item.id ? 'active' : ''}`}
                                             key={`package-${item.id}`} onClick={() => handlePackageClick(item)}>
                                            <div className="name font-inc line-center">Gói {compactNumber(item.coin)}
                                                <div className="ro-coin m-size"></div>
                                            </div>
                                            <div className="price">{item.amount.toLocaleString('vi-VN')} vnđ</div>
                                            <div className="buttons">
                                                <div className="btn-select">
                                                    <i className="fa-solid fa-check"></i>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {selectedPackage && <div className="payment-title">
                                Bạn đang chọn gói <strong
                                className="text-primary">{compactNumber(selectedPackage?.coin)}</strong>
                                <div className="ro-coin ms-1 me-1"></div>
                                với giá <strong
                                className="text-primary">{selectedPackage?.amount.toLocaleString('vi-VN')} vnđ</strong>.
                            </div>}
                            <div className="cp-step">
                                <span className="text-primary me-2">Bước 2:</span>
                                <span>Chọn phương thức thanh toán</span>
                            </div>
                            <div className="bu-payments">
                                <div className="new-payment-method">
                                    <div className={`item ${paymentMethod === "bank" ? 'active' : ''}`}>
                                        <div className="name line-center gap-2">
                                            <div className="icon-wrap">
                                                <div className="inc-icon">
                                                    <img src="/images/bank.webp"/>
                                                </div>
                                            </div>
                                            <span>Chuyển khoản ngân hàng</span>
                                        </div>
                                        <div className="buttons">
                                            <button type="button" className="btn btn-light w-100"
                                                    onClick={() => handlePaymentMethodClick('bank')}>Chọn
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`item ${paymentMethod === "momo" ? 'active' : ''}`}>
                                        <div className="name line-center gap-2">
                                            <div className="icon-wrap">
                                                <div className="inc-icon">
                                                    <img src="/images/momo.webp"/>
                                                </div>
                                            </div>
                                            <span>Thanh toán qua ví Momo</span>
                                        </div>
                                        <div className="buttons">
                                            <button type="button" className="btn btn-light w-100"
                                                    onClick={() => handlePaymentMethodClick('momo')}>Chọn
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`item ${paymentMethod === "mobileCard" ? 'active' : ''}`}>
                                        <div className="name line-center gap-2">
                                            <div className="icon-wrap">
                                                <div className="inc-icon">
                                                    <img src="/images/phone.webp"/>
                                                </div>
                                            </div>
                                            <span>Thanh toán bằng thẻ điện thoại</span>
                                        </div>
                                        <div className="buttons">
                                            <button type="button" className="btn btn-light w-100"
                                                    onClick={() => handlePaymentMethodClick('mobileCard')}>Chọn
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isLoading && (<LoadingElement/>)}
                            {paymentStatus === "success" && (<div className="payment-gen payment-gen-alert">
                                <div className="pg-wrap">
                                    <div className="pg-alert alert-success">
                                        <div className="inc-icon">
                                            <img src="/images/payment-success.svg"/>
                                        </div>
                                        <div className="heading-sm mb-0">Thanh toán thành công</div>
                                        <div className="description text-light">
                                            Ví Ro-coin của bạn đã được cộng thêm <strong
                                            className="text-primary">{compactNumber(billingInfo.package.coin)}</strong>
                                            <div className="ro-coin ms-1 me-1"></div>
                                        </div>
                                        <div className="buttons mt-3">
                                            <div className="line-center gap-3">
                                                <Link href="/user/nang-cap-rox" className="btn btn-primary px-4">
                                                    Nâng cấp RoX
                                                </Link>
                                                <button className="btn btn-light px-4" onClick={resetDeposit}>
                                                    Nạp thêm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            {paymentStatus === "error" && (<div className="payment-gen payment-gen-alert">
                                <div className="pg-wrap">
                                    <div className="pg-alert alert-failed">
                                        <div className="inc-icon">
                                            <img src="/images/payment-error.svg"/>
                                        </div>
                                        <div className="heading-sm mb-0">Có lỗi xảy ra</div>
                                        <div className="description text-light">
                                            Vui lòng kiểm tra lại thông tin thanh toán và thử lại
                                        </div>
                                        <div className="buttons mt-3">
                                            <button className="btn btn-light px-4"
                                                    onClick={() => dispatch(setStatus(null))}>
                                                <i className="fa-solid fa-rotate"></i>
                                                <span>Thử lại</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            {(paymentStatus === "processing" && paymentMethod === "mobileCard") && (
                                <div className="payment-gen payment-gen-alert">
                                    <div className="pg-wrap">
                                        <div className="pg-alert alert-pending">
                                            <div className="inc-icon">
                                                <img src="/images/payment-waiting.svg"/>
                                            </div>
                                            <div className="heading-sm mb-0">Giao dịch đang được xử lý</div>
                                            <div className="description text-light">
                                                Giao dịch nạp <strong
                                                className="text-primary">{selectedPackage?.coin}</strong>
                                                <div className="ro-coin ms-1 me-1"></div>
                                                của bạn đang được xử lý. Vui lòng chờ trong giây lát...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(paymentMethod === "bank" && bankInfo) && (
                                <div className="payment-gen effect-fade-in">
                                    <div className="pg-wrap">
                                        <div className="pg-title line-center gap-3">
                                            <div className="inc-icon icon-20">
                                                <img src="/images/bank.webp"/>
                                            </div>
                                            <span className="heading-xs m-0">Chuyển khoản ngân hàng</span>
                                        </div>
                                        <div className="pg-content">
                                            <div className="info">
                                                <div className="small mb-2" style={{color: "aqua"}}>
                                                    Chú ý: nhập chính xác nội dung bên dưới
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Ngân hàng</div>
                                                    <div className="value line-center">
                                                        <span>{bankInfo.bankName}</span>
                                                    </div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Số tài khoản</div>
                                                    <div className="value">{bankInfo.bankAccountNumber}</div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Chủ tài khoản</div>
                                                    <div className="value">{bankInfo.bankAccountName}</div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Số tiền</div>
                                                    <div
                                                        className="value">{bankInfo.amount.toLocaleString('vi-VN')} vnđ
                                                    </div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Nội dung</div>
                                                    <div className="value">{bankInfo.code}</div>
                                                </div>
                                            </div>
                                            <div className="qr-code mt-4">
                                                <img src={bankInfo.qrCode} alt="payment qrcode"/>
                                                <DepositTimeCountdown time={bankInfo.created_at + bankInfo.timeActive}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(paymentMethod === "momo" && m2Info) && (
                                <div className="payment-gen effect-fade-in">
                                    <div className="pg-wrap">
                                        <div className="pg-title line-center gap-3">
                                            <div className="inc-icon icon-20">
                                                <img src="/images/momo.webp"/>
                                            </div>
                                            <span className="heading-xs m-0">Thanh toán qua ví Momo</span>
                                        </div>
                                        <div className="pg-content">
                                            <div className="info">
                                                <div className="small mb-2" style={{color: "aqua"}}>
                                                    Chú ý: nhập chính xác nội dung bên dưới
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Số điện thoại</div>
                                                    <div className="value">{m2Info.phoneNumber}</div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Tên</div>
                                                    <div className="value">{m2Info.phoneName}</div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Số tiền</div>
                                                    <div className="value">{m2Info.amount.toLocaleString('vi-VN')} vnđ
                                                    </div>
                                                </div>
                                                <div className="is-row">
                                                    <div className="name">Nội dung</div>
                                                    <div className="value">{m2Info.content}</div>
                                                </div>
                                            </div>
                                            <div className="qr-code mt-4">
                                                <img src={m2Info.qrCodeUrl}/>
                                                <DepositTimeCountdown time={m2Info.created_at + m2Info.timeActive}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(paymentMethod === "mobileCard" && !paymentStatus) && (
                                <DepositCardForm _package={selectedPackage}/>
                            )}
                        </div>
                    </div>
                    <div className="feature-cards">
                        <div className="card-item">
                            <div className="card-icon inc-icon">
                                <img src="/images/ro-star.svg"/>
                            </div>
                            <div className="content">
                                <h4 className="heading-xs">Ro-Coin là gì?</h4>
                                <div className="description">Với Ro-Coin, các bạn có thể nâng cấp tài khoản, tắt quảng
                                    cáo,
                                    xem phim
                                    chất lượng cao và cá nhân hoá thông tin của bạn. Rất nhiều tiện ích có thể sử dụng
                                    trong
                                    hệ sinh
                                    thái của Rổ. Hãy cùng đón chờ nhé.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default memo(UserDepositPageContent)