import {getMetadata} from "@/utils/metadata";
import Link from "next/link";
import {homeUrl} from "@/utils/url";
import {TELEGRAM_URL} from "@/constants/social";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata() {
    const {title, description, metadataBase, openGraph} = await getMetadata({page: "rophimIosInstall"})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/rophim-ios-install`
        }
    }
}

export default async function MobileAppPage() {
    const {h1} = await getMetadata({})

    return (
        <div className="child-page">
            <H1Tags text={h1}/>
            <div id="page_nav">
                <div className="c-container">
                    <Link href="/rophim-apk" className="nav-back line-flex">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Tải ứng dụng</span>
                    </Link>
                    <Link href={homeUrl()} id="logo" title="Rophim TV - Phim Hay Cả Rổ">
                        <img src="/images/logo.svg" alt="RoPhim"/>
                    </Link>
                </div>
            </div>
            <div id="page_title" style={{backgroundColor:"#16576b"}}>
                <div className="c-container">
                    <h2 className="heading-md m-0">Hướng dẫn cài đặt trên iOS</h2>
                </div>
            </div>
            <div id="page_content">
                <div className="content_sbs">
                    <div className="section-video">
                        <div className="mobile-mockup">
                            <div className="video-frame">
                                <iframe width="560" height="315"
                                        src="https://www.youtube.com/embed/SeOOcmguRnw?si=f3A_k0oTE2Flj2Wi&amp;controls=0"
                                        title="YouTube video player" frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen></iframe>
                            </div>
                        </div>
                        <div className="video-title text-center">Video hướng dẫn</div>
                    </div>
                    <div className="section-article">
                        <div className="content">
                            <p>Để cài đặt ứng dụng RoPhim trên thiết bị iOS, bạn cần tải ứng dụng RoTeam từ Appstore và
                                thực hiện các bước sau. Dưới đây là các cách hướng dẫn chi tiết:</p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 1: Tải & cài đặt ứng dụng</h3>
                            <p>Mở <strong>Appstore</strong> trên thiết bị, sau đó tìm ứng dụng <strong>RoTeam</strong> và cài đặt.</p>
                            <p>
                                <img className="img-tip" src="/images/ios-install-app/01.webp"/>
                            </p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 2:</h3>
                            <p>Mở App <strong className="text-light">RoTeam</strong> lên, tại màn hình <strong
                                className="text-light">Login</strong> bấm chọn <strong className="text-light">Sign
                                Up</strong></p>
                            <p>
                                <img className="img-tip" src="/images/ios-install-app/02.webp"/>
                            </p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 3:</h3>
                            <p>Bấm vào biểu tượng <strong className="text-light">cây bút</strong> ngay Avatar.</p>
                            <p>
                                <img className="img-tip" src="/images/ios-install-app/03.webp"/>
                            </p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 4:</h3>
                            <p>Các bạn có thể chọn <strong className="text-light">Take Photo</strong> để quét ảnh mã QR
                                mà Rổ Phim cung cấp, hoặc chọn <strong className="text-light">Photo Library</strong> để
                                lấy ảnh mã QR Rổ Phim trong Thư Viện Ảnh</p>
                            <div className="img-sbs line-flex" style={{marginBottom: "1rem"}}>
                                <div><img className="img-tip" src="/images/ios-install-app/04.webp"/></div>
                                <div><img className="img-tip" src="/images/ios-install-app/05.webp"/></div>
                            </div>
                            <p>&nbsp;</p>

                            <div className="c-notice">
                                <div className="cn-head heading-sm text-primary">👇 Lưu ý quan trọng:</div>
                                <div className="cn-body">
                                    <ul>
                                        <li>Sau khi thực hiện thành công, ứng dụng RoTeam sẽ thay đổi App Icon thành Rổ
                                            Phim.
                                        </li>
                                        <li>Lần tới không cần thực hiện lại các bước trên, chỉ cần mở app là sẽ tự động
                                            vào ứng dụng Rổ Phim
                                        </li>
                                    </ul>
                                    <p className="mb-0">Nếu bạn gặp khó khăn ở bước nào, hãy liên hệ qua <a href={TELEGRAM_URL}
                                                                                                            className="me-2"
                                                                                                            style={{color: "#44b8ff"}}><i
                                        className="fa-brands fa-telegram ms-2 me-1"></i>Telegram</a> để được hỗ trợ nhé!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
