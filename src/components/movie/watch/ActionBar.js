"use client"

import MovieFavoriteButton from "@/components/movie/favorite/Button";
import MoviePlaylistButton from "@/components/playlist/Button";
import {memo, useEffect, useState} from "react";
import MovieShareButton from "@/components/movie/share/Button";
import Link from "next/link";
import {useAppSelector} from "@/hooks/redux";
import MovieReportButton from "@/components/movie/report/Button";
import UserApi from "@/api/user.api";
import {playerPostMessage} from "@/utils/helpers";

const ActionBar = ({movie}) => {
    const [cinemaMode, setCinemaMode] = useState(false)
    const [autoNextEpisode, setAutoNextEpisode] = useState(true)
    const [autoSkipIntro, setAutoSkipIntro] = useState(false)
    const [createW2gUrl, setCreateW2gUrl] = useState("")

    const {
        curEpisode,
        curSeason,
    } = useAppSelector((state) => state.movie)

    const loggedUser = useAppSelector(s => s.auth.loggedUser)

    useEffect(() => {
        if (loggedUser) {
            if (typeof loggedUser.settings?.auto_next !== "undefined") {
                setAutoNextEpisode(loggedUser.settings?.auto_next)
            }
            if (typeof loggedUser.settings?.auto_skip_intro !== "undefined") {
                setAutoSkipIntro(loggedUser.settings?.auto_skip_intro)
            }
        }
    }, [loggedUser])

    useEffect(() => {
        if (movie.type === 1) {
            setCreateW2gUrl(`/xem-chung/tao-phong/${movie.public_id}`)
        } else {
            setCreateW2gUrl(`/xem-chung/tao-phong/${movie.public_id}?ss=${curSeason?.season_number}&ep=${curEpisode?.episode_number}`)
        }
    }, [curSeason, curEpisode, movie])

    const handleCinemaModeClick = () => {
        setCinemaMode(!cinemaMode)
        if (cinemaMode) {
            document.body.classList.remove("focus-mod")
        } else {
            document.body.classList.add("focus-mod")
            document.body.classList.remove("qk-base-load")
        }
    }

    const handleAutoNextEpisodeClick = async () => {
        playerPostMessage({event: "web_auto_next_episode", param: !autoNextEpisode})
        setAutoNextEpisode(!autoNextEpisode)
        await UserApi.saveSettings({auto_next: !autoNextEpisode})
    }
    const handleAutoSkipIntroClick = async () => {
        playerPostMessage({event: "web_auto_skip_intro", param: !autoSkipIntro})
        setAutoSkipIntro(!autoSkipIntro)
        await UserApi.saveSettings({auto_skip_intro: !autoSkipIntro})
    }

    return (
        <div className="line-center player-control">
            {movie.is_upcoming && (<div className="pc-coming primary-gradient">
                Phim sắp ra mắt
            </div>)}
            <div className="line-center control-items">
                <MovieFavoriteButton position="watch" movieId={movie._id}/>
                <MoviePlaylistButton movieId={movie._id} position="watch"/>
                {movie.type !== 1 &&
                    <div className={`item item-auto toggle-basic-label ${autoNextEpisode ? 'is-on' : ''}`}
                         onClick={handleAutoNextEpisodeClick}>
                        <span>Chuyển tập</span>
                        <div className="toggle-basic is-on"></div>
                    </div>}
                <div className={`item item-auto toggle-basic-label ${autoSkipIntro ? 'is-on' : ''}`}
                     onClick={handleAutoSkipIntroClick}>
                    <span>Bỏ qua giới thiệu</span>
                    <div className="toggle-basic is-on"></div>
                </div>
                <div className={`item item-focus toggle-basic-label ${cinemaMode ? 'is-on' : ''}`}
                     onClick={handleCinemaModeClick}>
                    <span>Rạp phim</span>
                    <div className="toggle-basic"></div>
                </div>
                <Link
                    href={createW2gUrl}
                    className="item item-w2g">
                    <div className="inc-icon icon-14">
                        <img src="/images/icons/live.svg" alt="icon live"/>
                    </div>
                    <span>Xem chung</span>
                </Link>
                <MovieShareButton page={"watch"}/>
                <div className="flex-grow-1"></div>
                <MovieReportButton movie={movie}/>
            </div>
        </div>
    )
}

export default memo(ActionBar)