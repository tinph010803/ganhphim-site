"use client"

import Link from "next/link";
import {movieDetailUrl} from "@/utils/url";
import MovieImagesPoster from "@/components/movie/images/Poster";

const MovieItemSchedule = ({item}) => {
  return (
    <Link href={movieDetailUrl(item.movie)} className="h-item">
      {item.air_time && <div className="t-pin">{item.air_time}</div>}
      <div className="v-thumb-s">
        <div className="v-thumbnail">
          <MovieImagesPoster movie={item.movie} size={`0-100`}/>
        </div>
      </div>
      <div className="info">
        <h4 className="item-title lim-2">{item.movie.title}</h4>
        <div className="info-line">
          <div className="tag-small">Tập {item.episode_number}</div>
        </div>
      </div>
    </Link>
  )
}

export default MovieItemSchedule