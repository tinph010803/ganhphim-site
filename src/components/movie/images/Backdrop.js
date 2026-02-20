"use client"

import {movieBackdrop} from "@/utils/image";
import {memo, useEffect, useState} from "react";

const MovieBackdrop = ({movie, size}) => {
    const [src, setSrc] = useState(null)

    useEffect(() => {
        setSrc(movieBackdrop(movie.images.backdrops, size))
    }, [movie.images.backdrops])

    if (!src) return null

    return (
        <img src={src} alt={`Xem Phim ${movie.title} Vietsub HD Online - Rophim`}
             loading="lazy"/>
    )
}

export default memo(MovieBackdrop)