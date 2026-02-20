"use client"

import {homeUrl} from "@/utils/url";
import {
    DISCORD_URL,
    FACEBOOK_URL,
    INSTAGRAM_URL,
    TELEGRAM_URL,
    THREADS_URL,
    TIKTOK_URL,
    X_URL,
    YOUTUBE_URL
} from "@/constants/social";
import {useAppSelector} from "@/hooks/redux";
import CustomLink from "@/components/shared/CustomLink";
import {memo} from "react";

const Footer = () => {
    const {loggedUser} = useAppSelector(state => state.auth)

    return (
        <footer>
            <div className="container">
                <div className="footer-elements">
                    <div className="footer-icon"><img src="/images/footer-icon.svg"/></div>
                    <div className="side-left">
                        <div className="true">
                            <div className="line-center">
                                <div className="inc-icon icon-20">
                                    <img src="/images/vn_flag.svg" alt="Vietnam"/>
                                </div>
                                <span>Hoàng Sa &amp; Trường Sa là của Việt Nam!</span>
                            </div>
                        </div>
                        <div className="sl-brand line-center">
                            <CustomLink href={homeUrl()} className="footer-logo">
                                <img src={loggedUser?.is_vip ? '/images/logo_rox.svg' : '/images/logo.svg'} alt="RoPhim"/>
                            </CustomLink>
                            <div className="socials line-center">
                                <a className="social-item" target="_blank" href={TELEGRAM_URL} title={`Telegram`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/telegram-icon.svg" alt="Telegram"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={DISCORD_URL} title={`Discord`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/discord-icon.svg" alt="Discord"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={X_URL} title={`X`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/x-icon.svg" alt="X"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={FACEBOOK_URL} title={`Facebook`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/facebook-icon.svg" alt="Facebook"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={TIKTOK_URL} title={`Tiktok`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/tiktok-icon.svg" alt="Tiktok"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={YOUTUBE_URL} title={`Youtube`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/youtube-icon.svg" alt="Youtube"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={THREADS_URL} title={`Threads`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/threads-icon.svg" alt="Threads"/>
                                    </div>
                                </a>
                                <a className="social-item" target="_blank" href={INSTAGRAM_URL} title={`Instagram`}>
                                    <div className="inc-icon icon-14">
                                        <img src="/images/social/instagram-icon.svg" alt="Instagram"/>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="sl-menu mb-3">
                            <CustomLink href="/hoi-dap" title="Hỏi-Đáp">Hỏi-Đáp</CustomLink>
                            <CustomLink href="/chinh-sach-bao-mat" title="Chính sách bảo mật">Chính sách bảo
                                mật</CustomLink>
                            <CustomLink href="/dieu-khoan-su-dung" title="Điều khoản sử dụng">Điều khoản sử
                                dụng</CustomLink>
                            <CustomLink href="/gioi-thieu" title="Giới thiệu">Giới thiệu</CustomLink>
                            <CustomLink href="/lien-he" title="Liên hệ">Liên hệ</CustomLink>
                        </div>
                        <div className="sl-menu mb-3">
                            <CustomLink href="/dongphim" title="Dongphim">Dongphim</CustomLink>
                            <CustomLink href="/ghienphim" title="Ghienphim">Ghienphim</CustomLink>
                            <CustomLink href="/motphim" title="Motphim">Motphim</CustomLink>
                            <CustomLink href="/subnhanh" title="Subnhanh">Subnhanh</CustomLink>
                        </div>
                        <div className="sl-notice mb-2">RoPhim – Phim hay cả rổ - Trang xem phim online chất lượng cao
                            miễn phí
                            Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ,
                            phim lẻ từ nhiều
                            quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
                            Khám phá nền
                            tảng phim trực tuyến hay nhất 2024 chất lượng 4K!
                        </div>
                        <div className="sl-copyright">© 2026 RoPhim</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default memo(Footer)