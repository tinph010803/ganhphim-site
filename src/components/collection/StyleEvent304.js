"use client"

import {memo, useEffect, useState} from "react";
import {shuffle} from "lodash";
import {moviePoster} from "@/utils/image";
import Link from "next/link";
import {collectionUrl, movieDetailUrl, movieWatchUrl} from "@/utils/url";

const CollectionStyleEvent304 = ({collection}) => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    setMovies(collection.random_data ? shuffle(collection.movies) : collection.movies)
  }, [collection]);

  return (
    <div id="row-event" className="event-gpmn">
      <div className="container">
        <div className="event-content">
          <div className="hero-behind"></div>
          <div className="hero">
            <div className="flag"></div>
          </div>
          <div className="gpmn-text">
            <img src="/images/event_304/50y.webp" alt=""/>
            <div className="buttons">
              <Link href={collectionUrl(collection)} className="btn btn-lg btn-block btn-light justify-content-between">
                <span className="flex-grow-1 text-center">Tìm hiểu về ngày 30/4</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="grid-3x2">
            {movies.slice(0, 6).map(movie => (
              <div className="h-item" key={`m-${movie._id}`}>
                <Link href={movieDetailUrl(movie)} className="v-thumb-m">
                  <div className="v-thumbnail">
                    <img src={moviePoster(movie.images.posters)} alt={movie.title}/>
                  </div>
                </Link>
                <div className="info">
                  <h4 className="item-title lim-2"><Link href={movieDetailUrl(movie)}
                                                         title={movie.title}>{movie.title}</Link></h4>
                  <div className="div-button">
                    <Link href={movieWatchUrl(movie)} className="btn btn-sm btn-outline">
                      <i className="fa-solid fa-play"></i>
                      <span>Xem phim</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="gpmn-more">
            <Link href={collectionUrl(collection)} className="more-button">
              <span>Xem thêm</span>
              <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CollectionStyleEvent304)