"use client"

import {timeAgo} from "@/utils/helpers";
import {moviePoster, userAvatar} from "@/utils/image";
import Link from "next/link";
import {w2gRoomUrl} from "@/utils/url";
import {memo, useEffect, useState} from "react";
import TimeCountDown from "@/components/w2g/TimeCountDown";
import ButtonRemind from "@/components/w2g/ButtonRemind";

const RoomNormalHome = ({room}) => {
    const [poster, setPoster] = useState(null)

    useEffect(() => {
        setPoster(moviePoster(room.movie.images.posters))
    }, [])

    return (
        <div
            className={`card-live ${room.status === 0 ? 'card-live-coming' : (room.status === 1 ? 'card-live-air' : 'card-live-end')}`}>
            <Link href={w2gRoomUrl(room)} className="v-thumbnail">
                <img src={poster} alt={room.title}/>
            </Link>
            <div className="card-live-detail">
                <div className={`user-avatar ${room.status === 1 ? 'o-live' : ''} `}>
                    <img src={userAvatar(room.user)} alt={room.user.name}/>
                </div>
                <div className="is-info">
                    <h4 className="live-name lim-2">
                        <Link href={w2gRoomUrl(room)} title={room.title}>{room.title}</Link>
                    </h4>
                    <h5 className="source-name lim-1">{room.movie.type === 2 ? `P.${room.season} - T.${room.episode} - ` : ``}{room.movie.title}</h5>
                    <div className="info-line">
                        <div className="tag-small tag-user">
                            <a>
                                <span className="user-name">{room.user.name}</span>
                            </a>
                        </div>
                        <div className="tag-small">{timeAgo(room.created_at)}</div>
                    </div>
                </div>
                {room.status === 0 && <div className="home-live-status">
                    <Link href={w2gRoomUrl(room)} className="btn btn-sm btn-outline">
                        <i className="fa-regular fa-hourglass-half count-time me-1"></i>
                        {room.estimated_time > 0 && <TimeCountDown page="list_home" time={room.estimated_time}/>}
                        {room.estimated_time === 0 && <span className="time-left">Đang chờ</span>}
                    </Link>
                    <ButtonRemind room={room} position="list_home"/>
                </div>}
                {room.status === 1 && <div className="home-live-status">
                    <Link href={w2gRoomUrl(room)} className="btn btn-sm btn-light">
                        <i className="fa-solid fa-play"></i>
                        <span>Xem ngay</span>
                    </Link>
                </div>}
                {room.status === 2 && <div className="home-live-status">
                    <Link href={w2gRoomUrl(room)} className="btn btn-sm btn-outline end">
                        <i className="fa-solid fa-video-slash"></i>
                        <span>Đã kết thúc</span>
                    </Link>
                </div>}
            </div>
        </div>
    )
}

export default memo(RoomNormalHome)