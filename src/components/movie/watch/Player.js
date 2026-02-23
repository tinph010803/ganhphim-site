"use client"

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useRef, useState} from "react";
import ContinueWatchingApi from "@/api/continueWatching.api";
import {
    resetWatchData, setClickedEpisode,
    setCurEpisode,
    setCurEpisodeNumberPlayer,
    setCurSeason,
    setCurSeasonNumberPlayer, setCurVersion,
    setCurVersionPlayer,
    setVideoEnded,
} from "@/redux/features/movieSlice";
import useVersionUpdater from "@/hooks/useVersionUpdater";
import useGetCwInfo from "@/hooks/useGetCwInfo";
import {useSearchParams} from "next/navigation";
import {playerPostMessage} from "@/utils/helpers"
import UserApi from "@/api/user.api";
import PlayerApi from "@/api/player.api";
import {isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import CustomPlayer from "@/components/movie/watch/CustomPlayer";
import MovieApi from "@/api/movie.api";

const MoviePlayer = ({movie}) => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const [showNotice, setShowNotice] = useState(true)
    const [playerUrl, setPlayerUrl] = useState(null)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [seasons, setSeasons] = useState([])
    const playerTimeRef = useRef(0)
    const lastTimeLogRef = useRef(0)
    const playerDurationRef = useRef(0)
    const {
        curSeason,
        curEpisode,
        curVersion,
        cwInfo,
        cwInfoLoading,
        clickedEpisode,
        reduceLag,
    } = useAppSelector(state => state.movie)
    const {loggedUser} = useAppSelector(state => state.auth)
    const intervalRef = useRef(null)

    useVersionUpdater({movie, page: "watch"})
    useGetCwInfo({movie})

    // Fetch seasons for series (skip for GtaVN — GtavnServers handles it)
    useEffect(() => {
        if (movie.type === 1 || isUsingGtavnApi()) return
        MovieApi.seasons(movie.slug || movie._id).then(res => {
            if (res && res.length > 0) setSeasons(res)
        })
    }, [movie._id])

    const handleSelectEpisode = (season, episode) => {
        dispatch(setCurSeason(season))
        dispatch(setCurEpisode(episode))
        dispatch(setCurVersionPlayer(curVersion))
        dispatch(setClickedEpisode(true))
        const iframe = document.getElementById('embed-player')
        if (iframe) {
            playerPostMessage({
                event: "web_change_episode",
                param: {episode: episode.episode_number, season: season.season_number, version: curVersion}
            })
        }
        window.scrollTo(0, 0)
    }

    // OPhim: auto-set curEpisode for single movies (type=1) since MovieVersions doesn't dispatch it
    useEffect(() => {
        if (!isUsingOphimApi() || movie.type !== 1) return
        const rawEpisodes = movie.episodes || []
        if (rawEpisodes.length === 0) return

        // Collect all server versions for episode 1
        const versions = rawEpisodes.map((server) => {
            const ep = server.server_data?.[0]
            if (!ep) return null
            const n = (server.server_name || '').toLowerCase()
            let vType = 1
            if (n.includes('lồng tiếng') || n.includes('lt')) vType = 2
            else if (n.includes('thuyết minh') && n.includes('bắc')) vType = 3
            else if (n.includes('thuyết minh')) vType = 4
            return {type: vType, link: ep.link_embed || ep.link_m3u8 || '', m3u8: ep.link_m3u8 || ''}
        }).filter(Boolean)

        const ep0 = rawEpisodes[0]?.server_data?.[0]
        if (!ep0) return
        dispatch(setCurEpisode({
            _id: `${movie._id}_1`,
            episode_number: 1,
            season_number: 1,
            name: ep0.name || '1',
            image_path: null,
            versions,
        }))
    }, [movie])

    useEffect(() => {
        playerTimeRef.current = 0;
        lastTimeLogRef.current = 0;
    }, [curEpisode])

    useEffect(() => {
        return () => {
            dispatch(resetWatchData())
        }
    }, [])

    useEffect(() => {
        const continueWatchingLog = async () => {
            if (playerTimeRef.current > 0 && playerTimeRef.current > lastTimeLogRef.current) {
                lastTimeLogRef.current = playerTimeRef.current
                await ContinueWatchingApi.save({
                    movie_id: movie._id,
                    season_number: curSeason?.season_number,
                    episode_number: curEpisode?.episode_number,
                    version: curVersion,
                    time: playerTimeRef.current,
                    duration: playerDurationRef.current,
                })
            }
        }

        if (loggedUser && !loggedUser.is_shared) {
            intervalRef.current = setInterval(() => {
                continueWatchingLog()
            }, 10000)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [loggedUser, curEpisode, curSeason, curVersion]);

    const buildPlayerUrl = async () => {
        // OPhim / GtaVn: use link_embed directly from curEpisode.versions
        if (isUsingOphimApi() || isUsingGtavnApi()) {
            const episodeToUse = curEpisode
            if (episodeToUse?.versions?.length > 0) {
                const version = episodeToUse.versions.find(v => v.type == curVersion) || episodeToUse.versions[0]
                return version.link || ''
            }
            return ''
        }

        const link = await PlayerApi.getLink(movie.public_id)

        let queryParams = []

        if (searchParams.get("dddeeebbbuuuggg")) {
            queryParams.push("dddeeebbbuuuggg=3")
        }

        if (curVersion) queryParams.push(`version=${curVersion}`)
        if (movie.type !== 1) {
            if (curSeason) queryParams.push(`season=${curSeason.season_number}`)
            if (curEpisode) queryParams.push(`episode=${curEpisode.episode_number}`)
            if (
                cwInfo &&
                cwInfo.season_number === curSeason?.season_number &&
                cwInfo.episode_number === curEpisode?.episode_number
            ) {
                queryParams.push(`time=${cwInfo.time}`)
            }
        } else {
            if (cwInfo) queryParams.push(`time=${cwInfo.time}`)
        }

        return `${link}${queryParams.length > 0 ? `&${queryParams.join("&")}` : ""}`
    }


    useEffect(() => {
        const initPlayerUrl = async () => {
            if (!cwInfoLoading && isFirstLoad) {
                const canBuild = (isUsingOphimApi() || isUsingGtavnApi())
                    ? (curEpisode != null)
                    : ((movie.type === 1 && curVersion) || (movie.type !== 1 && curEpisode))

                if (canBuild) {
                    const url = await buildPlayerUrl()
                    setPlayerUrl(url)
                    setIsFirstLoad(false)
                }
            }
        }

        initPlayerUrl()
    }, [curEpisode, cwInfoLoading, cwInfo, curVersion, loggedUser]);

    // OPhim / GtaVn: rebuild player URL whenever episode/version changes
    useEffect(() => {
        if (!(isUsingOphimApi() || isUsingGtavnApi()) || isFirstLoad) return;
        if (!curEpisode) return;
        const version = curEpisode.versions?.find(v => v.type == curVersion) || curEpisode.versions?.[0]
        const url = version?.link || ''
        if (url) setPlayerUrl(url)
    }, [curEpisode, curVersion]);

    const prevRef = useRef({version: null, episode: null, season: null});

    useEffect(() => {
        if (!curVersion || isFirstLoad) return;

        const dddebug = searchParams.get("dddeeebbbuuuggg");
        const hasDebug = dddebug ? `&dddeeebbbuuuggg=3` : "";

        const prev = prevRef.current;

        if (movie.type === 1) {
            if (curVersion !== prev.version) {
                window.history.replaceState({}, "", `?ver=${curVersion}${hasDebug}`);
            }
        }

        if (movie.type !== 1 && curEpisode && curSeason) {
            const episodeChanged = prev.episode !== curEpisode.episode_number;

            if (episodeChanged || clickedEpisode) {
                window.history.replaceState(
                    {},
                    "",
                    `?ver=${curVersion}&ss=${curSeason.season_number}&ep=${curEpisode.episode_number}${hasDebug}`
                );
                dispatch(setClickedEpisode(false))
            }
        }

        prevRef.current = {
            version: curVersion,
            episode: curEpisode?.episode_number,
            season: curSeason?.season_number,
        };
    }, [curVersion, curEpisode, curSeason, isFirstLoad, clickedEpisode]);

    useEffect(() => {
        const saveSettings = async (data) => {
            await UserApi.saveSettings(data)
        }

        const handleEventMessage = (event) => {
            if (event.origin === "https://goatembed.com") {
                const eventData = event.data
                if (eventData.event === "time") {
                    playerTimeRef.current = eventData.param.time
                    playerDurationRef.current = eventData.param.duration
                }
                if (eventData.event === "change_episode") {
                    const {season, episode} = eventData.param
                    // console.log('player change season: ', season)
                    // console.log('player change episode: ', episode)
                    dispatch(setCurSeasonNumberPlayer(season))
                    dispatch(setCurEpisodeNumberPlayer(episode))
                }
                if (eventData.event === "change_audio") {
                    const {version} = eventData.param
                    // console.log('player change version: ', version)
                    dispatch(setCurVersionPlayer(version))
                    dispatch(setCurVersion(version))
                }
                if (eventData.event === "player_update_settings") {
                    // console.log('player update settings: ', eventData.param)
                    if (loggedUser) {
                        saveSettings({web_player: eventData.param})
                    }
                }
                if (eventData.event === "player_get_settings") {
                    if (loggedUser && loggedUser.settings.web_player) {
                        playerPostMessage({event: "web_get_settings", param: loggedUser.settings.web_player})

                        if (typeof loggedUser.settings?.auto_skip_intro !== "undefined") {
                            playerPostMessage({
                                event: "web_auto_skip_intro",
                                param: loggedUser.settings?.auto_skip_intro
                            })
                        }

                        if (typeof loggedUser.settings?.auto_next !== "undefined") {
                            playerPostMessage({event: "web_auto_next_episode", param: loggedUser.settings?.auto_next})
                        }
                    }
                }
            }
        }

        window.addEventListener("message", handleEventMessage)

        return () => {
            window.removeEventListener("message", handleEventMessage)
        }
    }, [loggedUser]);

    return (
        <div className="ratio ratio-16x9">
            {(movie.quality === "cam" && showNotice) && <div className="quality-notice">
                <div className="text">
                    <strong>Chú ý:</strong> Chất lượng phim chưa tốt. Rổ sẽ cập nhật bản đẹp sớm nhất có thể nhé.
                </div>
                <div className="notice-dismiss" onClick={() => setShowNotice(false)}>Ẩn thông báo</div>
            </div>}
            {(() => {
                const m3u8 = (curEpisode?.versions?.find(v => v.type == curVersion) || curEpisode?.versions?.[0])?.m3u8
                if (m3u8 && !reduceLag) {
                    return (
                        <CustomPlayer
                            key={m3u8}
                            url={m3u8}
                            title={movie.title}
                            poster={movie.images?.backdrops?.[0]?.path || movie.images?.posters?.[0]?.path || ''}
                            onEnded={() => dispatch(setVideoEnded(true))}
                            onNext={() => dispatch(setVideoEnded(true))}
                            seasons={seasons}
                            curSeason={curSeason}
                            curEpisode={curEpisode}
                            onSelectEpisode={handleSelectEpisode}
                        />
                    )
                }
                return (
                    <iframe width="560" height="315"
                            src={playerUrl} id={`embed-player`}
                            allow="autoplay; encrypted-media; picture-in-picture;"
                            referrerPolicy="no-referrer" allowFullScreen webkitallowfullscreen="true"
                            mozallowfullscreen="true"></iframe>
                )
            })()}
        </div>
    )
}

export default memo(MoviePlayer)