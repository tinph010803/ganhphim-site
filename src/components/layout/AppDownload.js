"use client"

import {forwardRef, useState} from "react";
import {Dropdown} from "react-bootstrap";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
  return (
    <a className="app-download-button" ref={ref} onClick={onClick}>
      {children}
    </a>
  )
})

const AppDownload = () => {
  const [showDropdown,setShowDropdown] = useState(false)

  return (
    <div className="app-download">
      <Dropdown drop="down" align="end" show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
        <Dropdown.Toggle as={CustomToggle}>
          <div className="inc-icon">
            <svg id="Pc" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M10.9998 16.8992C11.1655 16.8992 11.2998 16.7649 11.2998 16.5992V11.5982C11.2998 9.28322 13.1838 7.39922 15.4998 7.39922H18.7998C18.9238 7.39922 19.0446 7.41106 19.1616 7.43327C19.3745 7.47368 19.5998 7.32682 19.5998 7.11012V6.69922C19.5998 6.67022 19.5968 6.64022 19.5918 6.61222C19.2488 4.66722 17.4468 3.19922 15.4008 3.19922H6.79982C4.42882 3.19922 2.49982 5.12822 2.49982 7.49922V12.5982C2.49982 14.9692 4.42882 16.8992 6.79982 16.8992H8.24282L7.86182 19.2492H5.85982C5.44582 19.2492 5.10982 19.5852 5.10982 19.9992C5.10982 20.4132 5.44582 20.7492 5.85982 20.7492H10.7598C11.1738 20.7492 11.5098 20.4132 11.5098 19.9992C11.5098 19.5852 11.1738 19.2492 10.7598 19.2492H9.38082L9.76182 16.8992H10.9998Z"
                    fill="currentColor"></path>
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M17.1912 18.4564C16.7712 18.4564 16.4302 18.1154 16.4302 17.6954C16.4302 17.2754 16.7712 16.9344 17.1912 16.9344C17.6112 16.9344 17.9522 17.2754 17.9522 17.6954C17.9522 18.1154 17.6112 18.4564 17.1912 18.4564ZM18.8002 8.90039H15.5002C14.0362 8.90039 12.8002 10.1364 12.8002 11.5994V18.0994C12.8002 19.5884 14.0112 20.7994 15.5002 20.7994H18.8002C20.2892 20.7994 21.5002 19.5884 21.5002 18.0994V11.5994C21.5002 10.1364 20.2642 8.90039 18.8002 8.90039Z"
                    fill="#ffffff"></path>
            </svg>
          </div>
          <div className="text text-light">
            <span>Tải ứng dụng</span>
            <strong>RoPhim</strong>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu as="ul" className="dropdown-menu v-dropdown-menu app-download-menu">
          <div className="app-box">
            <div className="appicon">
              <img src="/images/appicon.png"/>
              <div className="adm-title">Chọn thiết bị tương ứng để tải và cài đặt</div>
            </div>
            <div className="flex-item">
              <a href="/app-rophim" className="device-item">
                <div className="line-center w-100">
                  <div className="inc-icon">
                    <svg id="monitor display curved" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M3 3.6543V16.2708C9.00227 15.4496 15.0026 15.4496 21 16.2708V3.6543C15.0026 4.47549 9.00227 4.47549 3 3.6543Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"></path>
                      <path d="M6.80859 20.3477C10.2568 19.4691 13.6797 19.4554 17.0764 20.3477"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"></path>
                    </svg>
                  </div>
                  <span>Android TV</span>
                </div>
              </a>
              <a className="device-item" href="/rophim-apk">
                <div className="line-center w-100">
                  <div className="inc-icon">
                    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <g clipRule="evenodd" fill="currentColor" fillRule="evenodd">
                        <path
                          d="m8.5 2.75c-.9665 0-1.75.7835-1.75 1.75v15c0 .9665.7835 1.75 1.75 1.75h7c.9665 0 1.75-.7835 1.75-1.75v-15c0-.9665-.7835-1.75-1.75-1.75zm-3.25 1.75c0-1.79493 1.45507-3.25 3.25-3.25h7c1.7949 0 3.25 1.45507 3.25 3.25v15c0 1.7949-1.4551 3.25-3.25 3.25h-7c-1.79493 0-3.25-1.4551-3.25-3.25z"></path>
                        <path
                          d="m9.47388 2.84311c-.31589-.63175.14359-1.37485.84972-1.37485h3.3528c.7061 0 1.1656.7431.8497 1.37485l-.3.6c-.1609.32175-.49.52515-.8497.52515h-2.7528c-.3597 0-.68867-.20324-.84964-.52499z"></path>
                        <path
                          d="m8.25 19c0-.4142.33579-.75.75-.75h6c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-6c-.41421 0-.75-.3358-.75-.75z"></path>
                      </g>
                    </svg>
                  </div>
                  <span>Điện thoại</span>
                </div>
              </a>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default AppDownload