"use client"

import {memo} from "react";
import MovieImagesPoster from "@/components/movie/images/Poster";
import Link from "next/link";
import {movieDetailUrl} from "@/utils/url";

const MovieItemRanking = ({item}) => {
  const desc = item.overview
    ? item.overview.replace(/<[^>]*>/g, '').slice(0, 80)
    : [item.year, item.genres?.slice(0, 2).map(g => g.name).join(' · ')].filter(Boolean).join(' · ')

  return (
    <div className="item">
      <div className="pos">{item.current_rank}.</div>
      {item.direction === "up" &&
        <div className="dev dev-up"><i className="fa-solid fa-arrow-trend-up"></i></div>}
      {item.direction === "down" &&
        <div className="dev dev-down"><i className="fa-solid fa-arrow-trend-down"></i></div>}
      {item.direction === "same" &&
        <div className="dev dev-stand"><i className="fa-solid fa-minus"></i></div>}
      <div className="v-thumbnail">
        <MovieImagesPoster movie={item}/>
      </div>
      <div className="name-wrap">
        <h4 className="name lim-1">
          <Link href={movieDetailUrl(item)} title={item.title}>{item.title}</Link>
        </h4>
        {desc && <div className="rank-desc lim-2">{desc}</div>}
      </div>
    </div>
  )
}

export default memo(MovieItemRanking)