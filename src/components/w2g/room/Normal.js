"use client"

import {showToast, timeAgo} from "@/utils/helpers";
import MovieImagesPoster from "@/components/movie/images/Poster";
import TimeCountDown from "@/components/w2g/TimeCountDown";
import {moviePoster, userAvatar} from "@/utils/image";
import Link from "next/link";
import {w2gRoomUrl} from "@/utils/url";
import {forwardRef, memo, useEffect, useState} from "react";
import ButtonRemind from "@/components/w2g/ButtonRemind";
import {Dropdown} from "react-bootstrap";
import W2gApi from "@/api/w2g.api";
import {useAppDispatch} from "@/hooks/redux";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <a className="btn btn-sm btn-circle btn-outline" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}>
        <i className="fa-solid fa-ellipsis-v"></i>
    </a>
))

const DropdownActions = ({room}) => {
    const dispatch = useAppDispatch()
    const [showDropdown, setShowDropdown] = useState(false)

    const deleteRoom = async () => {
        const {status, msg} = await W2gApi.deleteRoom(room._id)
        if (status) {
            showToast({message: msg, type: "success"})
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            showToast({message: msg, type: "error"})
        }
    }

    const handleActionClick = async (action) => {
        switch (action) {
            case "delete":
                await deleteRoom()
                break
            case "endLive":
                const conf1 = confirm("Bạn có chắc chắn muốn kết thúc live không?")
                if (conf1) {
                    dispatch({type: socketActions.endLive, payload: room._id})
                    setShowDropdown(false)
                }
                break
            case "startLive":
                const conf2 = confirm("Bạn có chắc chắn muốn bắt đầu live không?")
                if (conf2) {
                    dispatch({type: socketActions.startLive, payload: room._id})
                    setShowDropdown(false)
                }
                break
        }
    }

    return (
        <Dropdown className="is-option" show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
            <Dropdown.Toggle as={CustomToggle}/>
            <Dropdown.Menu className="v-dropdown-menu">
                {room.status === 0 &&
                    <a className="dropdown-item" onClick={() => handleActionClick('startLive')}><i
                        className="fa-solid fa-play"></i><span>Bắt đầu</span></a>}
                {room.status === 1 &&
                    <a className="dropdown-item text-danger" onClick={() => handleActionClick('endLive')}><i
                        className="fa-solid fa-video-slash"></i><span>Kết thúc</span></a>}
                {[0, 2].indexOf(room.status) >= 0 &&
                    <a className="dropdown-item text-danger" onClick={() => handleActionClick('delete')}><i
                        className="fa-solid fa-trash"></i><span>Xoá</span></a>}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const RoomNormal = ({room, isOwner = false}) => {
    const [poster, setPoster] = useState(null)

    useEffect(() => {
        setPoster(moviePoster(room.movie.images.posters))
    }, [])

    return (
        <div
            className={`card-live ${room.status === 0 ? 'card-live-coming' : (room.status === 1 ? 'card-live-air' : 'card-live-end')}`}>
            <div className="v-thumbnail">
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
                <MovieImagesPoster movie={room.movie}/>
                <div className="thumb-small"
                     style={{backgroundImage: `url(${poster})`}}></div>
            </div>
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
                {isOwner && <DropdownActions room={room}/>}
            </div>
        </div>
    )
}

export default memo(RoomNormal)