"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import {movieBackdrop} from "@/utils/image";
import {memo} from "react";
import MovieGenreTags from "@/components/movie/GenreTags";
import MovieFavoriteButton from "@/components/movie/favorite/Button";
import InfoIcon from "@/components/icons/Info";
import MovieInfoTags from "@/components/movie/InfoTags";

const MovieItemStyle2 = ({movie}) => {
  return (
    <div className="slide-elements">
      <CustomLink href={movieDetailUrl(movie)} className="slide-url"></CustomLink>
      <div className="cover-fade">
        <div className="cover-image">
          <img src={movieBackdrop(movie.images.backdrops)} alt={movie.title} loading="lazy"/>
        </div>
      </div>
      <div className="safe-area">
        <div className="slide-content">
          <div className="media-item">
            <h3 className="media-title lim-1">
              <CustomLink href={movieDetailUrl(movie)} title={movie.title} prefetch={false}>{movie.title}</CustomLink>
            </h3>
            <h3 className="media-alias-title">
              <CustomLink href={movieDetailUrl(movie)} title={movie.english_title} prefetch={false}>{movie.english_title}</CustomLink>
            </h3>
            <MovieInfoTags movie={movie}/>
            <div className="hl-tags mb-4">
              <MovieGenreTags genres={movie.genres} position={`m-${movie._id}`}/>
            </div>
            <div className="description lim-3">
              {movie.overview}
            </div>
            <div className="touch">
              <CustomLink href={movieDetailUrl(movie)} className="button-play"><i
                className="fa-solid fa-play"></i></CustomLink>
              <div className="touch-group">
                <MovieFavoriteButton position="swiper" movieId={movie._id}/>
                <CustomLink className="item" href={movieDetailUrl(movie)} prefetch={false}>
                  <div className="inc-icon icon-20">
                    <InfoIcon/>
                  </div>
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MovieItemStyle2)