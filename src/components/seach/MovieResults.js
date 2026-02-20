"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import {setShowSearchResult} from "@/redux/features/appSlice";
import {moviePoster} from "@/utils/image";
import {memo} from "react";
import MovieInfoLine from "@/components/movie/InfoLine";
import {useAppDispatch} from "@/hooks/redux";

const SearchMovieResults = ({movies}) => {
  const dispatch = useAppDispatch()

  if (movies.length > 0)
    return (
      <div className="show-group effect-fade-in">
        <div className="group-title">Danh sách phim</div>
        <div className="group-list">
          {movies.map(item => {
            return (
              <CustomLink href={movieDetailUrl(item)} className="h-item s-item" key={`sr-${item._id}`}
                    onClick={() => dispatch(setShowSearchResult(false))}>
                <div className="v-thumb-s">
                  <div className="v-thumbnail">
                    <img src={moviePoster(item.images.posters, "100-0", false)}/>
                  </div>
                </div>
                <div className="info">
                  <h4 className="item-title lim-2">{item.title}</h4>
                  <div className="alias-title mb-2 lim-1">{item.english_title}</div>
                  <MovieInfoLine movie={item}/>
                </div>
              </CustomLink>
            )
          })}
        </div>
      </div>
    )
}

export default memo(SearchMovieResults)