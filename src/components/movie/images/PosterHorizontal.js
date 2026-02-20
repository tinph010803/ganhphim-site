"use client"

import {moviePoster, moviePosterHorizontal} from "@/utils/image";
import {memo} from "react";

const MovieImagesPosterHorizontal = ({movie, size}) => {
  const src = moviePoster(movie.images?.horizontal_posters, size)
           || moviePosterHorizontal(movie.images?.posters || [])
  return (
    <img src={src}
         alt={`Xem Phim ${movie.title} Vietsub HD Online - Rophim`}
         loading="lazy"/>
  )
}

export default memo(MovieImagesPosterHorizontal)