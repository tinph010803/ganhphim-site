"use client"

import {memo, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setCurGtavnServer, setCurEpisode} from "@/redux/features/movieSlice";
import {useRouter, useSearchParams} from "next/navigation";
import {movieWatchUrl} from "@/utils/url";

const CHUNK_SIZE = 100

const parseEpNumber = (name, idx) => {
    if (!name) return idx + 1
    const n = parseFloat(name)
    return isNaN(n) ? idx + 1 : n
}

const LABEL_TO_SOURCE = {op: 'server_1', pa: 'server_2', nc: 'server_3'}

const getServerGroup = (name) => {
    const n = (name || '').toLowerCase()
    if (n.includes('thuyết minh') || n.includes('lồng tiếng') || n.includes('long tieng')) return 'dubbed'
    return 'subtitle'
}

const GtavnServers = ({movie, page = "watch"}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const {curGtavnServer, curEpisode} = useAppSelector(state => state.movie)
    const [showFull, setShowFull] = useState(false)
    const [currentChunk, setCurrentChunk] = useState(0)
    const [activeEpName, setActiveEpName] = useState(null)
    const [activeGroup, setActiveGroup] = useState(null)
    const isInitDoneRef = useRef(false)
    const lastEpPerServerRef = useRef({}) // { serverId: { ep, globalIdx, epName } }


    const rawServers = movie.gtavn_servers || {}

    const SOURCE_LABELS = {server_1: 'OP', server_2: 'PA', server_3: 'NC'}
    const SOURCE_PRIORITY = ['server_3', 'server_2', 'server_1']

    const DISPLAY_ORDER = ['server_3', 'server_2', 'server_1']

    // Flatten all sub-servers from every source group into one list
    const allServers = useMemo(() => {
        return DISPLAY_ORDER
            .filter(k => Array.isArray(rawServers[k]) && rawServers[k].length > 0)
            .flatMap(key =>
                rawServers[key].map((sub, subIdx) => {
                    const label = SOURCE_LABELS[key] ? ` (${SOURCE_LABELS[key]})` : ''
                    // Strip leading "SV1 - ", "SV2 - ", "SV3 - " prefixes
                    const cleanName = (sub.server_name || `Server ${key.replace('server_', '')}`)
                        .replace(/^SV\d+\s*-\s*/i, '')
                    return {
                        id: `${key}_${subIdx}`,
                        sourceKey: key,
                        subIdx,
                        name: cleanName + label,
                        eps: sub.server_data || [],
                    }
                })
            )
    }, [movie._id])

    // Default server priority: NC (server_3) → OP (server_1) → PA (server_2) → first
    const defaultServerId = useMemo(() => {
        for (const srcKey of SOURCE_PRIORITY) {
            const found = allServers.find(s => s.sourceKey === srcKey)
            if (found) return found.id
        }
        return allServers[0]?.id || null
    }, [allServers])

    const activeServerId = allServers.some(s => s.id === curGtavnServer)
        ? curGtavnServer
        : defaultServerId

    const activeServer = allServers.find(s => s.id === activeServerId) || allServers[0]
    const episodes = activeServer?.eps || []

    const chunkedEpisodes = useMemo(() => {
        const result = []
        for (let i = 0; i < episodes.length; i += CHUNK_SIZE)
            result.push(episodes.slice(i, i + CHUNK_SIZE))
        return result
    }, [episodes])

    const buildCurEpisode = (server, ep, epIdx) => ({
        _id: `${movie._id}_${server.id}_${epIdx}`,
        episode_number: parseEpNumber(ep.name, epIdx),
        season_number: 1,
        name: ep.name || String(epIdx + 1),
        slug: ep.slug || `tap-${epIdx + 1}`,
        image_path: null,
        versions: [{
            type: 1,
            link: ep.link_embed || ep.link_m3u8 || '',
            // NC (server_3) bị chặn m3u8 → để trống, Player.js fallback dùng embed iframe.
            m3u8: server.sourceKey === 'server_3' ? '' : (ep.link_m3u8 || ''),
        }],
    })

    // Init: dispatch episode on mount (watch page only)
    useEffect(() => {
        if (page !== "watch") return
        if (!activeServer || activeServer.eps.length === 0) return

        // Support ?svr=nc&ep=10 (new) and ?gtsvr=&gtep= (legacy)
        const urlSvr = searchParams.get('svr') || searchParams.get('gtsvr')
        const urlEp  = searchParams.get('ep')  || searchParams.get('gtep')

        if (urlSvr) {
            const sourceKey = LABEL_TO_SOURCE[urlSvr.toLowerCase()] || null
            const targetServer = sourceKey
                ? allServers.find(s => s.sourceKey === sourceKey)
                : allServers.find(s => s.id === urlSvr)

            if (targetServer && targetServer.eps.length > 0) {
                dispatch(setCurGtavnServer(targetServer.id))
                let epIdx = 0
                if (urlEp != null) {
                    const byName = targetServer.eps.findIndex(ep => ep.name === urlEp)
                    if (byName >= 0) {
                        epIdx = byName
                    } else {
                        const byNum = parseInt(urlEp, 10)
                        if (!isNaN(byNum) && byNum >= 0 && byNum < targetServer.eps.length) epIdx = byNum
                    }
                }
                const ep = targetServer.eps[epIdx]
                dispatch(setCurEpisode(buildCurEpisode(targetServer, ep, epIdx)))
                setCurrentChunk(Math.floor(epIdx / CHUNK_SIZE))
                const epNameInit = ep.name || String(epIdx + 1)
                setActiveEpName(epNameInit)
                lastEpPerServerRef.current[targetServer.id] = {ep, globalIdx: epIdx, epName: epNameInit}
                isInitDoneRef.current = true
                return
            }
        }

        const ep0 = activeServer.eps[0]
        dispatch(setCurEpisode(buildCurEpisode(activeServer, ep0, 0)))
        const ep0Name = ep0.name || '1'
        setActiveEpName(ep0Name)
        lastEpPerServerRef.current[activeServerId] = {ep: ep0, globalIdx: 0, epName: ep0Name}
        isInitDoneRef.current = true
    }, [movie._id])

    // Update URL when server or episode changes (watch page only)
    useEffect(() => {
        if (page !== "watch" || !isInitDoneRef.current || !activeServerId || !activeEpName) return
        const server = allServers.find(s => s.id === activeServerId)
        if (!server) return
        const svrLabel = (SOURCE_LABELS[server.sourceKey] || server.sourceKey).toLowerCase()
        window.history.replaceState({}, "", `?svr=${svrLabel}&ep=${encodeURIComponent(activeEpName)}`)
    }, [activeServerId, activeEpName])

    const handleServerClick = (server) => {
        if (server.id === activeServerId) return
        dispatch(setCurGtavnServer(server.id))
        setActiveGroup(getServerGroup(server.name))
        const saved = lastEpPerServerRef.current[server.id]
        if (saved) {
            dispatch(setCurEpisode(buildCurEpisode(server, saved.ep, saved.globalIdx)))
            setActiveEpName(saved.epName)
            setCurrentChunk(Math.floor(saved.globalIdx / CHUNK_SIZE))
        } else {
            dispatch(setCurEpisode(null))
            setActiveEpName('')
            setCurrentChunk(0)
        }
    }

    const handleEpisodeClick = (ep, globalIdx) => {
        if (page === "detail") {
            const epName = ep.name || String(globalIdx + 1)
            router.push(`${movieWatchUrl(movie)}?svr=${encodeURIComponent(activeServerId)}&ep=${encodeURIComponent(epName)}`)
            return
        }
        const epName = ep.name || String(globalIdx + 1)
        dispatch(setCurEpisode(buildCurEpisode(activeServer, ep, globalIdx)))
        setActiveEpName(epName)
        // Chọn tập mới → xóa memory server khác, chỉ giữ server hiện tại
        lastEpPerServerRef.current = {[activeServerId]: {ep, globalIdx, epName}}
        window.scrollTo(0, 0)
    }

    if (allServers.length === 0) return null

    const subtitleServers = allServers.filter(s => getServerGroup(s.name) === 'subtitle')
    const dubbedServers = allServers.filter(s => getServerGroup(s.name) === 'dubbed')
    const effectiveGroup = activeGroup ?? getServerGroup(activeServer?.name || '')
    const currentGroupServers = effectiveGroup === 'dubbed'
        ? (dubbedServers.length > 0 ? dubbedServers : subtitleServers)
        : (subtitleServers.length > 0 ? subtitleServers : dubbedServers)

    const tabBtnStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 16px',
        background: 'none', border: 'none',
        borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
        color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
        fontWeight: 700, fontSize: '15px', letterSpacing: '0.6px',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s, border-color 0.2s',
    })

    const renderServerButtons = (servers) =>
        servers.map(server => {
            const isActive = server.id === activeServerId
            return (
                <button
                    key={server.id}
                    className="nav-link"
                    type="button"
                    role="tab"
                    style={{
                        whiteSpace: 'nowrap',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                        background: isActive ? 'var(--primary)' : 'transparent',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                        borderRadius: '6px',
                        fontSize: isActive ? '13px' : '12px',
                        fontWeight: isActive ? 700 : 400,
                    }}
                    onClick={() => handleServerClick(server)}
                >
                    <span>{server.name}{server.eps.length > 0 ? ` | ${server.eps.length}` : ''}</span>
                </button>
            )
        })

    return (
        <div className="cg-body-box is-eps">
            {subtitleServers.length > 0 && dubbedServers.length > 0 && (
                <div style={{display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
                    <button style={tabBtnStyle(effectiveGroup === 'subtitle')} onClick={() => {
                        setActiveGroup('subtitle')
                        if (getServerGroup(activeServer?.name) !== 'subtitle' && subtitleServers[0])
                            handleServerClick(subtitleServers[0])
                    }}>
                        <i className="fa-solid fa-closed-captioning"></i> PHỤ ĐỀ
                    </button>
                    <button style={tabBtnStyle(effectiveGroup === 'dubbed')} onClick={() => {
                        setActiveGroup('dubbed')
                        if (getServerGroup(activeServer?.name) !== 'dubbed' && dubbedServers[0])
                            handleServerClick(dubbedServers[0])
                    }}>
                        <i className="fa-solid fa-microphone"></i> LỒNG TIẾNG
                    </button>
                </div>
            )}
            <div className="box-header" style={{flexWrap: 'wrap', gap: '6px'}}>
                <div className="nav nav-pills v-tabs v-tabs-min tab-trans mb-0" role="tablist" style={{flexWrap: 'wrap', flex: 1, minWidth: 0}}>
                    {renderServerButtons(currentGroupServers)}
                </div>
                <div className="v-toggle v-toggle-min line-center flex-shrink-0" onClick={() => setShowFull(!showFull)}>
                    <div className="text">Hiện ảnh</div>
                    <div className={`toggle-x ${showFull ? 'on' : 'off'}`}>
                        <span></span>
                    </div>
                </div>
            </div>
            {chunkedEpisodes.length > 1 && (
                <div className="range-eps">
                    {chunkedEpisodes.map((_, index) => (
                        <a
                            key={index}
                            onClick={() => setCurrentChunk(index)}
                            className={`item ${index === currentChunk ? 'active' : ''}`}
                        >
                            Tập {index * CHUNK_SIZE + 1} - {Math.min((index + 1) * CHUNK_SIZE, episodes.length)}
                        </a>
                    ))}
                </div>
            )}
            <div className="box-body">
                <div className={`de-eps is-grid ${showFull ? '' : 'is-simple'}`}>
                    {(chunkedEpisodes[currentChunk] || []).map((ep, epIdx) => {
                        const globalIdx = currentChunk * CHUNK_SIZE + epIdx
                        const epId = `${movie._id}_${activeServerId}_${globalIdx}`
                        const epName = ep.name || String(globalIdx + 1)
                        const isActive = !!activeEpName && epName === activeEpName
                        return (
                            <a
                                key={epId}
                                className={`item ${isActive ? 'on-air' : ''}`}
                                onClick={() => handleEpisodeClick(ep, globalIdx)}
                                style={{cursor: 'pointer'}}
                            >
                                <div className="v-thumbnail h-thumbnail">
                                    <div className="play-button">
                                        <i className="fa-solid fa-play"></i>
                                    </div>
                                    <img
                                        src={movie.images?.backdrops?.[0]?.path || movie.images?.posters?.[0]?.path || '/images/e-thumb-default.png'}
                                        alt={`Tập ${ep.name || globalIdx + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="info">
                                    <div className="play-button">
                                        <i className="fa-solid fa-play"></i>
                                    </div>
                                    <div className="ep-sort flex-shrink-0">
                                        {/^\d/.test(ep.name || '') ? `Tập ${ep.name}` : (ep.name || `Tập ${globalIdx + 1}`)}
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default memo(GtavnServers)
