"use client"

import {forwardRef, memo, useEffect, useState} from "react";
import {Dropdown} from "react-bootstrap";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <div className="line-center text-light" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}>
        <i className="fa-solid fa-bars"></i>
        <span>Tuỳ chỉnh</span>
    </div>
))

const ChatSettings = () => {
    const [showChat, setShowChat] = useState(true)
    const [chatLeft, setChatLeft] = useState(false)
    const [hideHeader, setHideHeader] = useState(false)
    const [collapse, setCollapse] = useState(false)
    const [mobileOptimize, setMobileOptimize] = useState(false)

    useEffect(() => {
        showChat ? document.body.classList.remove("js-live-mask") : document.body.classList.add("js-live-mask")
        return () => {
            document.body.classList.remove("js-live-mask")
        }
    }, [showChat]);

    useEffect(() => {
        chatLeft ? document.body.classList.add("js-live-chatleft") : document.body.classList.remove("js-live-chatleft")
        return () => {
            document.body.classList.remove("js-live-chatleft")
        }
    }, [chatLeft]);

    useEffect(() => {
        collapse ? document.body.classList.add("js-live-min") : document.body.classList.remove("js-live-min")
        return () => {
            document.body.classList.remove("js-live-min")
        }
    }, [collapse]);

    useEffect(() => {
        hideHeader ? document.body.classList.add("js-live-header") : document.body.classList.remove("js-live-header")

        return () => {
            document.body.classList.remove("js-live-header")
        }
    }, [hideHeader]);

    useEffect(() => {
        mobileOptimize ? document.body.classList.add("js-live-clean") : document.body.classList.remove("js-live-clean")
        return () => {
            document.body.classList.remove("js-live-clean")
        }
    }, [mobileOptimize]);

    return (
        <div className="sb_header">
            <div className="item item-settings">
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}/>
                    <Dropdown.Menu className="v-dropdown-menu bg-dark" as="ul">
                        <div id="div-adt" className="dropdown-item py-2">
                            <span className="flex-grow-1 pe-3">Ẩn đầu trang</span>
                            <div id="toggle-live-header" className="v-toggle v-toggle-min line-center"
                                 onClick={() => setHideHeader(!hideHeader)}>
                                <div className={`toggle-x ${hideHeader ? "on" : "off"}`}>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div id="div-kct" className="dropdown-item py-2">
                            <span className="flex-grow-1 pe-3">Khung chat trái</span>
                            <div id="toggle-live-chatleft" className="v-toggle v-toggle-min line-center"
                                 onClick={() => setChatLeft(!chatLeft)}>
                                <div className={`toggle-x ${chatLeft ? "on" : "off"}`}>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div id="div-tg" className="dropdown-item py-2">
                            <span className="flex-grow-1 pe-3">Thu gọn</span>
                            <div id="toggle-live-min" className="v-toggle v-toggle-min line-center"
                                 onClick={() => setCollapse(!collapse)}>
                                <div className={`toggle-x ${collapse ? "on" : "off"}`}>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="item item-clean v-toggle v-toggle-min line-center">
                <div className="text">Tối ưu</div>
                <div id="toggle-clean" className={`toggle-x ${mobileOptimize ? "on" : "off"}`} onClick={()=>setMobileOptimize(!mobileOptimize)}>
                    <span></span>
                </div>
            </div>
            <div className="flex-grow-1"></div>
            <div className="item v-toggle v-toggle-min line-center">
                <div className="text">Ẩn chat</div>
                <div id="toggle-live-mask" className={`toggle-x ${showChat ? 'off' : 'on'}`}
                     onClick={() => setShowChat(!showChat)}>
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default memo(ChatSettings);