"use client"

import useCountdown from "@/hooks/useCountdown";
import {currentTimestamp} from "@/utils/helpers"
import {memo} from "react";

const W2gTimeCountDown = ({time, page}) => {
    if (time < currentTimestamp()) return null

    const [days, hours, minutes, seconds] = useCountdown(time * 1000)

    if (page === "list")
        return (
            <>
                <div className="line-center">
                    <i className="fa-regular fa-hourglass-half count-time"></i>
                    <span>Chiếu sau:</span>
                </div>
                <div className="time-left">
                    {days > 0 ? `${days.toString().padStart(2, "0")}:` : ``}{hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </div>
            </>
        )

    if (page === "list_home")
        return (
            <div className="time-left">{days.toString().padStart(2, "0")} : {hours.toString().padStart(2, "0")} : {minutes.toString().padStart(2, "0")} : {seconds.toString().padStart(2, "0")}</div>
        )

    if (page === "detail")
        return (
            <div id="countdown"
                 className="flex-shink-0">{days.toString().padStart(2, "0")} : {hours.toString().padStart(2, "0")} : {minutes.toString().padStart(2, "0")} : {seconds.toString().padStart(2, "0")}</div>
        )
}

export default memo(W2gTimeCountDown)