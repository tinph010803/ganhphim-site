"use client"

import Link from "next/link";
import {movieDetailUrl} from "@/utils/url";
import MovieImagesPoster from "@/components/movie/images/Poster";
import {useState} from "react";

const MovieItemSchedule = ({item}) => {
  const movie = item.movie
  // New API (showtimes): movie.poster (direct URL), movie.name, item.show_time, item.episode
  // Old API (scheduledEpisodes): movie.images.posters, movie.title, item.air_time, item.episode_number
  const hasDirectPoster = !!movie.poster
  const timePin = item.show_time || item.air_time || null
  const title = movie.name || movie.title
  const episodeLabel = item.episode || (item.episode_number ? `Tập ${item.episode_number}` : null)

  const [imgSrc, setImgSrc] = useState(movie.poster)

  return (
    <Link href={movieDetailUrl(movie)} className="h-item">
      {timePin && <div className="t-pin">{timePin}</div>}
      <div className="v-thumb-s">
        <div className="v-thumbnail">
          {hasDirectPoster
            ? <img
                src={imgSrc}
                alt={`Xem Phim ${title} Vietsub HD Online - Rophim`}
                loading="lazy"
                onError={() => { if (movie.thumbnail) setImgSrc(movie.thumbnail) }}
              />
            : <MovieImagesPoster movie={movie} size={`0-100`}/>
          }
        </div>
      </div>
      <div className="info">
        <h4 className="item-title lim-2">{title}</h4>
        {episodeLabel && (
          <div className="info-line">
            <div className="tag-small">{episodeLabel}</div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default MovieItemSchedule