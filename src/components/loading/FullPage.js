"use client"

import {useAppSelector} from "@/hooks/redux";
import {memo} from "react";

const StyleDefault = memo(() => {
    const {loggedUser} = useAppSelector(state => state.auth)

    return (
        <div id="body-load">
            <div className="bl-logo">
                <img src={loggedUser?.is_vip ? "/images/logo_rox.svg" : "/images/logo.svg"} alt="RoPhim"/>
                <div className="text-h1 text-center">
                    Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
                </div>
            </div>
        </div>
    )
})

const Style304 = memo(() => {
    return (
        <div id="gpmn-body-load">
            <div className="bl-logo">
                <div className="tank-wrap">
                    <div className="vn-sun">
                        <img src="/images/event_304/vn-flag-full.gif"/>
                    </div>
                    <div className="tank-simu">
                        <div className="wheels">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="fence"></div>
                        <div className="fence2"></div>
                    </div>
                    <div className="gate"></div>
                    <div className="gate2"></div>
                </div>
                <div className="text-h1 text-center">Cùng Rổ Phim Chào Mừng 50 Năm Thống Nhất Đất Nước 30/04/1975 -
                    30/04/2025
                </div>
            </div>
        </div>
    )
})

const Style29 = memo(() => {
    return (
        <div id="qk-event-load">
            <div className="trongdong-wrap">
                <div className="trongdong"></div>
            </div>
            <div className="qk-logo">
                <img src="/images/logo.svg"/>
            </div>
            <div className="quockhanh-wide">
                <div className="object-center">
                    <div className="vn-flag">
                        <img src="/images/event_quockhanh/star-fly.gif"/>
                    </div>
                    <div className="vn-hero">
                        <img src="/images/event_quockhanh/hero.webp"/>
                    </div>
                    <div className="vn-text">
                        <img src="/images/event_quockhanh/year-text.webp"/>
                    </div>
                </div>
            </div>
            <div className="text-h1 text-center">
                <div>Kỷ Niệm 80 Năm Cách Mạng Tháng 8 Và Quốc Khánh 2/9 Nước Cộng Hoà Xã Hội Chủ Nghĩa Việt Nam</div>
            </div>
        </div>
    )
})

const LoadingFullPage = () => {
    // const {isQuocKhanhActive} = useAppSelector(s => s.app);

    return <StyleDefault/>
}

export default memo(LoadingFullPage)