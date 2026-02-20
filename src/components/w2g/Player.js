"use client"

import {memo, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {useSearchParams} from "next/navigation";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const W2gPlayer = ({room, isOwner, loggedUser}) => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const [playerUrl, setPlayerUrl] = useState("");
    const roomPlayerStartTime = useAppSelector(s => s.w2g.roomPlayerStartTime)

    useEffect(() => {
        const queryParams = []

        if (searchParams.get("dddeeebbbuuuggg")) {
            queryParams.push("dddeeebbbuuuggg=3")
        }

        if (room.is_premiere) {
            queryParams.push(`url=${encodeURIComponent(Object.values(room.streaming_links)[1])}`)
            setPlayerUrl(`https://goatembed.com/live?${queryParams.join("&")}`);
        } else {
            queryParams.push(`start_time=${roomPlayerStartTime * 1000}`)
            if (loggedUser) {
                queryParams.push(`token=${encodeURIComponent(loggedUser.token)}`)
            }
            if (room.movie.type === 2) {
                queryParams.push(`season=${room.season}`)
                queryParams.push(`episode=${room.episode}`)
            }
            setPlayerUrl(`https://goatembed.com/w2g/${room._id}?${queryParams.join("&")}`)
        }
    }, [room, loggedUser]);

    useEffect(() => {
        const handleEventMessage = (event) => {
            if (event.origin === "https://goatembed.com") {
                const eventData = event.data
                if (eventData.event === "time") {
                    const {time} = eventData.param
                }
                if (eventData.event === "change_episode") {
                    const {season, episode} = eventData.param
                    if (isOwner) {
                        dispatch({type: socketActions.changeEpisode, payload: {roomId: room._id, season, episode}})
                    }
                }
                if (eventData.event === "change_audio") {
                    const {version} = eventData.param
                }
            }
        }

        window.addEventListener("message", handleEventMessage)

        return () => {
            window.removeEventListener("message", handleEventMessage)
        }
    }, [isOwner]);

    if (!playerUrl) return null;

    return (
        <div className="video-frame">
            <iframe src={playerUrl} id="embed-player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="no-referrer"
                    allowFullScreen></iframe>
        </div>
    )
}

export default memo(W2gPlayer)