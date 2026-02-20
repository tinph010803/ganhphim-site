"use client"

import {memo} from "react";

const UserName = ({user, style = {},customClass=""}) => {
    const renderGenderIcon = ({gender}) => {
        if (gender === 1) return <i className="fas fa-venus text-primary ms-2"></i>
        if (gender === 2) return <i className="fas fa-mars text-primary ms-2"></i>
        if (gender === 3) return <i className="fa-solid fa-infinity text-primary ms-2"></i>
    }

    if (["admin", "mod"].indexOf(user.role) >= 0)
        return (
            <div
                className={`user-name line-center ${user.role === "admin" ? "gr-admin" : "gr-mod"} ${customClass}`} style={style}>
                <div className="gr-tag">{user.role === "admin" ? "Admin" : "Mod"}</div>
                <span>{user.name} {renderGenderIcon({gender: user.gender})}</span>
            </div>
        )
    else if (user.is_vip) {
        return (
            <div
                className={`user-name line-center gr-rox ${customClass}`} style={style}>
                <div className="gr-tag gr-tag-rox">RoX</div>
                <span>{user.name} {renderGenderIcon({gender: user.gender})}</span>
            </div>
        )
    } else
        return (
            <div className={`user-name line-center gr-free ${customClass}`} style={style}>
                <span>{user.name} {renderGenderIcon({gender: user.gender})}</span>
            </div>
        )
}

export default memo(UserName)