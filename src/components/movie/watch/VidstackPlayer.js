"use client"

import {useRef} from "react";
import {MediaPlayer, MediaProvider, Track} from '@vidstack/react';
import {defaultLayoutIcons, DefaultVideoLayout} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const proxyM3u8 = (url) => {
    if (!url) return url
    return `/web-api/proxy-m3u8?url=${encodeURIComponent(url)}`
}

const VidstackPlayer = ({url, poster, title}) => {
    const player = useRef(null)

    if (!url) return null

    return (
        <MediaPlayer
            ref={player}
            title={title || ''}
            src={{src: proxyM3u8(url), type: 'application/x-mpegurl'}}
            poster={poster || ''}
            autoplay
            playsInline
            style={{width: '100%', height: '100%'}}
        >
            <MediaProvider/>
            <DefaultVideoLayout
                icons={defaultLayoutIcons}
                thumbnails={null}
            />
        </MediaPlayer>
    )
}

export default VidstackPlayer
