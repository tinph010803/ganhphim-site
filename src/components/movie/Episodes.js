"use client"

import {memo, useEffect, useRef, useState} from "react";
import SubtitleIcon from "@/components/icons/Subtitle";
import VoiceoverIcon from "@/components/icons/Voiceover";
import PresentIcon from "@/components/icons/Present";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import MovieApi from "@/api/movie.api";
import {episodeThumbnail} from "@/utils/image";
import Link from "next/link";
import {movieWatchUrl} from "@/utils/url";
import {
    setClickedEpisode,
    setCurEpisode, setCurSeason,
    setCurVersion, setCurVersionPlayer,
    setVideoEnded,
} from "@/redux/features/movieSlice";
import {useSearchParams} from 'next/navigation'
import LoadingElement from "@/components/loading/Element";
import MovieSeasons from "@/components/movie/Seasons";
import {playerPostMessage} from "@/utils/helpers";
import {
    getTypeText,
    TYPE_PRESENT_NORTH,
    TYPE_PRESENT_SOUTH,
    TYPE_SUBTITLE,
    TYPE_VOICEOVER
} from "@/constants/episodeVersion";

const MovieEpisodes = ({movie, page}) => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const {
        curEpisode,
        curSeason,
        curVersion,
        cwInfo,
        cwInfoLoading,
        curSeasonNumberPlayer,
        curEpisodeNumberPlayer,
        curVersionPlayer,
        videoEnded,
    } = useAppSelector((state) => state.movie)

    const [isLoading, setIsLoading] = useState(false)
    const [showFull, setShowFull] = useState(false)
    const [seasons, setSeasons] = useState([])
    const [episodes, setEpisodes] = useState([])
    const [versions, setVersions] = useState([])
    const [scheduledEpisodes, setScheduledEpisodes] = useState([])
    const [currentChunk, setCurrentChunk] = useState(0)
    const [chunkedEpisodes, setChunkedEpisodes] = useState([])

    const CHUNK_SIZE = 100;

    useEffect(() => {
        const getSeasons = async () => {
            if (!isLoading) {
                setIsLoading(true)
                const result = await MovieApi.seasons(movie.slug || movie._id)
                if (!result || result.length === 0) {
                    setIsLoading(false)
                    return
                }
                const latestSeason = result[result.length - 1]
                setScheduledEpisodes((latestSeason?.episodes || []).filter(el => el.versions.length === 0))
                setSeasons(result)
                setIsLoading(false)
            }
        }

        getSeasons()
    }, [])

    const episodesRef = useRef([])
    const curEpisodeRef = useRef(null)
    const curVersionRef = useRef(null)
    useEffect(() => { episodesRef.current = episodes }, [episodes])
    useEffect(() => { curEpisodeRef.current = curEpisode }, [curEpisode])
    useEffect(() => { curVersionRef.current = curVersion }, [curVersion])

    // Auto-next: go to next episode when video ends
    useEffect(() => {
        if (!videoEnded) return
        dispatch(setVideoEnded(false))
        const eps = episodesRef.current
        const curEp = curEpisodeRef.current
        const ver = curVersionRef.current
        if (!curEp || !eps.length) return
        const idx = eps.findIndex(e => e._id === curEp._id || e.episode_number === curEp.episode_number)
        if (idx >= 0 && idx < eps.length - 1) {
            const nextEp = eps[idx + 1]
            dispatch(setCurEpisode(nextEp))
            dispatch(setCurVersionPlayer(ver))
            dispatch(setClickedEpisode(true))
        }
    }, [videoEnded])

    useEffect(() => {
        if (curEpisodeNumberPlayer) {
            const episode = episodes.find(el => el.episode_number == curEpisodeNumberPlayer)
            if (episode) {
                dispatch(setCurEpisode(episode))
            }
        }
    }, [curEpisodeNumberPlayer, episodes])

    useEffect(() => {
        if (curSeasonNumberPlayer) {
            const season = seasons.find(el => el.season_number == curSeasonNumberPlayer)
            if (season) {
                dispatch(setCurSeason(season))
            }
        }
    }, [curSeasonNumberPlayer, seasons])

    useEffect(() => {
        if (curSeason) {
            const types = new Set()

            curSeason.episodes.forEach(episode => {
                episode.versions.forEach(version => {
                    types.add(version.type)
                })
            })

            const _types = [...types].sort((a, b) => a - b);

            setVersions(_types)

            const activeVersion = (_types.length > 0 && _types.indexOf(parseInt(curVersion)) < 0)
                ? _types[0]
                : (curVersion ?? _types[0])

            if (_types.length > 0 && _types.indexOf(parseInt(curVersion)) < 0) {
                dispatch(setCurVersion(activeVersion))
            }

            const episodes = curSeason?.episodes.filter(el => el.versions.filter(el2 => el2.type == activeVersion).length > 0)

            setEpisodes(episodes)

            if (curEpisode) {
                const idx = episodes.findIndex(e => e.episode_number === curEpisode.episode_number);
                setCurrentChunk(idx >= 0 ? Math.floor(idx / CHUNK_SIZE) : 0);
            } else {
                setCurrentChunk(0);
            }
        }
    }, [curSeason, curVersion, curEpisode])

    useEffect(() => {
        if (episodes.length > 0) {
            setChunkedEpisodes(chunkArray(episodes, CHUNK_SIZE))
        }
    }, [episodes]);

    useEffect(() => {
        if (episodes.length > 0 && page === "watch" && !cwInfoLoading && curEpisode === null) {
            let episode = episodes[0]
            const ep = searchParams.get('ep') || (cwInfo ? cwInfo.episode_number : null)
            if (ep) {
                const foundEp = episodes.find(el => el.episode_number === parseFloat(ep))
                if (foundEp) episode = foundEp
            }

            let idx = episodes.findIndex(e => e._id === episode._id);
            if (idx < 0) idx = 0; // fallback

            const chunkIndex = Math.floor(idx / 100);

            setCurrentChunk(chunkIndex)
            dispatch(setCurEpisode(episode))
        }
    }, [episodes, cwInfo, cwInfoLoading, curEpisode])

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    const handleVersionClick = (version) => {
        dispatch(setCurVersion(version.toString()))
        // console.log(curVersion, curVersionPlayer)
    }

    const handleEpisodeClick = (event, ep) => {
        if (page === "watch") {
            event.preventDefault()
            dispatch(setCurEpisode(ep))
            dispatch(setCurVersionPlayer(curVersion))
            dispatch(setClickedEpisode(true))
            playerPostMessage({
                event: "web_change_episode",
                param: {
                    episode: ep.episode_number,
                    season: curSeason.season_number,
                    version: curVersion,
                }
            })
            // window.history.replaceState({}, '', `?ver=${curVersion}&ss=${curSeason.season_number}&ep=${ep.episode_number}`)
            window.scrollTo(0, 0)
        }
    }

    const renderSchedule = () => {
        if (scheduledEpisodes.length > 0) {
            const latestSchedule = scheduledEpisodes[0]
            return (
                <div className="schedule-eps mt-0">
                    <div className="item">
                        <div className="inc-icon">
                            <img src="/images/alarm.gif"/>
                        </div>
                        <div>
                            <strong>Tập {latestSchedule.episode_number}</strong> sẽ phát
                            sóng<strong>{latestSchedule.air_time ? ` ${latestSchedule.air_time} ` : ` `}ngày {latestSchedule.air_date}</strong>.
                            Các bạn nhớ đón xem nhé 😚
                        </div>
                    </div>
                </div>
            )
        }
    }

    if (isLoading)
        return (
            <LoadingElement/>
        )

    if (seasons.length > 0)
        return (
            <div className="cg-body-box is-eps">
                {renderSchedule()}
                <div className="box-header">
                    <MovieSeasons seasons={seasons} page={page}/>
                    <div className="nav nav-pills v-tabs v-tabs-min tab-trans mb-0" id="nav-tab-child"
                         role="tablist">
                        {versions.map((version) => {
                            return (
                                <button className={`nav-link ${curVersion == version ? 'active' : ''}`} type="button"
                                        role="tab"
                                        key={`tab-ver-${version}`}
                                        onClick={() => handleVersionClick(version)}>
                                    {version == TYPE_SUBTITLE.id && <SubtitleIcon/>}
                                    {version == TYPE_VOICEOVER.id && <VoiceoverIcon/>}
                                    {(version == TYPE_PRESENT_NORTH.id || version == TYPE_PRESENT_SOUTH.id) &&
                                        <PresentIcon/>}
                                    <span>{getTypeText(version)}</span>
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex-grow-1"></div>
                    <div className="v-toggle v-toggle-min line-center" onClick={() => setShowFull(!showFull)}>
                        <div className="text">Rút gọn</div>
                        <div className={`toggle-x ${showFull ? 'off' : 'on'}`}>
                            <span></span>
                        </div>
                    </div>
                </div>
                {chunkedEpisodes.length > 1 && (
                    <div className="range-eps">
                        {chunkedEpisodes.map((_, index) => (
                            <a key={index}
                               onClick={() => setCurrentChunk(index)}
                               className={`item ${index === currentChunk ? "active" : ""}`}>Tập {index * 100 + 1} - {Math.min((index + 1) * 100, episodes.length)}</a>
                        ))}
                    </div>
                )}
                <div className="box-body">
                    <div className={`de-eps is-grid ${showFull ? '' : 'is-simple'}`}>
                        {chunkedEpisodes[currentChunk]?.map(ep => {
                            return (
                                <Link onClick={(e) => handleEpisodeClick(e, ep)} key={`ep-${ep._id}`}
                                      href={`${movieWatchUrl(movie)}?ver=${curVersion}&ss=${curSeason?.season_number}&ep=${ep.episode_number}`}
                                      className={`item ${(curEpisode?._id == ep._id && curSeason?.season_number == ep.season_number && curVersionPlayer == curVersion) ? 'on-air' : ''}`}>
                                    <div className="v-thumbnail h-thumbnail">
                                        <div className="play-button">
                                            <i className="fa-solid fa-play"></i>
                                        </div>
                                        <img src={ep.image_path || movie.images?.backdrops?.[0]?.path || movie.images?.posters?.[0]?.path || '/images/e-thumb-default.png'} alt={`Tập ${ep.episode_number}`}
                                             loading="lazy"/>
                                    </div>
                                    <div className="info">
                                        <div className="play-button">
                                            <i className="fa-solid fa-play"></i>
                                        </div>
                                        <div className="ep-sort flex-shrink-0">Tập {ep.name || ep.episode_number}</div>
                                        {ep.name && ep.name !== String(ep.episode_number) && ep.name !== String(Math.floor(ep.episode_number)) && <div className="media-title">{ep.name}</div>}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
}

export default memo(MovieEpisodes)