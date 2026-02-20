"use client"

import {moviePoster} from "@/utils/image";
import {memo, useEffect, useState} from "react";

const MovieImagesPoster = ({movie, size}) => {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    setSrc(moviePoster(movie.images.posters, size))
  }, [movie.images.posters])

  if (!src) return null

  return (
    <img src={src} alt={`Xem Phim ${movie.title} Vietsub HD Online - Rophim`}
         loading="lazy"/>
  )
}

export default memo(MovieImagesPoster)