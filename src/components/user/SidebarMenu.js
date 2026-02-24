"use client"

import Link from "next/link";
import {setLoggedUser} from "@/redux/features/authSlice";
import {showToast} from "@/utils/helpers";
import {useAppDispatch} from "@/hooks/redux";
import {
    userProfileUrl,
    userContinueWatchingUrl,
    userFavoriteUrl,
    userNotificationUrl,
    userPlaylistUrl,
} from "@/utils/url";
import {memo} from "react";
import {userAvatar} from "@/utils/image";
import UserName from "@/components/user/Name";
import AuthApi from "@/api/auth.api";

const UserSidebarMenu = ({loggedUser, page}) => {
    const dispatch = useAppDispatch()

    const handleLogoutClick = async () => {
        const {status, msg} = await AuthApi.logout();

        if (status) {
            dispatch(setLoggedUser(null))
        } else {
            showToast({message: msg, type: 'error'})
        }
    }

    return (
        <div className="dcc-side">
            <div className="ds-menu">
                <div className="heading-sm">Quản lý tài khoản</div>
                <div className="menu-user">
                    <Link href={userFavoriteUrl()} className={`item ${page === 'favorite' ? 'active' : ''}`}>
                        <div className="line-center">
                            <i className="fa-solid fa-heart"></i>
                            <span>Yêu thích</span>
                        </div>
                    </Link>
                    <Link href={userPlaylistUrl()} className={`item ${page === 'playlist' ? 'active' : ''}`}>
                        <div className="line-center">
                            <i className="fa-solid fa-plus"></i>
                            <span>Danh sách</span>
                        </div>
                    </Link>
                    <Link href={userContinueWatchingUrl()}
                          className={`item ${page === 'continueWatching' ? 'active' : ''}`}>
                        <div className="line-center">
                            <i className="fa-solid fa-history"></i>
                            <span>Xem tiếp</span>
                        </div>
                    </Link>
                    <Link href={userNotificationUrl()} className={`item ${page === 'notification' ? 'active' : ''}`}>
                        <div className="line-center">
                            <i className="fa-solid fa-bell"></i>
                            <span>Thông báo</span>
                        </div>
                    </Link>
                    <Link href={userProfileUrl()} className={`item ${page === 'profile' ? 'active' : ''}`}>
                        <div className="line-center">
                            <i className="fa-solid fa-user"></i>
                            <span>Tài khoản</span>
                        </div>
                    </Link>
                </div>
                <div className="side-user">
                    <div className="user-avatar">
                        <img src={userAvatar(loggedUser)} alt={loggedUser.name}/>
                    </div>
                    <div className="info">
                        <UserName user={loggedUser}/>
                        <div className="alias-name lim-1 mb-3">{loggedUser.email}</div>
                        <a className="btn btn-sx btn-basic px-0" onClick={() => handleLogoutClick()}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Thoát</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(UserSidebarMenu)