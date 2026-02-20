"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import MovieTooltipItem from "@/components/movie/TooltipItem";
import {memo} from "react";
import MovieInfoLine from "@/components/movie/InfoLine";
import MovieImagesPoster from "@/components/movie/images/Poster";
import MovieItemLatestEpisode from "@/components/movie/item/LatestEpisode";

const MovieItemStyle4 = ({movie, index}) => {
  return (
    <div className="sw-item">
      <CustomLink href={movieDetailUrl(movie)} className="v-thumbnail">
        <div className="mask"></div>
        <MovieItemLatestEpisode movie={movie}/>
        <MovieTooltipItem movie={movie} offsetLeft={30} offsetTop={40}>
          <MovieImagesPoster movie={movie} size={`400-0`}/>
        </MovieTooltipItem>
      </CustomLink>
      <div className="info info-v w-chart">
        <div className="number">{index + 1}</div>
        <h4 className="item-title lim-1">
          <CustomLink href={movieDetailUrl(movie)} title={movie.title} prefetch={false}>{movie.title}</CustomLink>
        </h4>
        <div className="alias-title lim-1">{movie.english_title}</div>
        <MovieInfoLine movie={movie}/>
      </div>
    </div>
  )
}

export default memo(MovieItemStyle4)