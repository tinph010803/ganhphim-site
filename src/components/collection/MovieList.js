"use client"

import {memo, useEffect, useState} from "react";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import CollectionApi from "@/api/collection.api";

const CollectionMovieList = ({collectionId}) => {
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    const {result} = await CollectionApi.movies(collectionId)
    setMovies(result)
  }

  useEffect(() => {
    getMovies()
  }, []);

  return (
    <>
      <div className="row-content">
        <div className="cards-grid-wrapper">
          {movies.map(item => {
            return (
              <MovieItemStyle1 movie={item} key={`movie-${item._id}`}/>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default memo(CollectionMovieList)