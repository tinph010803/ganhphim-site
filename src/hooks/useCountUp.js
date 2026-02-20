"use client"

import {useEffect, useState} from 'react'

const useCountUp = (startTime, callback = null) => {
    const initialOffsetSet = startTime !== null && startTime > 0;
    const [countUp, setCountUp] = useState(initialOffsetSet ? Date.now() - startTime : 0);

    useEffect(() => {
        if (!initialOffsetSet) return;

        const interval = setInterval(() => {
            setCountUp(Date.now() - new Date(startTime).getTime());
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, initialOffsetSet])

    return getReturnValues(countUp)
}

const getReturnValues = (countUp) => {
    const days = Math.floor(countUp / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (countUp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((countUp % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((countUp % (1000 * 60)) / 1000)

    return [days, hours, minutes, seconds]
}

export default useCountUp
