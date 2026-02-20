"use client"

import {movieDetailUrl, movieWatchUrl} from "@/utils/url";
import {memo} from "react";
import MovieImagesPoster from "@/components/movie/images/Poster";
import {formatDuration} from "@/utils/helpers";
import ContinueWatchingApi from "@/api/continueWatching.api";
import {setCwMoviesHome, setCwMoviesList} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import CustomLink from "@/components/shared/CustomLink";

const MovieItemContinueWatching = ({movie, page = "home"}) => {
  const dispatch = useAppDispatch()
  const {cwMoviesHome, cwMoviesList} = useAppSelector(state => state.movie)

  const handleRemoveCw = async () => {
    try {
      const {status} = await ContinueWatchingApi.remove({movie_id: movie._id})
      if (page === "home") {
        dispatch(setCwMoviesHome(cwMoviesHome.filter(el => el._id !== movie._id)))
      } else {
        dispatch(setCwMoviesList(cwMoviesList.filter(el => el._id !== movie._id)))
      }
    } catch (e) {
    }
  }

  let watchUrl = `${movieWatchUrl(movie)}?ver=${movie.cw.version}`
  if(movie.type===2) watchUrl += `&ss=${movie.cw.season_number}&ep=${movie.cw.episode_number}`

  return (
    <div className="sw-item">
      <div className="pin-remove" onClick={() => handleRemoveCw()}>
        <i className="fa-solid fa-times"></i>
      </div>
      <CustomLink href={watchUrl} className="v-thumbnail">
        <MovieImagesPoster movie={movie}/>
      </CustomLink>
      <div className="info">
        <div className="watched-bar mt-1">
          <span style={{width: `${(movie.cw.time / movie.cw.duration) * 100}%`}}></span>
        </div>
        <div className="watched-info">
          {movie.cw.season_number && movie.latest_season > 1 &&
            <div className="w-item">P.{movie.cw.season_number}</div>}
          {movie.cw.season_number && <div className="w-item">Tập {movie.cw.episode_number}</div>}
          <div className="w-item">{formatDuration(movie.cw.time / 60)}
            <span> / {formatDuration(movie.cw.duration / 60)}</span></div>
        </div>
        <h4 className="item-title lim-1">
          <CustomLink href={watchUrl} title={movie.title}>{movie.title}</CustomLink>
        </h4>
        <h4 className="alias-title lim-1">
          <CustomLink href={movieDetailUrl(movie)} title={movie.english_title}>{movie.english_title}</CustomLink>
        </h4>
      </div>
    </div>
  )
}

export default memo(MovieItemContinueWatching)