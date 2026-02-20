"use client"

import {memo} from "react";
import {useAppSelector} from "@/hooks/redux"

const W2gTotalViewers = ({roomId}) => {
    const totalOnline = useAppSelector(s => s.socket.rooms?.[roomId]?.online);

    return (
        <div className="live-count">
            <div className="line-center">
                <i className="fa-solid fa-eye"></i>
                <span>{totalOnline}</span>
            </div>
        </div>
    )
}

export default memo(W2gTotalViewers)