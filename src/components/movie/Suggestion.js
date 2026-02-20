"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import Link from "next/link";
import {moviePoster} from "@/utils/image";
import {movieDetailUrl} from "@/utils/url";
import MovieInfoLine from "@/components/movie/InfoLine";
import {shuffle} from "lodash";

const MovieSuggestion = ({movieId, style = "grid"}) => {
  const [movies, setMovies] = useState([])

  const getMovies = async () => {
    const result = await MovieApi.suggestion(movieId)
    setMovies(result)
  }

  useEffect(() => {
    if (movies.length === 0) {
      getMovies()
    }
  }, [])

  if (style === "grid")
    return (
      <div className="cg-body-box is-suggest">
        <div className="box-header">
          <div className="heading-md mb-0">Có thể bạn sẽ thích</div>
        </div>
        <div className="box-body">
          <div className="cards-grid-wrapper de-suggest">
            {shuffle(movies).map(item => {
              return (
                <MovieItemStyle1 movie={item} key={`m-s-${item._id}`}/>
              )
            })}
          </div>
        </div>
      </div>
    )

  if (style === "list")
    return (
      <div className="ws-top">
        <div className="child-box child-suggest">
          <div className="child-header"><span>Đề xuất cho bạn</span></div>
          <div className="child-content">
            <div className="cc-top">
              {shuffle(movies.slice(0,6)).map(item => {
                return (
                  <div className="item" key={`m-s-${item._id}`}>
                    <div className="h-item">
                      <div className="v-thumb-m">
                        <Link href={movieDetailUrl(item)} className="v-thumbnail">
                          <img src={moviePoster(item.images.posters)} alt={item.title}/>
                        </Link>
                      </div>
                      <div className="info">
                        <h4 className="item-title lim-2">
                          <Link href={movieDetailUrl(item)} title={item.title}>{item.title}</Link>
                        </h4>
                        <div className="alias-title mb-2 lim-1">{item.english_title}</div>
                        <MovieInfoLine movie={item}/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
}

export default memo(MovieSuggestion)