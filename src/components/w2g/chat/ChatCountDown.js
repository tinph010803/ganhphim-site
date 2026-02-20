"use client"

import {memo} from "react";
import {useAppSelector} from "@/hooks/redux";

const ChatCountDown = ()=>{
    const cooldown = useAppSelector((s) => s.chat.cooldown);
    if (cooldown === 0) return null;

    return (
        <div className="is_bottom-alert line-center">
            <i className="fa-regular fa-hourglass-half count-time"></i>
            <div>Chờ <span className="text-primary">{cooldown}s</span> để gửi chat tiếp theo</div>
        </div>
    )
}

export default memo(ChatCountDown);