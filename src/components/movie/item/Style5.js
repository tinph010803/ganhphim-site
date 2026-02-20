"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import MovieTooltipItem from "@/components/movie/TooltipItem";
import {memo} from "react";
import MovieItemLatestEpisode from "@/components/movie/item/LatestEpisode";
import MovieImagesPosterHorizontal from "@/components/movie/images/PosterHorizontal";

const MovieItemStyle5 = ({movie}) => {
  return (
    <div className="sw-cover single">
      <CustomLink href={movieDetailUrl(movie)} className="v-thumbnail v-thumbnail-hoz">
        <MovieItemLatestEpisode movie={movie}/>
        <MovieTooltipItem movie={movie} offsetLeft={50} offsetTop={-50}>
          <MovieImagesPosterHorizontal movie={movie} size={`400-0`}/>
        </MovieTooltipItem>
      </CustomLink>
      <div className="h-item">
        <div className="info">
          <h4 className="item-title lim-1">
            <CustomLink href={movieDetailUrl(movie)} title={movie.title} prefetch={false}>{movie.title}</CustomLink>
          </h4>
          <h4 className="alias-title lim-1">
            <CustomLink href={movieDetailUrl(movie)} title={movie.english_title} prefetch={false}>{movie.english_title}</CustomLink>
          </h4>
        </div>
      </div>
    </div>
  )
}

export default memo(MovieItemStyle5)