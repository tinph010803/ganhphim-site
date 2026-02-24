"use client"

import Link from "next/link";
import {setLoggedUser} from "@/redux/features/authSlice";
import {compactNumber, showToast} from "@/utils/helpers";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
    idpDepositUrl, idpUpgradeUrl, userProfileUrl,
    userContinueWatchingUrl,
    userFavoriteUrl,
    userPlaylistUrl,
} from "@/utils/url";
import {forwardRef, memo} from "react";
import {userAvatar} from "@/utils/image";
import {Dropdown} from "react-bootstrap";
import {setShowDropdownUserMenu} from "@/redux/features/userSlice";
import UserName from "@/components/user/Name";
import dayjs from "@/utils/dayjs";
import AuthApi from "@/api/auth.api";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
    return (
        <a className="header-user">
            <div className="line-center gap-3" ref={ref} onClick={onClick}>
                {children}
                <i className="fa-solid fa-caret-down"></i>
            </div>
        </a>
    )
})

const UserHeaderMenu = ({}) => {
    const dispatch = useAppDispatch()
    const {showDropdownUserMenu} = useAppSelector(state => state.user)
    const {loggedUser} = useAppSelector(state => state.auth)

    const handleLogout = async () => {
        const {status, msg} = await AuthApi.logout();

        if (status) {
            dispatch(setLoggedUser(null))
        } else {
            showToast({message: msg, type: 'error'})
        }
    }

    const handleToggleDropdown = (isOpen) => {
        dispatch(setShowDropdownUserMenu(isOpen))
    }

    return (
        <Dropdown drop="down" align="end" show={showDropdownUserMenu} onToggle={handleToggleDropdown}>
            <Dropdown.Toggle as={CustomToggle}>
                <div className="user-avatar">
                    <img src={userAvatar(loggedUser)} alt={loggedUser?.name}/>
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="v-dropdown-menu user-dropdown bg-dark">
                <div className="dropdown-vip d-flex flex-column gap-2">
                    <UserName user={loggedUser}/>
                    <div className="call-upgrade">
                        <div className="small pb-1" dangerouslySetInnerHTML={{
                            __html: loggedUser?.is_vip ? `Tài khoản <strong>RoX</strong> tới: <strong>${dayjs.unix(loggedUser?.vip_expires_at).format("DD/MM/YYYY")}</strong>` : `Nâng cấp tài khoản <strong>RoX</strong> để có trải nghiệm đẳng cấp
                            hơn.`
                        }}></div>
                        <div className="buttons mt-2">
                            <Link href={idpUpgradeUrl} className="btn btn-xs w-100 btn-primary" target="_blank">
                                <span>{loggedUser?.is_vip ? `Gia hạn` : `Nâng cấp ngay`}</span>
                                <i className="fa-solid fa-angles-up"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className="my-2"/>
                <div className="dropdown-wallet">
                    <div className="wallet-display">
                        <div className="is-display s-size line-center gap-2">
                            <div className="my-wallet line-center">
                                <i className="fa-solid fa-wallet"></i>
                                <span>Số dư</span>
                            </div>
                            <div className="amount line-center gap-2 ps-3">
                                <span>{compactNumber(loggedUser?.coin_balance)}</span>
                                <div className="ro-coin"></div>
                            </div>
                            <Link className="btn btn-xs btn-light btn-rounded" href={idpDepositUrl} target="_blank">
                                <i className="fa-solid fa-plus"></i>
                                <span>Nạp</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className="my-2"/>
                <div className="ui-mobile">
                    <Link href={userFavoriteUrl()} className="dropdown-item">
                        <div className="line-center">
                            <i className="fa-solid fa-heart"></i>
                            <span>Yêu thích</span>
                        </div>
                    </Link>
                    <Link href={userPlaylistUrl()} className="dropdown-item">
                        <div className="line-center">
                            <i className="fa-solid fa-plus"></i>
                            <span>Danh sách</span>
                        </div>
                    </Link>
                    <Link href={userContinueWatchingUrl()} className="dropdown-item">
                        <div className="line-center">
                            <i className="fa-solid fa-history"></i>
                            <span>Xem tiếp</span>
                        </div>
                    </Link>
                    <Link href={userProfileUrl()} className="dropdown-item">
                        <div className="line-center">
                            <i className="fa-solid fa-user"></i>
                            <span>Tài khoản</span>
                        </div>
                    </Link>
                    <hr className="my-2"/>
                    <a onClick={() => handleLogout()} className="dropdown-item">
                        <div className="line-center">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Thoát</span>
                        </div>
                    </a>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default memo(UserHeaderMenu)