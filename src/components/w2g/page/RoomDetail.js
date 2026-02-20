"use client"

import {movieBackdrop, userAvatar} from "@/utils/image";
import {timeAgo} from "@/utils/helpers";
import W2gMovieInfo from "@/components/w2g/MovieInfo";
import W2gChatBox from "@/components/w2g/chat/ChatBox";
import {memo, useEffect, useRef, useState} from "react";
import TimeCountDown from "@/components/w2g/TimeCountDown";
import RemindIcon from "@/components/icons/Remind";
import W2gIcon from "@/components/icons/W2g";
import Link from "next/link";
import {movieDetailUrl} from "@/utils/url";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import W2gTimeCountUp from "@/components/w2g/TimeCountUp";
import {
    fetchRemindRoomIds,
    setRoomEpisode,
    setRoomId,
    setRoomPlayerStartTime,
    setRoomSeason,
    setRoomStartLive,
    setRoomStartTime,
    setRoomStatus,
    setTotalViewers
} from "@/redux/features/w2gSlice";
import W2gButtonStartStopLive from "@/components/w2g/ButtonStartStopLive";
import W2gPlayer from "@/components/w2g/Player";
import ButtonRemind from "@/components/w2g/ButtonRemind";
import Cookies from "js-cookie";
import W2gApi from "@/api/w2g.api";
import W2gButtonShare from "@/components/w2g/ButtonShare";
import W2gTotalViewers from "@/components/w2g/TotalViewers";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const W2gPageRoomDetail = ({room}) => {
    const dispatch = useAppDispatch()
    const {roomStatus, remindRoomIds, roomSeason, roomEpisode} = useAppSelector(s => s.w2g)
    const {loggedUser, accessToken} = useAppSelector(state => state.auth)
    const [isOwner, setIsOwner] = useState(false)
    const [minPlayer, setMinPlayer] = useState(false)
    const [backdrop, setBackdrop] = useState("")

    useEffect(() => {
        const COOKIE_NAME = `w2g_lastView_${room._id}`
        const TTL = 30 * 60 * 1000
        const now = Date.now()

        const last = parseInt(Cookies.get(COOKIE_NAME) || '0', 10)

        if (now - last > TTL) {
            try {
                W2gApi.logView(room._id)

                Cookies.set(COOKIE_NAME, now.toString(), {expires: 1})
            } catch (e) {

            }
        }

        setBackdrop(movieBackdrop(room.movie.images.backdrops))
    }, [room])

    useEffect(() => {
        if (loggedUser?._id === room.user_id) setIsOwner(true)
    }, [loggedUser, room]);

    useEffect(() => {
        if (remindRoomIds === null && loggedUser) {
            dispatch(fetchRemindRoomIds())
        }
    }, [loggedUser]);

    useEffect(() => {
        dispatch(setRoomId(room._id))
        dispatch(setRoomStatus(room.status))
        dispatch(setRoomStartTime(room.start_time))
        dispatch(setRoomPlayerStartTime(room.player_start_time))
        dispatch(setRoomSeason(room.season))
        dispatch(setRoomEpisode(room.episode))

        return () => {
            dispatch(setRoomId(null))
            dispatch(setRoomStatus(null))
            dispatch(setRoomStartTime(null))
            dispatch(setRoomPlayerStartTime(null))
            dispatch(setRoomSeason(null))
            dispatch(setRoomEpisode(null))
        }
    }, [room]);

    useEffect(() => {
        return () => {
            document.body.classList.remove("body_live")
        }
    }, []);

    const startLive = async () => {
        const conf = confirm("Bạn muốn bắt đầu live luôn?")
        if (conf) {
            dispatch({type: socketActions.startLive, payload: room._id})
        }
    }

    return (
        <div id="live" className="live-status-play">
            <div className="live_layout">
                <div className="l_content">
                    <div className="l_watch">
                        <div className="lw-header">
                            <div className="live-back">
                                <Link href="/xem-chung" className="btn btn-outline btn-circle">
                                    <i className="fa-solid fa-angle-left"></i>
                                </Link>
                            </div>
                            <div className="lw-header-rows">
                                <div className="live-name">
                                    {roomStatus === 1 && <div className="live-tag blink me-1">LIVE</div>}
                                    <span>{room.title}</span>
                                </div>
                                <div className="live-source info-line">
                                    {room.movie.type === 2 &&
                                        <div className="tag-small">Phần {roomSeason} - Tập {roomEpisode}</div>}
                                    <div className="tag-small tag-name">{room.movie.title}</div>
                                </div>
                            </div>
                            <W2gButtonStartStopLive room={room}/>
                        </div>
                        <div className={`lw-player ${minPlayer ? 'min-size' : ''}`}>
                            {roomStatus === 1 && <W2gPlayer room={room} isOwner={isOwner} loggedUser={loggedUser}/>}
                            {roomStatus === 0 && <>
                                <div className="video-frame">
                                    <div className="back-cover"
                                         style={{backgroundImage: `url(${backdrop})`}}></div>
                                </div>
                            </>}
                            {(roomStatus === 0 && room.estimated_time > 0) && <>
                                <div className={`live-countdown ${!room.is_premiere ? 'center' : ''}`}>
                                    <div className="min">Buổi {!room.is_premiere ? 'xem chung' : 'công chiếu'}</div>
                                    <div className="text">
                                        <strong className="text-primary">{room.movie.title}</strong> sẽ được
                                        lên sóng sau:
                                    </div>
                                    <div className="count-start line-center gap-3">
                                        <TimeCountDown page="detail" time={room.estimated_time}/>
                                        <ButtonRemind room={room} position="detail"/>
                                    </div>
                                    {isOwner && <div className="quick-play mt-2">
                                        <a className="btn btn-sm btn-basic p-0" onClick={() => startLive()}>
                                            <i className="fa-solid fa-play me-1"></i>
                                            <span>Bắt đầu luôn</span>
                                        </a>
                                    </div>}
                                </div>
                            </>}
                            {(roomStatus === 0 && room.estimated_time === 0) && (
                                <div className={`live-countdown center ${!room.is_premiere ? 'center' : ''}`}>
                                    <div className="min">Buổi {!room.is_premiere ? 'xem chung' : 'công chiếu'}</div>
                                    <div className="text">
                                        <strong className="text-primary">{room.movie.title}</strong>
                                    </div>
                                    <div className="count-start line-center gap-3">
                                        <div className="btn btn-lg btn-light">
                                            <i className="fa-regular fa-hourglass-half count-time"></i>
                                            <span>Đang chờ</span>
                                        </div>
                                        <div className="remind line-center flex-grow-1">
                                            <div className="inc-icon icon-16">
                                                <RemindIcon/>
                                            </div>
                                            <span>Nhắc tôi</span>
                                        </div>
                                    </div>
                                    {isOwner && <div className="quick-play mt-2">
                                        <a className="btn btn-sm btn-basic p-0" onClick={() => startLive()}>
                                            <i className="fa-solid fa-play me-1"></i>
                                            <span>Bắt đầu luôn</span>
                                        </a>
                                    </div>}
                                </div>
                            )}
                            {roomStatus === 2 && <>
                                <div className="live-countdown center">
                                    <div className="min">Đã kết thúc</div>
                                    <div className="text">
                                        <strong className="text-primary">{room.movie.title}</strong>
                                    </div>
                                    <div className="buttons w-100 mt-3">
                                        <Link className="btn btn-lg btn-light" href={movieDetailUrl(room.movie)}>
                                            <i className="fa-solid fa-play size-16"></i>
                                            <span>Xem riêng</span>
                                        </Link>
                                        <Link className="btn btn-lg btn-outline" href="/xem-chung">
                                            <div className="inc-icon icon-16">
                                                <W2gIcon/>
                                            </div>
                                            <span>Live khác</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="video-frame">
                                    <div className="back-cover"
                                         style={{backgroundImage: `url(${backdrop})`}}></div>
                                </div>
                            </>}
                        </div>
                        <div className="lw-bottom">
                            <div className="flex-container">
                                <div className="live-owner line-center">
                                    <div className={`user-avatar ${roomStatus === 1 ? 'o-live' : ''}`}>
                                        {room.user &&
                                            <img src={userAvatar(room.user)} alt={room.user.name}/>}
                                        {room.user === null &&
                                            <img src="/images/avatars/avatar-ro.webp" alt="Rổ Phim"/>}
                                    </div>
                                    <div className="o-info">
                                        <div className="user-name">{room.user ? room.user.name : "Rổ Phim"}</div>
                                        <div className="created">Tạo {timeAgo(room.created_at)}</div>
                                    </div>
                                </div>
                                {roomStatus !== 2 && <>
                                    {roomStatus === 1 && <div className={`live-min ${minPlayer ? 'active' : ''}`}
                                                              onClick={() => setMinPlayer(!minPlayer)}>
                                        <div className="line-center">
                                            <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
                                            <span>Hình nhỏ</span>
                                        </div>
                                    </div>}
                                    <W2gTimeCountUp/>
                                    <W2gTotalViewers roomId={room._id}/>
                                    <W2gButtonShare/>
                                    <div className="live-source">
                                        <Link href={movieDetailUrl(room.movie)} className="line-center" target="_blank">
                                            <i className="fa-solid fa-play-circle"></i>
                                            <span>Xem riêng</span>
                                        </Link>
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                    <W2gMovieInfo movie={room.movie}/>
                </div>
                <W2gChatBox room={room}/>
            </div>
        </div>
    )
}

export default memo(W2gPageRoomDetail)