"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import MovieTooltipItem from "@/components/movie/TooltipItem";
import {movieBackdrop, moviePoster} from "@/utils/image";
import {memo} from "react";
import MovieItemLatestEpisode from "@/components/movie/item/LatestEpisode";
import MovieInfoLine from "@/components/movie/InfoLine";
import MovieImagesPoster from "@/components/movie/images/Poster";

const MovieItemStyle3 = ({movie}) => {
  return (
    <div className="sw-cover">
      <CustomLink href={movieDetailUrl(movie)} className="v-thumbnail v-thumbnail-hoz">
        <MovieItemLatestEpisode movie={movie}/>
        <MovieTooltipItem movie={movie} offsetLeft={105} offsetTop={-50}>
          <img src={movieBackdrop(movie.images.backdrops, "500-0")} alt={movie.title} loading="lazy"/>
        </MovieTooltipItem>
      </CustomLink>
      <div className="h-item">
        <div className="v-thumb-m">
          <CustomLink href={movieDetailUrl(movie)} className="v-thumbnail" prefetch={false}>
            <MovieImagesPoster movie={movie} size="100-0"/>
          </CustomLink>
        </div>
        <div className="info">
          <h4 className="item-title lim-1">
            <CustomLink href={movieDetailUrl(movie)} title={movie.title} prefetch={false}>{movie.title}</CustomLink>
          </h4>
          <h4 className="alias-title lim-1 mb-1">
            <CustomLink href={movieDetailUrl(movie)} title={movie.english_title} prefetch={false}>{movie.english_title}</CustomLink>
          </h4>
          <MovieInfoLine movie={movie}/>
        </div>
      </div>
    </div>
  )
}

export default memo(MovieItemStyle3)