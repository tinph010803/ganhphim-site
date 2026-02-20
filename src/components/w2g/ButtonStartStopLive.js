"use client"

import {memo, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux"
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const W2gButtonStartStopLive = ({room}) => {
    const dispatch = useAppDispatch();
    const loggedUser = useAppSelector(state => state.auth.loggedUser)
    const {roomStatus} = useAppSelector(s => s.w2g)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        if (loggedUser?._id === room.user_id) setIsOwner(true)
    }, [loggedUser]);

    const handleClick = () => {
        const conf = confirm(`Bạn có chắc chắn muốn ${roomStatus === 0 ? 'bắt đầu' : 'kết thúc'} live không?`)
        if (!conf) return

        if (roomStatus === 0)
            dispatch({type: socketActions.startLive, payload: room._id})

        if (roomStatus === 1)
            dispatch({type: socketActions.endLive, payload: room._id})
    }

    if (!isOwner) return null

    if (roomStatus === 1)
        return (
            <a className="btn btn-sm btn-light btn-rounded btn-end-live" onClick={handleClick}>
                <i className="fa-solid fa-video-slash text-danger"></i>
                <span>Kết thúc</span>
            </a>
        )

    if (roomStatus === 0)
        return (
            <a className="btn btn-sm btn-light btn-rounded btn-start-live" onClick={handleClick}>
                <i className="fa-solid fa-play"></i>
                <span>Bắt đầu</span>
            </a>
        )
}

export default memo(W2gButtonStartStopLive)