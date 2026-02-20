"use client"

import {useEffect, useRef} from "react";

const ArtPlayerComponent = ({url, poster, onReady}) => {
    const containerRef = useRef(null)
    const artRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || !url) return

        let art = null

        const initPlayer = async () => {
            const Artplayer = (await import('artplayer')).default
            const Hls = (await import('hls.js')).default

            // destroy old instance
            if (artRef.current) {
                artRef.current.destroy()
                artRef.current = null
            }

            art = new Artplayer({
                container: containerRef.current,
                url,
                poster: poster || '',
                volume: 1,
                autoplay: true,
                pip: true,
                autoSize: false,
                autoMini: false,
                screenshot: false,
                setting: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                lang: 'vi',
                theme: '#e5161e',
                customType: {
                    m3u8: (video, src) => {
                        if (Hls.isSupported()) {
                            const hls = new Hls({
                                maxBufferLength: 30,
                                maxMaxBufferLength: 60,
                            })
                            hls.loadSource(src)
                            hls.attachMedia(video)
                            art.hls = hls
                            art.on('destroy', () => hls.destroy())
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = src
                        }
                    },
                },
                quality: [],
                icons: {},
            })

            artRef.current = art

            if (onReady) {
                art.on('ready', () => onReady(art))
            }
        }

        initPlayer()

        return () => {
            if (artRef.current) {
                artRef.current.destroy()
                artRef.current = null
            }
        }
    }, [url])

    return (
        <div
            ref={containerRef}
            style={{width: '100%', height: '100%'}}
        />
    )
}

export default ArtPlayerComponent
