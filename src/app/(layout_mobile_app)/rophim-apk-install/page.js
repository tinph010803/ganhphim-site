import {getMetadata} from "@/utils/metadata";
import Link from "next/link";
import {homeUrl} from "@/utils/url";
import {TELEGRAM_URL} from "@/constants/social";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata() {
    const {title, description, metadataBase, openGraph} = await getMetadata({page:"rophimApkInstall"})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/rophim-apk-install`
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
            <div id="page_title">
                <div className="c-container">
                    <h2 className="heading-md m-0">Hướng dẫn cài đặt trên điện thoại / máy tính bảng Android</h2>
                </div>
            </div>
            <div id="page_content">
                <div className="content_sbs">
                    <div className="section-video">
                        <div className="mobile-mockup">
                            <div className="video-frame">
                                <video controls>
                                    <source src="https://seemymeat.net/media/YzCFyHT2RSl4viywLyQaqp-oPOF8R92Zcl7uHWvmg9FFxoEkzO7EQoPTkz-Bi-WlQHN3UoGrovhyFNaiS3Nz4eVXw+SIGhpoJ0KTRk0gjKw=/video.mp4" type="video/mp4"/>
                                </video>
                            </div>
                        </div>
                        <div className="video-title text-center">Video hướng dẫn</div>
                    </div>
                    <div className="section-article">
                        <div className="content">
                            <p>Để cài đặt ứng dụng RoPhim trên điện thoại Android, bạn cần tải file APK từ trang web
                                chính thức rophim.com và thực hiện các bước sau. Dưới đây là các cách hướng dẫn chi
                                tiết:</p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 1: Tải file APK RoPhim</h3>
                            <p>Mở trình duyệt trên điện thoại (như Chrome) và truy cập vào trang web <a
                              href="https://rophim.com/rophim-apk" target="_blank">https://rophim.com/rophim-apk</a> để
                                tải file APK</p>
                            <p>
                                <img className="img-tip" src="/images/android-install-app/android-01.jpg?v=0.1"/>
                            </p>
                            <p>&nbsp;</p>

                            <h3 className="heading-sm text-primary">Bước 2: Cài đặt file APK</h3>
                            <ul>
                                <li>Vào ứng dụng <strong>Chrome</strong> (hoặc trình duyệt mà bạn dùng để tải file APK
                                    trước đó) chọn <strong>icon 3 chấm trên cùng bên phải</strong> -&gt; <strong>Chọn
                                        Downloads (Tải về)</strong> -&gt; <strong>Chọn file APK mà bạn vừa tải</strong>
                                </li>
                                <p className="inc-img">
                                    <img className="img-tip" src="/images/android-install-app/android-02.jpg"/>
                                </p>
                                <li>Nếu ứng dụng <strong>Chrome</strong> (hoặc trình duyệt mà bạn dùng để tải file) chưa
                                    được cấp quyền “<strong>cài đặt ứng dụng bên ngoài</strong>” thì hãy làm theo các
                                    bước sau
                                </li>
                                <p className="inc-img">
                                    <img className="img-tip" src="/images/android-install-app/android-03.jpg"/>
                                </p>
                                <li>Sau khi cấp quyền, quá trình cài đặt sẽ bắt đầu và nếu thành công sẽ như hình</li>
                                <p className="inc-img">
                                    <img className="img-tip" src="/images/android-install-app/android-04.jpg"/>
                                </p>
                                <li>Chọn “<strong>Open</strong>” để mở app và thưởng thức các bộ phim mà bạn yêu thích.
                                </li>
                            </ul>
                            <p>&nbsp;</p>

                            <div className="c-notice">
                                <div className="cn-head heading-sm text-primary">👇 Lưu ý quan trọng:</div>
                                <div className="cn-body">
                                    <ul>
                                        <li><strong>Kiểm tra nguồn APK:</strong> Chỉ tải file APK từ <a href="https://rophim.com/rophim-apk"
                                                                                                        target="_blank">https://rophim.com/rophim-apk</a>
                                        </li>
                                        <li><strong>Phiên bản Android:</strong> Một số APK yêu cầu phiên bản Android tối
                                            thiểu 5.0, hãy kiểm tra trước khi cài.
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
