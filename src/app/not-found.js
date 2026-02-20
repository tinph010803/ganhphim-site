import "@/styles/template.css"
import "@/styles/device.css"
import "@/styles/custom.css"

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {homeUrl} from "@/utils/url";
import LoadingFullPage from "@/components/loading/FullPage";

export async function generateMetadata() {
  return {
    title:`Lỗi 404 - Không tìm thấy trang`
  }
}

const NotFoundPage = () => {
  return (
    <>
      <div id="app">
        <Header/>
        <div id="wrapper">
          <div className="block-404">
            <div className="icon-404"><img src="/images/404.svg"/></div>
            <div className="heading-xl">Lỗi 404 - Không tìm thấy trang</div>
            <div className="description">Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra đường dẫn hoặc quay về
              trang chủ.
            </div>
            <div className="buttons">
              <Link className="btn btn-lg btn-primary btn-rounded" href={homeUrl()}>
                <div className="line-center">
                  <i className="fa-solid fa-angle-left"></i>
                  <span>Về trang chủ</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  )
}

export default NotFoundPage