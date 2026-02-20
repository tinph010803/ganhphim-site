"use client"

import {memo, useEffect, useRef, useState} from "react";
import MovieApi from "@/api/movie.api";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const MovieOst = ({movieId}) => {
    const [ost, setOst] = useState([])
    const [activeOst, setActiveOst] = useState(null)
    const playerRef = useRef(null)

    const getOst = async () => {
        const result = await MovieApi.ost(movieId)
        setOst(result)
    }

    useEffect(() => {
        getOst()
    }, [])

    useEffect(() => {
        if (!activeOst) {
            playerRef.current?.audio.current.pause()
        } else {
            playerRef.current.audio.current.play()
        }
    }, [activeOst]);

    const handleOstClick = (item) => {
        if (item._id === activeOst?._id) {
            setActiveOst(null)
        } else {
            setActiveOst(item)
        }
    }

    return (
        <div className="cg-body-box is-ost">
            <div className="box-body">
                <div className="de-soundtrack">
                    {ost.length === 0 && (
                        <div className="v-notice mb-3">
                            <div className="inc-icon icon-notice">
                                <img src="/images/icons/empty-box.svg"/>
                            </div>
                            <p className="mb-0">Đang cập nhật...</p>
                        </div>
                    )}
                    {ost.map(item => {
                        return (
                            <div className={`item-sound ${activeOst?._id === item._id ? "active" : ""}`}
                                 key={`ost_${item._id}`}>
                                <div className="h-item" onClick={() => handleOstClick(item)}>
                                    <div className="sound-cover">
                                        <img src={item.thumbnail}/>
                                    </div>
                                    <div className="info">
                                        <h4 className="media-title">{item.name}</h4>
                                        <div className="artist">{item.singer}</div>
                                    </div>
                                    <div className="touch-media">
                                        <div className="btn btn-basic">
                                            <i className="fa-solid fa-headphones"></i>
                                            <span>Nghe nhạc</span>
                                        </div>
                                    </div>
                                </div>
                                {activeOst?._id === item._id && <div className="sound-play">
                                    <H5AudioPlayer
                                        ref={playerRef}
                                        autoPlay={false}
                                        src={item.path}
                                        onPlay={e => console.log("onPlay")}
                                        showJumpControls={false}
                                    />
                                </div>}
                                <div className="lyric-post">
                                    {item.lyrics.split('\r\n').map((line, index) => {
                                        return (
                                            <p key={`${item._id}_line_${index}`} className="ori">{line}</p>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default memo(MovieOst)