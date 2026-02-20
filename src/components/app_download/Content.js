"use client"

import Link from "next/link";
import {homeUrl} from "@/utils/url";
import {useEffect, useState} from "react";
import {Accordion} from "react-bootstrap";
import AppApi from "@/api/app.api";

const AppDownloadContent = () => {
  const [linkDownload, setLinkDownload] = useState(null)
  const [mobileShowMenu, setMobileShowMenu] = useState(false)

  const getLinkDownload = async () => {
    const {result} = await AppApi.linkDownload({platform: "android-tv"})
    setLinkDownload(result)
  }

  useEffect(() => {
    getLinkDownload()

    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll(".top-menu li");

    let current = "";

    const handleScroll = () => {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - sectionHeight / 2) {
          current = section.getAttribute("id");
        }
      })

      navLi.forEach((li) => {
        li.classList.remove("active");
        if (li.classList.contains(current)) {
          li.classList.add("active");
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, []);

  return (
    <>
      <div id="head_nav">
        <div className="nav-wrap">
          <div id="mobile_nav" onClick={() => setMobileShowMenu(!mobileShowMenu)}><i className="fa-solid fa-bars"></i>
          </div>
          <a href={homeUrl()} id="logo" title="Rophim TV - Phim Hay Cả Rổ">
            <img src="/images/logo.svg" alt="Logo Rophim"/>
          </a>
          <div id="head_nav-menu" className={mobileShowMenu ? "active" : ""}>
            <ul className="top-menu">
              <li className="intro active"><a href="#intro" title="Giới thiệu">Giới thiệu</a></li>
              <li className="features"><a href="#features" title="Các tính năng">Các tính năng</a></li>
              <li className="install"><a href="#install" title="Hướng dẫn cài đặt">Hướng dẫn cài đặt</a></li>
              <li className="faq"><a href="#faq" title="Câu hỏi thường gặp">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
          <div id="head_nav-copyright">
            © 2024 <Link href={homeUrl()}>RoPhim</Link>.
          </div>
        </div>
      </div>
      <div id="body_content">
        <section id="intro" className="section section-top">
          <div className="top-mockup">
            <img src="/images/mockup.webp"/>
          </div>
          <div className="show-content">
            <h2 className="heading-xl mb-0">
              Xem phim HD không giới hạn trên TV hoàn toàn miễn phí
            </h2>
            <div className="description">
              Rophim (Rổ Phim) cung cấp phiên bản dành riêng cho Smart TV, trải nghiệm miễn phí không giới hạn các nội
              dung giải trí.
            </div>
            <div className="buttons mt-3">
              <a href={linkDownload?.url_download}
                 className="btn btn-xl btn-gradient px-5">
                <img src="/images/icon.svg" className="icon-btn"/>
                <span>Tải ứng dụng</span>
              </a>
            </div>
            <div className="tips mt-4 line-flex gap-5">
              <a href="#install" title="Hướng dẫn cài đặt">
                <i className="fa-solid fa-book me-2"></i>
                <span>Hướng dẫn cài đặt</span>
              </a>
              <a href="#faq" title="Câu hỏi thường gặp">
                <i className="fa-solid fa-circle-question me-2"></i>
                <span>Câu hỏi thường gặp</span>
              </a>
            </div>
          </div>
        </section>
        <section id="features" className="section section-features">
          <div className="section-header">
            <h2 className="heading-lg mb-0">Các tính năng</h2>
          </div>
          <div className="feature-cards">
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="user" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M12.4004 4.02734C7.84271 4.02734 4.15039 7.71967 4.15039 12.2773C4.15039 13.6519 4.48949 14.9525 5.08536 16.082C5.27864 16.4483 5.13833 16.902 4.77197 17.0953C4.40561 17.2886 3.95194 17.1483 3.75866 16.7819C3.05075 15.44 2.65039 13.8996 2.65039 12.2773C2.65039 6.89124 7.01429 2.52734 12.4004 2.52734C17.7865 2.52734 22.1504 6.89124 22.1504 12.2773C22.1504 13.9086 21.7504 15.4596 21.0314 16.813C20.837 17.1788 20.383 17.3178 20.0172 17.1235C19.6514 16.9291 19.5124 16.4751 19.7067 16.1093C20.311 14.9718 20.6504 13.6623 20.6504 12.2773C20.6504 7.71967 16.9581 4.02734 12.4004 4.02734Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M12.3707 9.09766C10.9641 9.09766 9.82422 10.2372 9.82422 11.6431C9.82422 13.049 10.9641 14.1886 12.3707 14.1886C13.776 14.1886 14.9161 13.0492 14.9161 11.6431C14.9161 10.237 13.776 9.09766 12.3707 9.09766ZM8.32422 11.6431C8.32422 9.40818 10.1363 7.59766 12.3707 7.59766C14.6042 7.59766 16.4161 9.40833 16.4161 11.6431C16.4161 13.8779 14.6042 15.6886 12.3707 15.6886C10.1363 15.6886 8.32422 13.8781 8.32422 11.6431Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M9.03622 19.0171C8.38402 19.5274 8.07428 20.182 7.99589 20.7905C7.94296 21.2013 7.56702 21.4915 7.1562 21.4385C6.74538 21.3856 6.45526 21.0097 6.50818 20.5989C6.63411 19.6214 7.13195 18.6025 8.1119 17.8358C9.09009 17.0704 10.4938 16.5977 12.3699 16.5977C14.2642 16.5977 15.6767 17.0723 16.6576 17.8444C17.641 18.6186 18.1322 19.6473 18.2517 20.6336C18.3016 21.0448 18.0086 21.4186 17.5974 21.4684C17.1862 21.5183 16.8125 21.2253 16.7626 20.8141C16.6876 20.195 16.381 19.5357 15.7297 19.023C15.076 18.5084 14.0172 18.0977 12.3699 18.0977C10.7432 18.0977 9.6902 18.5054 9.03622 19.0171Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Không cần đăng ký</h4>
                <div className="description">Tại Rophim tất cả đều miễn phí. Bạn có thể xem phim mà không cần đăng ký
                  tài khoản.
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="Songs wave" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M12.25 2.36719C12.6642 2.36719 13 2.70297 13 3.11719V20.8813C13 21.2955 12.6642 21.6313 12.25 21.6313C11.8358 21.6313 11.5 21.2955 11.5 20.8813V3.11719C11.5 2.70297 11.8358 2.36719 12.25 2.36719Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M7.76562 5.69336C8.17984 5.69336 8.51562 6.02915 8.51562 6.44336V17.6953C8.51562 18.1095 8.17984 18.4453 7.76562 18.4453C7.35141 18.4453 7.01562 18.1095 7.01562 17.6953V6.44336C7.01562 6.02915 7.35141 5.69336 7.76562 5.69336Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M16.7324 5.55273C17.1466 5.55273 17.4824 5.88852 17.4824 6.30273V17.5547C17.4824 17.9689 17.1466 18.3047 16.7324 18.3047C16.3182 18.3047 15.9824 17.9689 15.9824 17.5547V6.30273C15.9824 5.88852 16.3182 5.55273 16.7324 5.55273Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M21.2168 9.00195C21.631 9.00195 21.9668 9.33774 21.9668 9.75195V13.9634C21.9668 14.3776 21.631 14.7134 21.2168 14.7134C20.8026 14.7134 20.4668 14.3776 20.4668 13.9634V9.75195C20.4668 9.33774 20.8026 9.00195 21.2168 9.00195Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M3.2832 9.28516C3.69742 9.28516 4.0332 9.62094 4.0332 10.0352V14.2466C4.0332 14.6608 3.69742 14.9966 3.2832 14.9966C2.86899 14.9966 2.5332 14.6608 2.5332 14.2466V10.0352C2.5332 9.62094 2.86899 9.28516 3.2832 9.28516Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Đa dạng ngôn ngữ</h4>
                <div className="description">Kho phim với phụ đề, lồng tiếng, thuyết minh cập nhật liên tục. Tính năng
                  điều chỉnh cỡ chữ, màu chữ.
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="Flash" width="24" height="25" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M9.69769 3.88672L6.13756 12.5736H9.80595C10.6767 12.5736 11.3109 13.399 11.0866 14.2404L9.58249 19.8809L17.7366 10.5736H13.4341C12.5194 10.5736 11.8797 9.66901 12.1845 8.80661C12.1897 8.79175 12.1955 8.77705 12.2016 8.76255L14.2791 3.88672H9.69769ZM9.08969 20.4434C9.08975 20.4433 9.0898 20.4432 9.08985 20.4432L9.08969 20.4434ZM8.34172 3.23983C8.53734 2.7267 9.02976 2.38672 9.58008 2.38672H14.5446C15.4593 2.38672 16.099 3.29134 15.7942 4.15374C15.789 4.1686 15.7832 4.18329 15.7771 4.19779L13.6996 9.07363H18.1218C19.2609 9.07363 19.8694 10.4156 19.1187 11.2724L10.2179 21.4318C9.29406 22.4863 7.57923 21.5716 7.94045 20.217L9.57863 14.0736H5.87681C4.95547 14.0736 4.31523 13.1567 4.63254 12.2918C4.63575 12.283 4.63913 12.2743 4.64267 12.2656L8.34172 3.23983Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Siêu tốc độ</h4>
                <div className="description">Thưởng thức các bộ phim gần như không có độ trễ tại tất cả các khoảng
                  thời
                  gian trong ngày.
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="tv stand" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M2.5 6.61977C2.5 4.5455 4.18254 2.86328 6.25746 2.86328H18.2435C20.3188 2.86328 22 4.54582 22 6.61977V14.1204C22 16.1952 20.3189 17.8779 18.2435 17.8779H6.25746C4.18238 17.8779 2.5 16.1955 2.5 14.1204V6.61977ZM6.25746 4.36328C5.01065 4.36328 4 5.37425 4 6.61977V14.1204C4 15.3671 5.01081 16.3779 6.25746 16.3779H18.2435C19.4898 16.3779 20.5 15.3674 20.5 14.1204V6.61977C20.5 5.37393 19.49 4.36328 18.2435 4.36328H6.25746Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M11.8578 17.2675C12.0988 17.1192 12.4029 17.1192 12.644 17.2675L16.6721 19.7467C17.0248 19.9638 17.1348 20.4257 16.9177 20.7785C16.7006 21.1312 16.2386 21.2412 15.8859 21.0241L12.2509 18.7869L8.61587 21.0241C8.26311 21.2412 7.80115 21.1312 7.58404 20.7785C7.36693 20.4257 7.4769 19.9638 7.82965 19.7467L11.8578 17.2675Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Đa thiết bị</h4>
                <div className="description">Rophim hỗ trợ đa thiết bị: Desktop, Mobile, Tablet, TV... Bạn sẽ linh
                  động
                  trong mọi thời gian tại bất kỳ đâu.
                </div>
              </div>
            </div>
            <div className="card-item d-none">
              <div className="card-icon flat-icon">
                <svg id="Video playlist 2" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M6.19166 4.73047C4.88955 4.73047 3.83398 5.78603 3.83398 7.08814V16.9123C3.83398 18.2144 4.88955 19.2699 6.19166 19.2699H12.1453C13.4474 19.2699 14.503 18.2144 14.503 16.9123V7.08814C14.503 5.78603 13.4474 4.73047 12.1453 4.73047H6.19166ZM2.33398 7.08814C2.33398 4.95761 4.06112 3.23047 6.19166 3.23047H12.1453C14.2758 3.23047 16.003 4.95761 16.003 7.08814V16.9123C16.003 19.0428 14.2758 20.7699 12.1453 20.7699H6.19166C4.06112 20.7699 2.33398 19.0428 2.33398 16.9123V7.08814Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M8.43991 10.5942C8.34155 11.4683 8.3389 12.4125 8.44061 13.4073C8.46105 13.5593 8.51954 13.5959 8.53297 13.6035C8.55064 13.6134 8.63969 13.6534 8.83419 13.5777C9.59218 13.2717 10.287 12.8192 10.8413 12.3178C10.9943 12.1763 11.02 12.0601 11.0196 11.9958C11.0192 11.9301 10.9909 11.8164 10.8436 11.683L10.8403 11.68L10.8404 11.68C10.2583 11.1466 9.58569 10.7284 8.82651 10.4169L8.82059 10.4145L8.8206 10.4145C8.67208 10.3521 8.57942 10.3776 8.54339 10.3965C8.524 10.4067 8.50587 10.4217 8.4893 10.4465C8.47287 10.4712 8.45069 10.5167 8.43991 10.5942ZM9.39855 9.0303C8.89501 8.81967 8.32938 8.81463 7.84589 9.06857C7.35026 9.3289 7.02856 9.81619 6.95179 10.4055L6.95168 10.4055L6.95026 10.4181C6.83764 11.4131 6.83642 12.4714 6.94944 13.5701L6.95125 13.586C7.02018 14.1397 7.30658 14.6348 7.79794 14.911C8.28515 15.1849 8.85895 15.1796 9.38551 14.9727L9.38552 14.9727L9.39151 14.9703C10.326 14.5937 11.1722 14.0416 11.8504 13.4276L11.8505 13.4276L11.8548 13.4236C12.2703 13.0415 12.5226 12.5382 12.5196 11.9875C12.5165 11.4389 12.2605 10.9432 11.8523 10.5728C11.1317 9.9127 10.3073 9.40347 9.39855 9.0303Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M18.1641 5.79297C18.5783 5.79297 18.9141 6.12876 18.9141 6.54297V17.4568C18.9141 17.871 18.5783 18.2068 18.1641 18.2068C17.7498 18.2068 17.4141 17.871 17.4141 17.4568V6.54297C17.4141 6.12876 17.7498 5.79297 18.1641 5.79297Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M21.084 8.17188C21.4982 8.17188 21.834 8.50766 21.834 8.92188V15.0769C21.834 15.4911 21.4982 15.8269 21.084 15.8269C20.6698 15.8269 20.334 15.4911 20.334 15.0769V8.92188C20.334 8.50766 20.6698 8.17188 21.084 8.17188Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Danh sách yêu thích</h4>
                <div className="description">Quản lý phim bằng các danh sách yêu thích tuỳ ý, thêm bớt chỉ 1 thao tác
                  đơn giản.
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="Calendar time" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M3.22632 9.46289C3.22632 9.04868 3.5621 8.71289 3.97632 8.71289H19.6747C20.0889 8.71289 20.4247 9.04868 20.4247 9.46289C20.4247 9.8771 20.0889 10.2129 19.6747 10.2129H3.97632C3.5621 10.2129 3.22632 9.8771 3.22632 9.46289Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M15.354 2.25C15.7682 2.25 16.104 2.58579 16.104 3V5.87229C16.104 6.2865 15.7682 6.62229 15.354 6.62229C14.9398 6.62229 14.604 6.2865 14.604 5.87229V3C14.604 2.58579 14.9398 2.25 15.354 2.25Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M8.30151 2.25C8.71573 2.25 9.05151 2.58579 9.05151 3V5.87229C9.05151 6.2865 8.71573 6.62229 8.30151 6.62229C7.8873 6.62229 7.55151 6.2865 7.55151 5.87229V3C7.55151 2.58579 7.8873 2.25 8.30151 2.25Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M4.57275 4.87658C5.46938 4.02414 6.71613 3.62793 8.13318 3.62793H15.5231C16.943 3.62793 18.1903 4.02385 19.0854 4.87732C19.9861 5.73607 20.4328 6.96516 20.4288 8.43136V11.364C20.4288 11.7783 20.093 12.114 19.6788 12.114C19.2645 12.114 18.9288 11.7783 18.9288 11.364V8.43046L18.9288 8.42824C18.9322 7.27085 18.5865 6.47415 18.0503 5.96294C17.5083 5.44619 16.6739 5.12793 15.5231 5.12793H8.13318C6.98638 5.12793 6.15092 5.4459 5.60629 5.96369C5.06744 6.47598 4.71875 7.27364 4.71875 8.43046V16.3293C4.71875 17.51 5.06972 18.3282 5.61152 18.8533C6.15703 19.3821 6.99089 19.7057 8.13318 19.7057H10.2835C10.6977 19.7057 11.0335 20.0415 11.0335 20.4557C11.0335 20.8699 10.6977 21.2057 10.2835 21.2057H8.13318C6.71162 21.2057 5.46326 20.7986 4.56753 19.9304C3.66807 19.0586 3.21875 17.8135 3.21875 16.3293V8.43046C3.21875 6.96311 3.67035 5.73451 4.57275 4.87658Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M16.6692 14.0254C14.9508 14.0254 13.5574 15.4193 13.5574 17.1382C13.5574 18.8568 14.9506 20.25 16.6692 20.25C18.3889 20.25 19.782 18.8567 19.782 17.1382C19.782 15.4195 18.3886 14.0254 16.6692 14.0254ZM12.0574 17.1382C12.0574 14.5914 14.1219 12.5254 16.6692 12.5254C19.2173 12.5254 21.282 14.5913 21.282 17.1382C21.282 19.6853 19.2171 21.75 16.6692 21.75C14.1222 21.75 12.0574 19.6852 12.0574 17.1382Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M16.6482 15.0928C17.0624 15.0928 17.3982 15.4286 17.3982 15.8428V16.9867L18.254 17.4982C18.6096 17.7107 18.7256 18.1711 18.5131 18.5267C18.3006 18.8823 17.8401 18.9982 17.4846 18.7858L16.2635 18.056C16.0369 17.9206 15.8982 17.6761 15.8982 17.4122V15.8428C15.8982 15.4286 16.234 15.0928 16.6482 15.0928Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M7.17065 12.9365C7.17065 12.5223 7.50644 12.1865 7.92065 12.1865H7.92128C8.3355 12.1865 8.67128 12.5223 8.67128 12.9365C8.67128 13.3507 8.3355 13.6865 7.92128 13.6865H7.92065C7.50644 13.6865 7.17065 13.3507 7.17065 12.9365Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M10.8484 12.9365C10.8484 12.5223 11.1842 12.1865 11.5984 12.1865H11.599C12.0132 12.1865 12.349 12.5223 12.349 12.9365C12.349 13.3507 12.0132 13.6865 11.599 13.6865H11.5984C11.1842 13.6865 10.8484 13.3507 10.8484 12.9365Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M7.17065 16.3271C7.17065 15.9129 7.50644 15.5771 7.92065 15.5771H7.92128C8.3355 15.5771 8.67128 15.9129 8.67128 16.3271C8.67128 16.7414 8.3355 17.0771 7.92128 17.0771H7.92065C7.50644 17.0771 7.17065 16.7414 7.17065 16.3271Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Lịch chiếu phim</h4>
                <div className="description">Một tính năng rất hay giúp bạn không thể bỏ lỡ thời điểm chiếu các bộ
                  phim
                  yêu thích.
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="card-icon flat-icon">
                <svg id="4K display" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M7.00391 20.3438C7.00391 19.9295 7.33969 19.5938 7.75391 19.5938H16.7442C17.1584 19.5938 17.4942 19.9295 17.4942 20.3438C17.4942 20.758 17.1584 21.0938 16.7442 21.0938H7.75391C7.33969 21.0938 7.00391 20.758 7.00391 20.3438Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M2.5 7.68533C2.5 5.04605 4.63956 2.90625 7.27811 2.90625H17.2209C19.8603 2.90625 22 5.04593 22 7.68533V13.1418C22 15.7812 19.8603 17.9208 17.2209 17.9208H7.27811C4.63956 17.9208 2.5 15.781 2.5 13.1418V7.68533ZM7.27811 4.40625C5.46822 4.40625 4 5.87424 4 7.68533V13.1418C4 14.9529 5.46822 16.4208 7.27811 16.4208H17.2209C19.0319 16.4208 20.5 14.9527 20.5 13.1418V7.68533C20.5 5.87436 19.0319 4.40625 17.2209 4.40625H7.27811Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M10.3087 7.21589C10.6186 7.31575 10.8287 7.60415 10.8287 7.92974V11.0152H11.0371C11.4513 11.0152 11.7871 11.351 11.7871 11.7652C11.7871 12.1794 11.4513 12.5152 11.0371 12.5152H10.8287V12.8968C10.8287 13.311 10.4929 13.6468 10.0787 13.6468C9.66448 13.6468 9.32869 13.311 9.32869 12.8968V12.5152H7.32032C7.03894 12.5152 6.78123 12.3577 6.65289 12.1073C6.52454 11.8569 6.54714 11.5557 6.71143 11.3273L9.46981 7.49184C9.65991 7.22751 9.99884 7.11603 10.3087 7.21589ZM9.32869 11.0152V10.2571L8.78351 11.0152H9.32869Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M13.2969 7.33594C13.7111 7.33594 14.0469 7.67172 14.0469 8.08594V12.7367C14.0469 13.151 13.7111 13.4867 13.2969 13.4867C12.8827 13.4867 12.5469 13.151 12.5469 12.7367V8.08594C12.5469 7.67172 12.8827 7.33594 13.2969 7.33594Z"
                        fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M17.0154 7.77201C17.2815 8.0894 17.24 8.56246 16.9226 8.82861L15.0344 10.412L16.9226 11.9953C17.24 12.2615 17.2815 12.7346 17.0154 13.0519C16.7492 13.3693 16.2762 13.4109 15.9588 13.1447L13.3853 10.9867C13.2153 10.8442 13.1172 10.6338 13.1172 10.412C13.1172 10.1902 13.2153 9.97979 13.3853 9.83729L15.9588 7.67924C16.2762 7.41309 16.7492 7.45462 17.0154 7.77201Z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <div className="content">
                <h4 className="heading-sm">Phát video chất lượng cao</h4>
                <div className="description">Hỗ trợ đa dạng độ phân giải: 480p, 720p, 1080p, 4K (tùy chọn) và tối ưu
                  theo chất lượng đường truyền.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="install" className="section section-install">
          <div className="section-header">
            <h2 className="heading-lg mb-0">Hướng dẫn cài đặt</h2>
          </div>
          <div className="sbs-install">
            <div className="article">
              <p>Để xem phim trực tuyến miễn phí trên ứng dụng Rophim, bạn cần tải xuống tệp apk của ứng dụng
                trước.</p>
              <p>Hiện tại, Rophim cung cấp 2 phiên bản dành cho điện thoại Android và Android TV. Tùy thuộc vào loại
                thiết bị, vui lòng chọn phiên bản Rophim phù hợp.</p>
              <p>Việc cài đặt ứng dụng bên ngoài Google Play Store trên Android TV có thể được thực hiện theo nhiều
                cách
                khác nhau. Dưới đây là hướng dẫn chi tiết từng bước kèm theo các cách phổ biến nhất.</p>
              <div className="faq-list install-list mb-3">
                <Accordion id="install_list">
                  <Accordion.Item eventKey="way-1">
                    <Accordion.Header>
									<span className="flex-grow-1">
										Cách 1: Sử dụng ứng dụng gửi file qua Wi-Fi (Send Files to TV)
									</span>
                      <span className="small">Xem</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="step-makeup">
                        <li>
                          <p><strong>Bước 1:</strong></p>
                          <p>Tải ứng dụng <strong>"Send Files to TV"</strong></p>
                          <p><img src="/images/install-app/11.jpg"/></p>
                          <p>Tải ứng dụng này trên cả Android TV và thiết bị di động (Android hoặc iOS).</p>
                        </li>
                        <li>
                          <p><strong>Bước 2:</strong></p>
                          <p>Chuẩn bị file APK trên điện thoại</p>
                          <p><img src="/images/install-app/12.jpg"/></p>
                          <p>Tải file APK trên điện thoại từ nguồn tin cậy.</p>
                        </li>
                        <li>
                          <p><strong>Bước 3:</strong></p>
                          <p>Mở ứng dụng <strong>"Send Files to TV"</strong> trên cả hai thiết bị.</p>
                          <p><img src="/images/install-app/13.jpg"/></p>
                          <p>Chọn <strong>"Send"</strong> trên điện thoại và chọn file APK.</p>
                          <p><img src="/images/install-app/14.jpg"/></p>
                          <p>Chọn <strong>"Receive"</strong> trên TV để nhận file.</p>
                          <p><img src="/images/install-app/15.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 4:</strong></p>
                          <p>Sau khi gửi, mở file APK trên TV bằng trình quản lý file và chọn <strong>Cài đặt
                            (Install)</strong>.</p>
                          <p><img src="/images/install-app/16.jpg"/></p>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="way-2">
                    <Accordion.Header>
									<span className="flex-grow-1">
										Cách 2: Sử dụng USB để cài đặt file APK
									</span>
                      <span className="small">Xem</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="step-makeup">
                        <li>
                          <p><strong>Bước 1:</strong></p>
                          <p>Truy cập trang web chính thức của Rophim tại <a
                            href="https://rophim.tv/">https://rophim.tv/</a> và tải xuống phiên bản phù hợp với
                            thiết bị của bạn. Sau đó, phiên bản apk mới nhất của Rophim sẽ tự động được tải xuống
                            thiết bị.</p>
                        </li>
                        <li>
                          <p><strong>Bước 2:</strong></p>
                          <p>Lưu file Apk Rophim đã tải vào USB.</p>
                          <p><img src="/images/install-app/21.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 3:</strong></p>
                          <p>Cắm USB vào cổng USB trên TV &gt; Mở File Manager, tìm đến file Apk Rophim trong USB.</p>
                          <p><img src="/images/install-app/22.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 4:</strong></p>
                          <p>Cấp quyền cài đặt ứng dụng không rõ nguồn gốc. Android TV: <strong>Vào Cài đặt trên
                            Android TV &gt; Bảo mật & Hạn chế &gt; Cài đặt ứng dụng không rõ nguồn gốc &gt; Bật quyền
                            cho ứng
                            dụng File Manager</strong>.</p>
                          <p><img src="/images/install-app/23.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 5:</strong></p>
                          <p>Chọn file Apk, nhấn <strong>Install</strong> &gt; Hoàn thành cài đặt và mở ứng dụng.</p>
                          <p><img src="/images/install-app/24.jpg"/></p>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="way-3">
                    <Accordion.Header>
                      <span className="flex-grow-1">
										Cách 3: Sử dụng ứng dụng quản lý file có tính năng tải file từ mạng nội bộ (LAN)
									</span>
                      <span className="small">Xem</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="step-makeup">
                        <li>
                          <p><strong>Bước 1:</strong></p>
                          <p>Cài đặt ứng dụng quản lý file.</p>
                          <p>Tải ứng dụng như <strong>X-plore File Manager</strong> hoặc <strong>File
                            Commander</strong> từ <strong>Google Play Store</strong>.</p>
                          <p><img src="/images/install-app/31.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 2:</strong></p>
                          <p>Tải file APK về máy tính hoặc điện thoại.</p>
                          <p>Lưu file APK trên thiết bị trong cùng mạng Wi-Fi với Android TV.</p>
                          <p><img src="/images/install-app/32.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 3:</strong></p>
                          <p>Truy cập file APK qua mạng nội bộ.</p>
                          <p>- Mở ứng dụng quản lý file trên TV và chọn kết
                            nối <strong>LAN</strong> hoặc <strong>Network</strong>.</p>
                          <p>- Đăng nhập vào máy tính/điện thoại qua địa chỉ IP hoặc chia sẻ thư mục.</p>
                          <p><img src="/images/install-app/33.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 4:</strong></p>
                          <p>Duyệt đến file APK, chọn và nhấn <strong>Cài đặt (Install)</strong>.</p>
                          <p><img src="/images/install-app/34.jpg"/></p>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="way-4">
                    <Accordion.Header>
                      <span className="flex-grow-1">
										Cách 4: Sử dụng trình duyệt để tải trực tiếp file APK
									</span>
                      <span className="small">Xem</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="step-makeup">
                        <li>
                          <p><strong>Bước 1:</strong></p>
                          <p>Tải một trình duyệt như <strong>Downloader</strong> từ <strong>Google Play Store</strong>.
                          </p>
                          <p><img src="/images/install-app/41.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 2:</strong></p>
                          <p>Tải file APK trực tiếp.</p>
                          <p>- Mở trình duyệt, nhập địa chỉ URL chứa file APK.</p>
                          <p>- Tải file về bộ nhớ trong của Android TV.</p>
                          <p><img src="/images/install-app/42.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 3:</strong></p>
                          <p>Dùng trình quản lý file để mở file đã tải và nhấn <strong>Cài đặt (Install)</strong>.</p>
                          <p><img src="/images/install-app/43.jpg"/></p>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="way-5">
                    <Accordion.Header>
                      <span className="flex-grow-1">
										Cách 5: Sử dụng Google Drive hoặc dịch vụ lưu trữ đám mây
									</span>
                      <span className="small">Xem</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="step-makeup">
                        <li>
                          <p><strong>Bước 1:</strong></p>
                          <p>Tải file APK lên <strong>Google Drive</strong>.</p>
                          <p>Sử dụng máy tính hoặc điện thoại để tải file lên tài khoản Google Drive.</p>
                          <p><img src="/images/install-app/51.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 2:</strong></p>
                          <p>Truy cập <strong>Google Drive</strong> trên Android TV.</p>
                          <p>Dùng trình duyệt hoặc ứng dụng như <strong>File Commander</strong> để truy cập Drive.</p>
                          <p><img src="/images/install-app/52.jpg"/></p>
                        </li>
                        <li>
                          <p><strong>Bước 3:</strong></p>
                          <p>Tải và cài đặt file APK.</p>
                          <p>Tải file xuống và cài đặt như các bước trên.</p>
                          <p><img src="/images/install-app/53.jpg"/></p>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <p className="mt-4">Nếu bạn tiếp tục gặp sự cố khi cài đặt, nên liên hệ với nhà phát triển hoặc đội ngũ
                hỗ
                trợ của ứng dụng để được hỗ trợ. Họ sẽ cung cấp các bước khắc phục sự cố cụ thể hoặc thông tin cần
                thiết
                để giải quyết vấn đề.
              </p>
            </div>
            <div className="pop-install">
              <a href={linkDownload?.url_download}
                 className="btn btn-lg btn-gradient w-100">
                <img src="/images/icon.svg" className="icon-btn"/>
                <span>Tải ứng dụng</span>
              </a>
              <div className="heading-xs mb-0">Trải Nghiệm Rophim Trên TV</div>
            </div>
          </div>
        </section>
        <section id="faq" className="section section-faq">
          <div className="flat-icon stick-icon">
            <svg id="Search question" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M11.8824 3.75C7.64753 3.75 4.21484 7.18268 4.21484 11.4175C4.21484 15.6525 7.64764 19.086 11.8824 19.086C13.881 19.086 15.701 18.3212 17.0658 17.0682C17.0703 17.0635 17.0749 17.0588 17.0795 17.0541C17.0979 17.0357 17.117 17.0185 17.1367 17.0024C18.6223 15.6038 19.5499 13.6189 19.5499 11.4175C19.5499 7.18268 16.1172 3.75 11.8824 3.75ZM18.6696 17.5808C20.1486 15.9526 21.0499 13.7903 21.0499 11.4175C21.0499 6.35426 16.9456 2.25 11.8824 2.25C6.8191 2.25 2.71484 6.35426 2.71484 11.4175C2.71484 16.4807 6.81899 20.586 11.8824 20.586C14.0326 20.586 16.0099 19.8456 17.5733 18.6059L20.5059 21.531C20.7992 21.8235 21.274 21.8229 21.5666 21.5296C21.8591 21.2364 21.8585 20.7615 21.5652 20.469L18.6696 17.5808ZM9.15819 9.7884C9.15819 8.17977 10.452 6.88415 12.0615 6.88415C13.6614 6.88415 14.9647 8.178 14.9647 9.7884C14.9647 10.9274 14.3112 11.7301 13.4708 12.1947C13.418 12.2249 13.3679 12.2532 13.3203 12.28C13.083 12.4138 12.9089 12.512 12.7662 12.6405C12.6302 12.7629 12.5888 12.8557 12.5905 12.9845C12.596 13.3986 12.2648 13.7389 11.8506 13.7444C11.4364 13.7499 11.0962 13.4186 11.0907 13.0045C11.0817 12.3305 11.4003 11.8517 11.7627 11.5255C12.0416 11.2745 12.3884 11.0813 12.6228 10.9507C12.6625 10.9285 12.6989 10.9082 12.7313 10.8897L12.7417 10.8837L12.7418 10.8838C13.2241 10.6182 13.4647 10.2602 13.4647 9.7884C13.4647 9.00908 12.8356 8.38415 12.0615 8.38415C11.2813 8.38415 10.6582 9.00731 10.6582 9.7884C10.6582 10.2026 10.3224 10.5384 9.90819 10.5384C9.49398 10.5384 9.15819 10.2026 9.15819 9.7884ZM11.8419 14.4434C12.2561 14.4434 12.5919 14.7792 12.5919 15.1934V15.2002C12.5919 15.6145 12.2561 15.9502 11.8419 15.9502C11.4276 15.9502 11.0919 15.6145 11.0919 15.2002V15.1934C11.0919 14.7792 11.4276 14.4434 11.8419 14.4434Z"
                    fill="currentColor"></path>
            </svg>
          </div>
          <div className="section-header">
            <h2 className="heading-lg mb-0">Câu hỏi thường gặp</h2>
          </div>
          <div className="description mb-4">Tổng hợp giải đáp các vấn đề người dùng thắc mắc</div>
          <div className="faq-list">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>1. TV nào mới có thể dùng ứng dụng?</Accordion.Header>
                <Accordion.Body>
                  <p>Ứng dụng APK thường tương thích với các dòng Android TV hoặc Smart TV có hệ điều hành dựa trên
                    Android. Các TV này thường được sản xuất từ năm 2015 trở đi bởi các hãng như Sony, TCL, Samsung
                    (một số dòng), và Xiaomi.</p>
                  <p>Để kiểm tra, bạn có thể vào <strong>Cài đặt &gt; Thông tin thiết bị</strong> để xem hệ điều hành
                    của
                    TV.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>2. Cài gặp lỗi "nguồn không tin cậy" phải làm sao?</Accordion.Header>
                <Accordion.Body>
                  <p>Lỗi này xảy ra khi TV chặn việc cài đặt ứng dụng từ nguồn bên ngoài Google Play. Để khắc
                    phục:</p>
                  <ul>
                    <li>Vào <strong>Cài đặt &gt; Bảo mật & Hạn chế &gt; Nguồn không xác định</strong>.</li>
                    <li>Bật quyền cài đặt cho ứng dụng bạn sử dụng để mở file APK (trình quản lý file hoặc trình
                      duyệt).
                    </li>
                    <li>Thử cài đặt lại ứng dụng.</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>3. Tôi không tìm thấy file APK trong USB trên TV. Phải làm sao?</Accordion.Header>
                <Accordion.Body>
                  <p>Đảm bảo file APK đã được lưu chính xác vào USB. Thử kiểm tra lại bằng máy tính hoặc thiết bị khác
                    để xác nhận file có trong USB. Đồng thời, đảm bảo TV của bạn nhận diện được USB.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>4. TV của tôi không hỗ trợ cài đặt ứng dụng từ file APK. Tôi phải làm
                  gì?</Accordion.Header>
                <Accordion.Body>
                  <p>Nếu TV không hỗ trợ, bạn có thể kiểm tra xem có phiên bản ứng dụng dành cho nền tảng TV của bạn
                    (ví dụ: Android TV) hay sử dụng thiết bị khác (như điện thoại hoặc máy tính bảng) để xem phim.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>5. Làm thế nào để khắc phục lỗi khi cài đặt file APK?</Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>Kiểm tra xem file APK có bị lỗi hay không (tải lại từ trang web chính thức).</li>
                    <li>Đảm bảo bạn đã cấp quyền cài đặt ứng dụng không rõ nguồn gốc.</li>
                    <li>Khởi động lại thiết bị và thử cài đặt lại.</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header>6. Ứng dụng bị báo lỗi hoặc không hoạt động sau khi cài đặt. Tôi nên làm
                  gì?</Accordion.Header>
                <Accordion.Body>
                  <p>Liên hệ đội ngũ hỗ trợ của Rophim qua trang web chính thức để được hướng dẫn chi tiết hoặc tải
                    lại file APK phiên bản mới nhất.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="6">
                <Accordion.Header>7. File APK Rophim có an toàn không?</Accordion.Header>
                <Accordion.Body>
                  <p>Nếu tải từ trang web chính thức của Rophim, file APK đảm bảo an toàn. Tránh tải từ các nguồn
                    không rõ ràng để tránh rủi ro về bảo mật.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="7">
                <Accordion.Header>8. Có cần phải cập nhật file APK sau một thời gian sử dụng không?</Accordion.Header>
                <Accordion.Body>
                  <p>Có, để đảm bảo bạn được sử dụng phiên bản mới nhất với các tính năng và cập nhật bảo mật, hãy
                    kiểm tra trang web Rophim thường xuyên để tải bản cập nhật.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="8">
                <Accordion.Header>9. Làm sao để xóa file APK sau khi cài đặt thành công?</Accordion.Header>
                <Accordion.Body>
                  <p>Bạn có thể sử dụng File Manager để tìm và xóa file APK trong USB hoặc bộ nhớ thiết bị của mình.
                    Việc này không ảnh hưởng đến ứng dụng đã cài đặt.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </section>
      </div>
    </>
  )
}

export default AppDownloadContent