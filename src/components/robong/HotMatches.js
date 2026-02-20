"use client"

import {memo, useEffect, useMemo, useState} from "react";
import dayjs from "@/utils/dayjs";
import {robongHomeUrl, robongMatchUrl} from "@/utils/url";
import Cookies from "js-cookie";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchHotMatches} from "@/redux/features/appSlice";
import _ from "lodash";
import useTabSwap from "@/hooks/useTabSwap";
import {userAvatar} from "@/utils/image";

const COOKIE_NAME = "_n_rb_show"

const RobongHotMatches = () => {
    const dispatch = useAppDispatch();
    const [show, setShow] = useState(false)
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const hotMatches = useAppSelector(s => s.app.hotMatches)

    const handleCloseClick = (e) => {
        e.preventDefault()
        setShow(false)
        Cookies.set(COOKIE_NAME, 1, {path: "/", expires: new Date(Date.now() + 10 * 60 * 1000)})
    }

    useEffect(() => {
        dispatch(fetchHotMatches())
        if (!Cookies.get(COOKIE_NAME)) setShow(true)
    }, []);

    const popunderConfig = useMemo(() => {
        if (!isLoadingUserInfo && (loggedUser?.is_vip || ["admin", "mod"].includes(loggedUser?.role))) return null
        if (!hotMatches || hotMatches.length === 0) return null

        const match = _.sample(hotMatches)
        const room = _.sample(match.rooms)

        const toUrl = robongMatchUrl({match, room})
        const url = `/go?to=${encodeURIComponent(toUrl)}`;

        return {
            adUrl: url,
            cooldownMinutes: 60,
        };
    }, [hotMatches, loggedUser, isLoadingUserInfo]);

    useTabSwap({
        adUrl: popunderConfig?.adUrl || null,
        cooldownMinutes: popunderConfig?.cooldownMinutes || 60,
        priority: 1,
        type: "rb"
    })

    if ((hotMatches && hotMatches.length === 0) || !show) return null

    return (
        <div className="content content-rb">
            <div className="rb-header">
                <a href={robongHomeUrl()} className="rb-logo">
                    <img src="/images/logo-robong.webp" alt="Robong"/>
                </a>
                <div className="heading-xs mb-0 text-light">Trận cầu tâm điểm</div>
                <div className="alias-title small">Trực tiếp tại <strong className="text-light">Robong.tv</strong>
                </div>
            </div>
            <div className="match-info w-100 mb-3 text-dark">
                {hotMatches.map(item => {
                    return (
                        <a key={`hm-${item._id}`} className="item no-swap"
                           href={robongMatchUrl({match: item, room: item.rooms[0]})} target="_blank">
                            <div className="info-item">
                                <div className="time-match">
                                    <strong>{dayjs.unix(item.match_time).format("HH:mm")}</strong>
                                </div>
                                <div className="league-name">{item.competition.name}</div>
                            </div>
                            <div className="team-vs w-100">
                                <div className="card-team team-home">
                                    <div className="inc-icon">
                                        <img src={item.home_team.logo} alt={item.home_team.name}/>
                                    </div>
                                    <span className="lim lim-2">{item.home_team.name}</span>
                                </div>
                                <div className="current">
                                    <div className="score"><span>VS</span></div>
                                </div>
                                <div className="card-team team-away">
                                    <div className="inc-icon">
                                        <img src={item.away_team.logo} alt={item.away_team.name}/>
                                    </div>
                                    <span className="lim lim-2">{item.away_team.name}</span>
                                </div>
                            </div>
                            {item.rooms.length > 0 && <div className="match-comm">
                                <div className="comm-avatar">
                                    <img src={userAvatar(item.rooms[0].commentators[0])}/>
                                </div>
                                <span>{item.rooms[0].commentators[0]?.name}</span>
                            </div>}
                        </a>
                    )
                })}
            </div>
            <div className="ct-footer line-center justify-content-between w-100">
                <div className="close-app-box m-0">
                    <a href="#" className="px-0" onClick={handleCloseClick}>Tắt thông báo</a>
                </div>
                <a className="btn btn-sm btn-outline" href={robongHomeUrl()} target="_blank">
                    <i className="fa-solid fa-play-circle"></i>
                    <span>Xem ngay</span>
                </a>
            </div>

        </div>
    )
}

export default memo(RobongHotMatches)