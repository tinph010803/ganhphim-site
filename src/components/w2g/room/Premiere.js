"use client"

import {timeAgo} from "@/utils/helpers";
import MovieImagesBackdrop from "@/components/movie/images/Backdrop";
import TimeCountDown from "@/components/w2g/TimeCountDown";
import {w2gRoomUrl} from "@/utils/url";
import Link from "next/link";
import {memo} from "react";
import ButtonRemind from "@/components/w2g/ButtonRemind";

const RoomPremiere = ({room}) => {
    return (
        <div
            className={`card-live ${room.status === 0 ? 'card-live-coming' : (room.status === 1 ? 'card-live-air' : 'card-live-end')}`}>
            <div className="v-thumbnail v-thumbnail-hoz">
                {room.status === 1 && <div className="live-tag blink">LIVE</div>}
                {(room.status === 1 && room.online > 0) && <div className="current-status status-live">
                    <i className="fa-solid fa-eye"></i>
                    <span>{room.online} đang xem</span>
                </div>}
                {room.status === 0 && <ButtonRemind room={room}/>}
                {(room.status === 0 && room.estimated_time > 0) && <>
                    <div className="current-status status-coming">
                        <TimeCountDown page="list" time={room.estimated_time}/>
                    </div>
                </>}
                {(room.status === 0 && room.estimated_time === 0) && <>
                    <div className="current-status status-coming">
                        <div className="line-center">
                            <i className="fa-regular fa-hourglass-half count-time"></i>
                            <span>Đang chờ</span>
                        </div>
                    </div>
                </>}
                {room.status === 2 && <div className="current-status status-end">
                    <i className="fa-solid fa-video-slash"></i>
                    <span>Đã kết thúc</span>
                </div>}
                <Link className="live-mask" href={w2gRoomUrl(room)} title={room.title}></Link>
                <MovieImagesBackdrop movie={room.movie} size={`500-0`}/>
            </div>
            <div className="card-live-detail">
                <div className={`user-avatar ${room.status === 1 ? 'o-live' : ''} `}>
                    <img src="/images/avatars/avatar-ro.webp"/>
                </div>
                <div className="is-info">
                    <h4 className="live-name lim-2">
                        <Link href={w2gRoomUrl(room)} title={room.title}>{room.title}</Link>
                    </h4>
                    <h5 className="source-name lim-1">{room.movie.type === 2 ? `P.${room.season} - T.${room.episode} - ` : ``}{room.movie.title}</h5>
                    <div className="info-line">
                        <div className="tag-small tag-user">
                            <span className="user-name">Rổ Phim</span>
                        </div>
                        <div className="tag-small">{timeAgo(room.created_at)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(RoomPremiere)