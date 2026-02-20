"use client"

import {memo, useEffect, useState} from "react";
import UserPanel from "@/components/layout/UserPanel";
import CustomLink from "@/components/shared/CustomLink";
import {homeUrl, robongHomeUrl, userNotificationUrl} from "@/utils/url";
import HeaderSearch from "./Search";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setShowDropdownNotification, setShowDropdownUserMenu} from "@/redux/features/userSlice";
import MenuCountry from "@/components/layout/MenuCountry";
import {usePathname} from "next/navigation";
import AppDownload from "@/components/layout/AppDownload";
import MenuGenre from "@/components/layout/MenuGenre";
import MenuMore from "@/components/layout/MenuMore";

const Header = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const [mShowMenu, setMShowMenu] = useState(false)
    const [mShowSearch, setMShowSearch] = useState(false)
    const {loggedUser} = useAppSelector(state => state.auth)
    const {
        totalNew,
    } = useAppSelector(state => state.user)

    useEffect(() => {
        const header = document.querySelector("header");

        const handleScrollEvent = () => {
            const scrollY = window.scrollY
            if (scrollY >= 30) {
                header.classList.add("fixed")
            } else {
                header.classList.remove("fixed")
            }
        }

        window.addEventListener("scroll", handleScrollEvent);

        return () => {
            window.removeEventListener('scroll', handleScrollEvent)
        }
    }, []);

    useEffect(() => {
        if (loggedUser) {
            setMShowMenu(false)
            dispatch(setShowDropdownUserMenu(false))
        }
    }, [loggedUser])

    useEffect(() => {
        setMShowMenu(false)
        dispatch(setShowDropdownNotification(false))
        dispatch(setShowDropdownUserMenu(false))
    }, [pathname])

    const mobile_handleMenuClick = () => {
        setMShowMenu(!mShowMenu)
        dispatch(setShowDropdownUserMenu(!mShowMenu))
    }

    const mobile_handleSearchClick = () => {
        setMShowSearch(!mShowSearch)
    }

    return (
        <header className="fly">
            <div className={`header-elements ${mShowSearch ? "simple" : ""}`}>
                <div className={`for-mobile menu-toggle ${mShowMenu ? "toggled" : ""}`}
                     onClick={mobile_handleMenuClick}>
                    <div className="icon-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className={`for-mobile search-toggle ${mShowSearch ? "toggled" : ""}`}
                     onClick={mobile_handleSearchClick}>
                    <div className="icon-search">
                        <span></span>
                        <span></span>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                {loggedUser && <CustomLink href={userNotificationUrl()} className="for-mobile noti-toggle">
                    <div className="icon-noti">
                        <i className="fa-solid fa-bell"></i>
                    </div>
                    {totalNew > 0 && <span className="small ms-1">{totalNew}</span>}
                </CustomLink>}
                <CustomLink id="logo" href={homeUrl()} title="Rophim"><img
                    src={loggedUser?.is_vip ? '/images/logo_rox.svg' : '/images/logo.svg'} alt="RoPhim"/></CustomLink>
                <HeaderSearch mShowSearch={mShowSearch} setMShowSearch={setMShowSearch}/>
                <div className={`el-group ${mShowMenu ? "toggled" : ""}`}>
                    <div id="main_menu">
                        <div className="menu-item"><CustomLink href="/phim-le" title="Phim lẻ">Phim Lẻ</CustomLink>
                        </div>
                        <div className="menu-item"><CustomLink href="/phim-bo" title="Phim bộ">Phim Bộ</CustomLink>
                        </div>
                        <MenuGenre/>
                        <MenuCountry/>
                        <div className="menu-item">
                            <CustomLink href="/xem-chung" title="Xem Chung">Xem Chung</CustomLink>
                        </div>
                        <MenuMore/>
                    </div>
                    <div className="flex-grow-1"></div>
                    <AppDownload/>
                    <UserPanel/>
                </div>
            </div>
        </header>
    )
}

export default memo(Header)