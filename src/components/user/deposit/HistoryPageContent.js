"use client"

import {memo, useEffect, useState} from "react";
import {userAvatar} from "@/utils/image";
import {useAppSelector} from "@/hooks/redux";
import {homeUrl} from "@/utils/url";
import {useRouter} from "next/navigation";
import Link from "next/link";
import PaymentApi from "@/api/payment.api";
import dayjs from "@/utils/dayjs";
import {compactNumber} from "@/utils/helpers";
import UserName from "@/components/user/Name";

const UserDepositHistoryPageContent = () => {
    const router = useRouter()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const [billingList, setBillingList] = useState([])

    const getBillingList = async () => {
        const {result} = await PaymentApi.getBillingList()
        if (result) {
            setBillingList(result)
        }
    }

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            return router.push(homeUrl())
        }

        getBillingList()
    }, [loggedUser, isLoadingUserInfo]);

    if (loggedUser && !isLoadingUserInfo)
        return (
            <div id="wrapper" className="premium-wrap wallet-wrap">
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
                                    </div>
                                </div>
                            </div>
                            <div className="block-upgrade block-payment-logs">
                                <div className="logs-title line-center gap-3">
                                    <Link href="/user/nap-rocoin" className="btn btn-sm btn-outline btn-rounded">
                                        <i className="fa-solid fa-angle-left"></i>
                                        <span>Quay lại</span>
                                    </Link>
                                    <div className="heading-md mb-0">
                                        Lịch sử thanh toán
                                    </div>
                                </div>
                                <div className="logs-list">
                                    <div className="ll-table">
                                        <div className="ll-row ll-head">
                                            <div className="colm-1">Thời gian</div>
                                            <div className="colm-2">Ro-Coin</div>
                                            <div className="colm-3">Hình thức</div>
                                            <div className="colm-4">Số tiền</div>
                                            <div className="colm-5">Trạng thái</div>
                                        </div>
                                        {billingList.map((item, index) => {
                                            return (
                                                <div className="ll-row highlight" key={`billing-${item._id}`}>
                                                    <div
                                                        className="colm-1">{dayjs.unix(item.created_at).format('HH:mm:ss DD/MM/YYYY')}</div>
                                                    <div className="colm-2">
                                                        <div className="amount flex-grow-0 line-center gap-2">
                                                            <span>{compactNumber(item.package.coin)}</span>
                                                            <div className="ro-coin"></div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="colm-3">{item.method === "bank" ? "Chuyển khoản ngân hàng" : (item.method === "momo" ? "Thanh toán Momo" : "Thẻ điện thoại")}</div>
                                                    <div
                                                        className="colm-4">{item.package.amount.toLocaleString('vi-VN')} vnđ
                                                    </div>
                                                    <div className="colm-5">
                                                        {item.status===0 && <span className="pending">Chờ xác nhận</span>}
                                                        {item.status===1 && <span className="good">Thành công</span>}
                                                        {item.status===2 && <span className="bad">Thất bại</span>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {billingList.length === 0 && <div className="v-notice">
                                            Chưa có dữ liệu
                                        </div>}
                                    </div>
                                </div>
                                {/*<div className="payment-notice mt-1">*/}
                                {/*    <div className="small">*/}
                                {/*        Bạn gặp vấn đề cần trợ giúp? Vui lòng gửi yêu cầu hỗ trợ qua mail: <a*/}
                                {/*        href="thanhtoan@rophim.me">thanhtoan@rophim.me</a>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="feature-cards">
                            <div className="card-item">
                                <div className="card-icon inc-icon">
                                    <img src="/images/ro-star.svg"/>
                                </div>
                                <div className="content">
                                    <h4 className="heading-xs">Ro-Coin là gì?</h4>
                                    <div className="description">Với Ro-Coin, các bạn có thể nâng cấp tài khoản, tắt
                                        quảng
                                        cáo, xem phim chất lượng cao và cá nhân hoá thông tin của bạn. Rất nhiều tiện
                                        ích có
                                        thể sử dụng trong hệ sinh thái của Rổ. Hãy cùng đón chờ nhé.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default memo(UserDepositHistoryPageContent)