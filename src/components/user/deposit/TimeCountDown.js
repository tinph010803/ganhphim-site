"use client"

import useCountdown from "@/hooks/useCountdown";
import {memo, useEffect} from "react";
import {useAppDispatch} from "@/hooks/redux";
import {setStatus} from "@/redux/features/paymentSlice";

const DepositTimeCountdown = ({time}) => {
    const dispatch = useAppDispatch()
    const [days, hours, minutes, seconds] = useCountdown(time * 1000)

    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            dispatch(setStatus("timeout"))
        }
    }, [minutes, seconds]);

    return (
        <div className="pm-countdown">
            <small>Thời gian còn lại</small>
            <span>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</span>
        </div>
    )
}

export default memo(DepositTimeCountdown)