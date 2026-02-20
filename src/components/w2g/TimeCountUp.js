"use client";

import useCountUp from "@/hooks/useCountUp";
import {useAppSelector} from "@/hooks/redux";
import {memo} from "react";

const W2gTimeCountUp = () => {
    const {roomStartTime} = useAppSelector((s) => s.w2g);
    const [days, hours, minutes, seconds] = useCountUp(roomStartTime ? roomStartTime * 1000 : null);

    if (!roomStartTime || roomStartTime === 0) return null;

    const formatTime = (days, hours, minutes, seconds) => {
        let parts = []
        if (days > 0) parts.push(days.toString().padStart(2, "0"))
        parts = [...parts, hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),]
        return parts.join(":");
    };

    return (
        <div className="live-progress" aria-live="polite">
            <div className="line-center">
                <i className="fa-solid fa-clock" aria-hidden="true"></i>
                <span>{formatTime(days, hours, minutes, seconds)}</span>
            </div>
        </div>
    );
};

export default memo(W2gTimeCountUp);