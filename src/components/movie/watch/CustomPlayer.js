"use client"

import {useCallback, useEffect, useRef, useState} from "react";

const proxyM3u8 = (url) => {
    if (!url) return url
    return `/web-api/proxy-m3u8?url=${encodeURIComponent(url)}`
}

const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
}

const CustomPlayer = ({url, poster, title, onEnded, onNext, seasons = [], curSeason, curEpisode, onSelectEpisode}) => {
    const videoRef = useRef(null)
    const hlsRef = useRef(null)
    const containerRef = useRef(null)
    const controlsTimerRef = useRef(null)
    const progressRef = useRef(null)
    const autoNextRef = useRef(true)
    const onEndedRef = useRef(onEnded)
    useEffect(() => { onEndedRef.current = onEnded }, [onEnded])

    const [playing, setPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [muted, setMuted] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [showSettings, setShowSettings] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [qualities, setQualities] = useState([])
    const [currentQuality, setCurrentQuality] = useState(-1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [buffered, setBuffered] = useState(0)
    const [showVolume, setShowVolume] = useState(false)
    const volumeWrapRef = useRef(null)
    const [autoNext, setAutoNext] = useState(true)

    // Close volume slider when clicking outside
    useEffect(() => {
        if (!showVolume) return
        const handler = (e) => {
            if (volumeWrapRef.current && !volumeWrapRef.current.contains(e.target)) {
                setShowVolume(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [showVolume])
    const [settingsPage, setSettingsPage] = useState('main') // main | speed | quality
    const [showEpList, setShowEpList] = useState(false)
    const [epListSeason, setEpListSeason] = useState(null)
    const [showSeasonDrop, setShowSeasonDrop] = useState(false)

    // Sync epListSeason with curSeason — prefer object from seasons prop (has m3u8 guaranteed)
    useEffect(() => {
        if (!curSeason) return
        // Try to find matching season from seasons prop (has full episode data with m3u8)
        const matched = seasons.find(s => s.season_number === curSeason.season_number)
        setEpListSeason(matched || curSeason)
    }, [curSeason, seasons])
    useEffect(() => { if (seasons.length > 0 && !epListSeason) setEpListSeason(seasons[0]) }, [seasons])

    // Keep ref in sync
    useEffect(() => { autoNextRef.current = autoNext }, [autoNext])

    // Init HLS
    useEffect(() => {
        if (!url || !videoRef.current) return

        const initHls = async () => {
            const Hls = (await import('hls.js')).default

            if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
            }

            const proxied = proxyM3u8(url)

            if (Hls.isSupported()) {
                const hls = new Hls({maxBufferLength: 30, maxMaxBufferLength: 60})
                hls.loadSource(proxied)
                hls.attachMedia(videoRef.current)

                hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                    const levels = data.levels.map((l, i) => ({
                        id: i,
                        label: l.height ? `${l.height}p` : `Level ${i}`,
                        bitrate: l.bitrate,
                    }))
                    setQualities(levels)
                    setCurrentQuality(-1)
                    videoRef.current?.play().catch(() => {})
                })

                hlsRef.current = hls
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = proxied
                videoRef.current.play().catch(() => {})
            }
        }

        initHls()

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
            }
        }
    }, [url])

    // Video events
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const onPlay = () => setPlaying(true)
        const onPause = () => setPlaying(false)
        const onTimeUpdate = () => {
            setCurrentTime(video.currentTime)
            if (video.buffered.length > 0) {
                setBuffered(video.buffered.end(video.buffered.length - 1))
            }
        }
        const onDurationChange = () => setDuration(video.duration)
        const onVolumeChange = () => {
            setVolume(video.volume)
            setMuted(video.muted)
        }
        const onVideoEnded = () => {
            if (autoNextRef.current) onEndedRef.current?.()
        }

        video.addEventListener('play', onPlay)
        video.addEventListener('pause', onPause)
        video.addEventListener('timeupdate', onTimeUpdate)
        video.addEventListener('durationchange', onDurationChange)
        video.addEventListener('volumechange', onVolumeChange)
        video.addEventListener('ended', onVideoEnded)

        return () => {
            video.removeEventListener('play', onPlay)
            video.removeEventListener('pause', onPause)
            video.removeEventListener('timeupdate', onTimeUpdate)
            video.removeEventListener('durationchange', onDurationChange)
            video.removeEventListener('volumechange', onVolumeChange)
            video.removeEventListener('ended', onVideoEnded)
        }
    }, [])

    // Fullscreen change
    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', onFsChange)
        return () => document.removeEventListener('fullscreenchange', onFsChange)
    }, [])

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e) => {
            if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return
            if (e.target.tagName === 'INPUT') return
            switch (e.code) {
                case 'Space': e.preventDefault(); togglePlay(); break
                case 'ArrowRight': e.preventDefault(); skip(10); break
                case 'ArrowLeft': e.preventDefault(); skip(-10); break
                case 'ArrowUp': e.preventDefault(); changeVolume(Math.min(1, volume + 0.1)); break
                case 'ArrowDown': e.preventDefault(); changeVolume(Math.max(0, volume - 0.1)); break
                case 'KeyF': toggleFullscreen(); break
                case 'KeyM': toggleMute(); break
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [volume, playing])

    const resetControlsTimer = useCallback(() => {
        setShowControls(true)
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
        controlsTimerRef.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) setShowControls(false)
        }, 3000)
    }, [])

    const togglePlay = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.paused ? video.play() : video.pause()
    }, [])

    const skip = useCallback((sec) => {
        if (videoRef.current) videoRef.current.currentTime += sec
    }, [])

    const toggleMute = useCallback(() => {
        if (videoRef.current) videoRef.current.muted = !videoRef.current.muted
    }, [])

    const changeVolume = useCallback((val) => {
        if (videoRef.current) {
            videoRef.current.volume = val
            videoRef.current.muted = val === 0
        }
    }, [])

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }, [])

    const seekTo = useCallback((e) => {
        const rect = progressRef.current.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        if (videoRef.current) videoRef.current.currentTime = ratio * duration
    }, [duration])

    const setQuality = useCallback((id) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = id
            setCurrentQuality(id)
        }
        setShowSettings(false)
    }, [])

    const setPlaybackSpeed = useCallback((s) => {
        if (videoRef.current) videoRef.current.playbackRate = s
        setSpeed(s)
        setShowSettings(false)
    }, [])

    const progressPercent = duration ? (currentTime / duration) * 100 : 0
    const bufferedPercent = duration ? (buffered / duration) * 100 : 0

    const effectiveVolume = muted ? 0 : volume
    const VolumeIcon = () => {
        if (effectiveVolume === 0) return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
        if (effectiveVolume < 0.5) return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
        return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
    }

    const qualityLabel = currentQuality === -1 ? 'Auto' : (qualities.find(q => q.id === currentQuality)?.label || 'Auto')
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

    return (
        <div
            ref={containerRef}
            className="cp-wrap"
            onMouseMove={resetControlsTimer}
            onMouseEnter={resetControlsTimer}
            onClick={() => { togglePlay(); resetControlsTimer() }}
            tabIndex={0}
            style={{outline: 'none'}}
        >
            {poster && !playing && currentTime === 0 && (
                <div className="cp-poster" style={{backgroundImage: `url(${poster})`}}/>
            )}
            <video ref={videoRef} className="cp-video" playsInline preload="metadata"/>

            {/* Big play button */}
            {!playing && (
                <div className="cp-big-play">
                    <svg viewBox="0 0 24 24" fill="white" width="52" height="52"><path d="M8 5v14l11-7z"/></svg>
                </div>
            )}

            {/* Episode list button - top right */}
            {seasons.length > 0 && (
                <div className={`cp-eplist-btn ${showControls || !playing ? 'visible' : ''}`}
                     onClick={e => { e.stopPropagation(); setShowEpList(v => !v) }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                    <span>Danh sách tập</span>
                </div>
            )}

            {/* Episode list panel */}
            {showEpList && seasons.length > 0 && (
                <div className="cp-eplist-panel" onClick={e => e.stopPropagation()}>
                    <div className="cp-eplist-header">
                        <span className="cp-eplist-title">{title}</span>
                        <button className="cp-eplist-close" onClick={() => setShowEpList(false)}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        </button>
                    </div>
                    <div className="cp-eplist-seasons">
                        <div className="cp-season-select" onClick={() => setShowSeasonDrop(v => !v)}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                            <span>Phần {epListSeason?.season_number}</span>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
                            {showSeasonDrop && (
                                <div className="cp-season-drop" onClick={e => e.stopPropagation()}>
                                    {seasons.map(s => (
                                        <div key={s._id || s.season_number}
                                             className={`cp-season-opt ${s.season_number === epListSeason?.season_number ? 'active' : ''}`}
                                             onClick={() => { setEpListSeason(s); setShowSeasonDrop(false) }}>
                                            Phần {s.season_number}
                                            {s.season_number === epListSeason?.season_number && <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {curEpisode && <span className="cp-eplist-curep">Tập {curEpisode.episode_number}</span>}
                    </div>
                    <div className="cp-eplist-body">
                        {(epListSeason?.episodes || []).map(ep => {
                            const isActive = curEpisode?._id === ep._id && curSeason?.season_number === epListSeason?.season_number
                            return (
                                <div key={ep._id || ep.episode_number}
                                     className={`cp-ep-item ${isActive ? 'active' : ''}`}
                                     onClick={e => { e.stopPropagation(); onSelectEpisode?.(epListSeason, ep); setShowEpList(false) }}>
                                    <div className="cp-ep-thumb">
                                        <img src={ep.image_path || poster || '/images/e-thumb-default.png'} alt="" loading="lazy"/>
                                        {isActive && <div className="cp-ep-playing"><svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M8 5v14l11-7z"/></svg></div>}
                                    </div>
                                    <div className="cp-ep-info">
                                        <div className="cp-ep-num">Tập {ep.episode_number}</div>
                                        {ep.name && ep.name !== String(ep.episode_number) && <div className="cp-ep-name">{ep.name}</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className={`cp-controls ${showControls || !playing ? 'visible' : ''}`}
                 onClick={e => e.stopPropagation()}>

                {/* Progress bar */}
                <div className="cp-progress" ref={progressRef} onClick={seekTo}>
                    <div className="cp-progress-bg"/>
                    <div className="cp-progress-buf" style={{width: `${bufferedPercent}%`}}/>
                    <div className="cp-progress-fill" style={{width: `${progressPercent}%`}}>
                        <div className="cp-progress-dot"/>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="cp-bar">
                    <div className="cp-bar-left">
                        {/* Play/Pause */}
                        <button className="cp-btn" onClick={togglePlay} title={playing ? 'Tạm dừng' : 'Phát'}>
                            {playing
                                ? <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                : <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
                            }
                        </button>

                        {/* Skip -10 */}
                        <button className="cp-btn cp-skip" onClick={() => skip(-10)} title="Lùi 10 giây">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="8.5" y="14.5" fontSize="5.5" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">10</text></svg>
                        </button>

                        {/* Skip +10 */}
                        <button className="cp-btn cp-skip" onClick={() => skip(10)} title="Tua 10 giây">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="8.5" y="14.5" fontSize="5.5" fill="currentColor" fontFamily="sans-serif" fontWeight="bold">10</text></svg>
                        </button>

                        {/* Volume */}
                        <div className="cp-volume-wrap" ref={volumeWrapRef}>
                            <button className="cp-btn" onClick={() => setShowVolume(v => !v)} title="Âm lượng">
                                <span style={{width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <VolumeIcon/>
                                </span>
                            </button>
                            <div className={`cp-volume-slider ${showVolume ? 'visible' : ''}`}>
                                <input
                                    type="range" min="0" max="1" step="0.02"
                                    value={effectiveVolume}
                                    onChange={e => changeVolume(parseFloat(e.target.value))}
                                    className="cp-range"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="cp-time">
                            <span>{formatTime(currentTime)}</span>
                            <span className="cp-time-sep">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="cp-bar-right">
                        {/* Auto next toggle */}
                        <div className="cp-autonext" onClick={() => setAutoNext(v => !v)} title="Tự động chuyển tập">
                            <span className="cp-autonext-label">Chuyển tập</span>
                            <div className={`cp-toggle ${autoNext ? 'on' : ''}`}>
                                <div className="cp-toggle-dot"/>
                            </div>
                        </div>

                        {/* Next episode */}
                        {onNext && (
                            <button className="cp-btn" onClick={onNext} title="Tập tiếp theo">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 18l8.5-6L6 6v12zM20 6v12h2V6h-2z"/></svg>
                            </button>
                        )}

                        {/* Settings */}
                        <div className="cp-settings-wrap">
                            <button className="cp-btn" onClick={() => { setShowSettings(v => !v); setSettingsPage('main') }} title="Cài đặt">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                            </button>

                            {showSettings && (
                                <div className="cp-settings-menu" onClick={e => e.stopPropagation()}>
                                    {settingsPage === 'main' && <>
                                        <div className="cp-settings-title">Cài đặt</div>
                                        {qualities.length > 0 && (
                                            <div className="cp-settings-row" onClick={() => setSettingsPage('quality')}>
                                                <span>Chất lượng</span>
                                                <span className="cp-settings-val">{qualityLabel} <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></span>
                                            </div>
                                        )}
                                        <div className="cp-settings-row" onClick={() => setSettingsPage('speed')}>
                                            <span>Tốc độ</span>
                                            <span className="cp-settings-val">{speed === 1 ? '1x bình thường' : `${speed}x`} <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></span>
                                        </div>
                                    </>}

                                    {settingsPage === 'speed' && <>
                                        <div className="cp-settings-title cp-settings-back" onClick={() => setSettingsPage('main')}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                                            Tốc độ phát
                                        </div>
                                        {speeds.map(s => (
                                            <div key={s} className={`cp-settings-row cp-settings-option ${speed === s ? 'selected' : ''}`} onClick={() => setPlaybackSpeed(s)}>
                                                {s === 1 ? '1x bình thường' : `${s}x`}
                                                {speed === s && <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                                            </div>
                                        ))}
                                    </>}

                                    {settingsPage === 'quality' && <>
                                        <div className="cp-settings-title cp-settings-back" onClick={() => setSettingsPage('main')}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                                            Chất lượng
                                        </div>
                                        <div className={`cp-settings-row cp-settings-option ${currentQuality === -1 ? 'selected' : ''}`} onClick={() => setQuality(-1)}>
                                            Auto
                                            {currentQuality === -1 && <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                                        </div>
                                        {qualities.map(q => (
                                            <div key={q.id} className={`cp-settings-row cp-settings-option ${currentQuality === q.id ? 'selected' : ''}`} onClick={() => setQuality(q.id)}>
                                                {q.label}
                                                {currentQuality === q.id && <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                                            </div>
                                        ))}
                                    </>}
                                </div>
                            )}
                        </div>

                        {/* PiP */}
                        <button className="cp-btn" onClick={() => videoRef.current?.requestPictureInPicture?.()} title="Picture in Picture">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>
                        </button>

                        {/* Fullscreen */}
                        <button className="cp-btn" onClick={toggleFullscreen} title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
                            {isFullscreen
                                ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                                : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .cp-wrap {
                    position: absolute;
                    inset: 0;
                    background: #000;
                    overflow: hidden;
                    cursor: pointer;
                    user-select: none;
                }
                .cp-video {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: contain;
                }
                .cp-poster {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    z-index: 1;
                }
                .cp-big-play {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    pointer-events: none;
                }
                .cp-big-play svg {
                    filter: drop-shadow(0 2px 8px rgba(0,0,0,.6));
                    opacity: .85;
                }
                .cp-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    background: linear-gradient(transparent, rgba(0,0,0,.85));
                    padding: 20px 0 0;
                    opacity: 0;
                    transition: opacity .25s;
                    pointer-events: none;
                }
                .cp-controls.visible {
                    opacity: 1;
                    pointer-events: all;
                }
                .cp-progress {
                    position: relative;
                    height: 18px;
                    margin: 0 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .cp-progress-bg,
                .cp-progress-buf,
                .cp-progress-fill {
                    position: absolute;
                    left: 0;
                    height: 3px;
                    border-radius: 2px;
                    transition: height .15s;
                }
                .cp-progress:hover .cp-progress-bg,
                .cp-progress:hover .cp-progress-buf,
                .cp-progress:hover .cp-progress-fill {
                    height: 5px;
                }
                .cp-progress-bg {
                    width: 100%;
                    background: rgba(255,255,255,.25);
                }
                .cp-progress-buf {
                    background: rgba(255,255,255,.4);
                }
                .cp-progress-fill {
                    background: #e5161e;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .cp-progress-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #e5161e;
                    flex-shrink: 0;
                    transform: scale(0);
                    transition: transform .15s;
                    margin-right: -6px;
                }
                .cp-progress:hover .cp-progress-dot {
                    transform: scale(1);
                }
                .cp-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 4px 8px 8px;
                    gap: 4px;
                }
                .cp-bar-left, .cp-bar-right {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    min-width: 0;
                    flex-shrink: 1;
                }
                .cp-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 6px 7px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: .85;
                    transition: opacity .15s, background .15s;
                    line-height: 1;
                }
                .cp-btn:hover {
                    opacity: 1;
                    background: rgba(255,255,255,.12);
                }
                .cp-btn svg { display: block; }
                .cp-volume-wrap {
                    display: flex;
                    align-items: center;
                    position: relative;
                }
                .cp-volume-slider {
                    position: absolute;
                    bottom: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%) translateY(6px);
                    background: rgba(18,18,18,.95);
                    border-radius: 10px;
                    padding: 14px 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: opacity .2s, transform .2s, visibility .2s;
                    z-index: 20;
                }
                .cp-volume-slider.visible {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transform: translateX(-50%) translateY(0);
                }
                .cp-range {
                    -webkit-appearance: slider-vertical;
                    writing-mode: vertical-lr;
                    direction: rtl;
                    appearance: none;
                    width: 4px;
                    height: 80px;
                    background: rgba(255,255,255,.3);
                    border-radius: 2px;
                    outline: none;
                    cursor: pointer;
                    accent-color: #e5161e;
                }
                .cp-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                }
                .cp-range::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    border: none;
                }
                .cp-time {
                    font-size: 12px;
                    color: #fff;
                    padding: 0 6px;
                    display: flex;
                    gap: 3px;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }
                .cp-time-sep { opacity: .5; }
                .cp-autonext {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    padding: 4px 6px;
                    border-radius: 6px;
                    transition: background .15s;
                }
                .cp-autonext:hover { background: rgba(255,255,255,.1); }
                .cp-autonext-label {
                    font-size: 11px;
                    color: #fff;
                    white-space: nowrap;
                    opacity: .85;
                }
                .cp-toggle {
                    width: 32px;
                    height: 18px;
                    border-radius: 9px;
                    background: rgba(255,255,255,.3);
                    position: relative;
                    flex-shrink: 0;
                    transition: background .2s;
                }
                .cp-toggle.on { background: #e5161e; }
                .cp-toggle-dot {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #fff;
                    transition: transform .2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,.3);
                }
                .cp-toggle.on .cp-toggle-dot { transform: translateX(14px); }
                .cp-settings-wrap {
                    position: relative;
                }
                .cp-settings-menu {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    right: 0;
                    background: rgba(28,28,28,.97);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                    min-width: 220px;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,.6);
                    animation: cp-fade-in .15s ease;
                }
                @keyframes cp-fade-in {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cp-settings-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #fff;
                    padding: 12px 16px 8px;
                    border-bottom: 1px solid rgba(255,255,255,.08);
                }
                .cp-settings-back {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
                .cp-settings-back:hover { color: #e5161e; }
                .cp-settings-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 16px;
                    font-size: 13px;
                    color: rgba(255,255,255,.85);
                    cursor: pointer;
                    transition: background .15s;
                }
                .cp-settings-row:hover { background: rgba(255,255,255,.07); }
                .cp-settings-val {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    color: rgba(255,255,255,.5);
                    font-size: 12px;
                }
                .cp-settings-option.selected {
                    color: #e5161e;
                    font-weight: 600;
                }
                /* Episode list button */
                .cp-eplist-btn {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    z-index: 12;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(0,0,0,.55);
                    color: #fff;
                    font-size: 12px;
                    padding: 5px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity .25s, background .15s;
                    white-space: nowrap;
                    backdrop-filter: blur(4px);
                }
                .cp-eplist-btn.visible { opacity: 1; }
                .cp-eplist-btn:hover { background: rgba(0,0,0,.75); }
                /* Episode list panel */
                .cp-eplist-panel {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 310px;
                    z-index: 20;
                    background: rgba(12,12,14,.85);
                    backdrop-filter: blur(16px);
                    display: flex;
                    flex-direction: column;
                    animation: cp-slide-in .2s ease;
                }
                @keyframes cp-slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .cp-eplist-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 14px 10px;
                    flex-shrink: 0;
                }
                .cp-eplist-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 220px;
                }
                .cp-eplist-close {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,.7);
                    cursor: pointer;
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    border-radius: 4px;
                    flex-shrink: 0;
                }
                .cp-eplist-close:hover { color: #fff; background: rgba(255,255,255,.1); }
                .cp-eplist-seasons {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    flex-shrink: 0;
                }
                .cp-season-select {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background: rgba(255,255,255,.08);
                    border: 1px solid rgba(255,255,255,.14);
                    border-radius: 6px;
                    padding: 5px 9px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #fff;
                    user-select: none;
                    transition: background .15s;
                }
                .cp-season-select:hover { background: rgba(255,255,255,.13); }
                .cp-season-drop {
                    position: absolute;
                    top: calc(100% + 6px);
                    left: 0;
                    min-width: 130px;
                    background: rgba(28,28,30,.98);
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0,0,0,.6);
                    z-index: 30;
                    animation: cp-fade-in .15s ease;
                }
                .cp-season-opt {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 9px 14px;
                    font-size: 13px;
                    color: rgba(255,255,255,.85);
                    cursor: pointer;
                    transition: background .12s;
                }
                .cp-season-opt:hover { background: rgba(255,255,255,.07); }
                .cp-season-opt.active { color: #e5161e; font-weight: 600; }
                .cp-eplist-curep {
                    font-size: 12px;
                    color: rgba(255,255,255,.5);
                    white-space: nowrap;
                }
                .cp-eplist-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 6px 0;
                }
                .cp-eplist-body::-webkit-scrollbar { width: 4px; }
                .cp-eplist-body::-webkit-scrollbar-track { background: transparent; }
                .cp-eplist-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 2px; }
                .cp-ep-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 7px 14px;
                    cursor: pointer;
                    transition: background .12s;
                    border-left: 3px solid transparent;
                }
                .cp-ep-item:hover { background: rgba(255,255,255,.06); }
                .cp-ep-item.active {
                    background: rgba(229,22,30,.1);
                    border-left-color: #e5161e;
                }
                .cp-ep-thumb {
                    position: relative;
                    width: 88px;
                    height: 50px;
                    border-radius: 5px;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: #111;
                }
                .cp-ep-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .cp-ep-playing {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,.45);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cp-ep-info {
                    flex: 1;
                    min-width: 0;
                }
                .cp-ep-num {
                    font-size: 13px;
                    color: #fff;
                    font-weight: 500;
                }
                .cp-ep-name {
                    font-size: 11px;
                    color: rgba(255,255,255,.5);
                    margin-top: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @media (max-width: 480px) {
                    .cp-btn {
                        padding: 5px 5px;
                    }
                    .cp-autonext {
                        display: none;
                    }
                    .cp-time {
                        font-size: 11px;
                        padding: 0 4px;
                    }
                    .cp-bar {
                        padding: 2px 4px 6px;
                        gap: 2px;
                    }
                    .cp-eplist-btn, .cp-eplist-panel {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default CustomPlayer
