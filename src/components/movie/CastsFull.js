"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import {peopleAvatar} from "@/utils/image";
import Link from "next/link";
import {castUrl} from "@/utils/url";

const MovieCastsFull = ({movieId}) => {
  const [casts, setCasts] = useState([])

  const getCasts = async () => {
    const res = await MovieApi.casts(movieId)
    setCasts(res)
  }

  useEffect(() => {
    getCasts()
    // console.log('render movie casts')
  }, [])

  return (
    <div className="cg-body-box is-actors">
      <div className="box-header">
        <div className="heading-md mb-0">Diễn viên</div>
      </div>
      <div className="box-body">
        <div className="de-actors">
          {casts.map(item => {
            const href = item.tmdb_id ? `/dien-vien/tmdb/${item.tmdb_id}` : castUrl(item.cast)
            return (
              <div className="item-actor" key={`cast-f-${item._id}`}>
                <div className="v-item">
                  <Link href={href} className="v-actor">
                    <img src={peopleAvatar(item.cast.profile_path)} alt={item.cast.name}/>
                  </Link>
                  <div className="info">
                    <h4 className="item-title"><Link href={href}>{item.cast.name}</Link></h4>
                    <div className="ro-play"><span>{item.character}</span></div>
                  </div>
                </div>
                <div className="ro-play"></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(MovieCastsFull)