"use client"

import {memo} from "react";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import {useAppSelector} from "@/hooks/redux";
import Pagination2 from "@/components/pagination/Pagination";

const FilterMovieList = () => {
  const {filterMovies, filterPageCount} = useAppSelector(state => state.movie)

  const handlePageChange = (page) => {
    console.log('page', page)
  }

  return (
    <>
      <div className="row-content">
        <div className="cards-grid-wrapper">
          {filterMovies.map(item => {
            return (
              <MovieItemStyle1 movie={item} key={`movie-${item._id}`}/>
            )
          })}
        </div>
      </div>
      <Pagination2 pageCount={filterPageCount} handlePageChange={handlePageChange}/>
    </>
  )
}

export default memo(FilterMovieList)