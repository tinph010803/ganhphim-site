"use client"

import {memo, useEffect, useState} from "react";
import W2gApi from "@/api/w2g.api";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {addRemindRoomIds, removeRemindRoomIds} from "@/redux/features/w2gSlice";
import RemindIcon from "@/components/icons/Remind";
import {showToast} from "@/utils/helpers";

const ButtonRemind = ({room, position = "list"}) => {
    const dispatch = useAppDispatch();
    const [totalRemind, setTotalRemind] = useState(room.total_remind || 0);
    const [isReminded, setIsReminded] = useState(false);
    const remindRoomIds = useAppSelector(s => s.w2g.remindRoomIds)
    const loggedUser = useAppSelector(s => s.auth.loggedUser)

    useEffect(() => {
        setIsReminded(remindRoomIds && remindRoomIds.indexOf(room._id) >= 0);
    }, [remindRoomIds]);

    const handleRemindClick = async () => {
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }

        if (remindRoomIds.indexOf(room._id) >= 0) {
            dispatch(removeRemindRoomIds(room._id.toString()))
            setTotalRemind(totalRemind - 1)
        } else {
            dispatch(addRemindRoomIds(room._id.toString()))
            setTotalRemind(totalRemind + 1)
        }
        await W2gApi.remind(room._id)
    }

    if (position === "list")
        return (
            <div
                className={`current-status remind-me ${isReminded ? 'active' : ''}`}
                onClick={handleRemindClick}>
                <i className="fa-solid fa-bell"></i>
                <span>{totalRemind > 0 ? totalRemind : `Nhắc`}</span>
            </div>
        )

    if (position === "list_home")
        return (
            <button className={`btn btn-sm btn-outline remind-me ${isReminded ? 'active' : ''}`}
                    onClick={handleRemindClick}>
                <i className="fa-regular fa-bell"></i>
                <span>{totalRemind > 0 ? totalRemind : `Nhắc`}</span>
            </button>
        )

    if (position === "detail")
        return (
            <div className={`remind line-center flex-grow-1 ${isReminded ? 'active' : ''}`} onClick={handleRemindClick}>
                <div className="inc-icon icon-16">
                    <RemindIcon/>
                </div>
                <span>Nhắc tôi</span>
            </div>
        )
}

export default memo(ButtonRemind)