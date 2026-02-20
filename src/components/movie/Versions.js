"use client"

import {memo, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import Link from "next/link";
import {movieWatchUrl} from "@/utils/url";
import {
    setCurVersion,
    setCurVersionPlayer
} from "@/redux/features/movieSlice";
import {playerPostMessage} from "@/utils/helpers";
import MovieImagesPoster from "@/components/movie/images/Poster";
import {
    getTypeText,
    TYPE_PRESENT_NORTH,
    TYPE_PRESENT_SOUTH,
    TYPE_SUBTITLE,
    TYPE_VOICEOVER
} from "@/constants/episodeVersion";

const MovieVersions = ({movie, page}) => {
    const dispatch = useAppDispatch()
    const {curVersion} = useAppSelector((state) => state.movie)
    const [versions, setVersions] = useState([])

    useEffect(() => {
        if (movie.latest_episode) {
            setVersions(Object.keys(movie.latest_episode).sort())
        }
    }, [movie]);

    const handleMovieVersionClick = (event, version) => {
        if (page === "watch") {
            event.preventDefault()
            dispatch(setCurVersion(version.toString()))
            dispatch(setCurVersionPlayer(version.toString()))
            playerPostMessage({
                event: "web_change_episode",
                param: {
                    version,
                }
            })
            window.history.replaceState({}, '', `?ver=${version}`)
            window.scrollTo(0, 0)
        }
    }

    return (
        <div className="cg-body-box is-eps">
            <div className="box-header">
                <div className="heading-md mb-0">Các bản chiếu</div>
            </div>
            <div className="box-body">
                <div className="de-type">
                    {versions.map((version, index) => {
                        return (
                            <Link onClick={(e) => handleMovieVersionClick(e, version)}
                                  href={`${movieWatchUrl(movie)}?ver=${version}`}
                                  key={`version-${version}`}
                                  className={`item ${version === "1" ? "pd" : (version === "2" ? "lt" : "tm")} ${(curVersion == version && page === "watch") ? 'active' : ''}`}>
                                <div className="m-thumbnail">
                                    <MovieImagesPoster movie={movie}/>
                                </div>
                                <div className="info">
                                    <div className="ver line-center">
                                        <div className="inc-icon icon-20">
                                            {version == TYPE_SUBTITLE.id && <img src="/images/icons/pd.svg"/>}
                                            {version == TYPE_VOICEOVER.id && <img src="/images/icons/lt.svg"/>}
                                            {(version == TYPE_PRESENT_NORTH.id || version == TYPE_PRESENT_SOUTH.id) &&
                                                <img src="/images/icons/tm.svg"/>}
                                        </div>
                                        <span>{getTypeText(version)}</span>
                                    </div>
                                    <div className="media-title lim-2 mb-0">{movie.title}</div>
                                    {curVersion == version && page === "watch" ?
                                        <div className="btn btn-sm btn-light">Đang xem</div> :
                                        <div className="btn btn-sm btn-light">Xem bản này</div>}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default memo(MovieVersions)