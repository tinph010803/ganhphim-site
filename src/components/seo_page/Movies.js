"use client"

import MovieApi from "@/api/movie.api";
import {useEffect, useState} from "react";
import MovieItemStyle1 from "@/components/movie/item/Style1";

const SeoPageMovies = () => {
  const [latestMovies, setLatestMovies] = useState([])
  const [hotMovies, setHotMovies] = useState([])
  const [randomMovies, setRandomMovies] = useState([])

  const getMovies = async () => {
    const result = await MovieApi.seoData()
    setLatestMovies(result.latestMovies)
    setHotMovies(result.hotMovies)
    setRandomMovies(result.randomMovies)
  }

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <>
      <div className="cards-row fixed">
        <div className="row-header">
          <h3 className="category-name">Phim Mới Ra</h3>
        </div>
        <div className="row-content">
          <div className="cards-grid-wrapper grid-6or">
            {latestMovies.map(movie => (
              <MovieItemStyle1 movie={movie} key={`latest-${movie._id}`}/>
            ))}
          </div>
        </div>
      </div>
      <div className="cards-row fixed">
        <div className="row-header">
          <h3 className="category-name">Phim Hot</h3>
        </div>
        <div className="row-content">
          <div className="cards-grid-wrapper grid-6or">
            {hotMovies.map(movie => (
              <MovieItemStyle1 movie={movie} key={`latest-${movie._id}`}/>
            ))}
          </div>
        </div>
      </div>
      {randomMovies.length > 0 && (
      <div className="cards-row fixed">
        <div className="row-header">
          <h3 className="category-name">Phim Ngẫu Nhiên</h3>
        </div>
        <div className="row-content">
          <div className="cards-grid-wrapper grid-6or">
            {randomMovies.map(movie => (
              <MovieItemStyle1 movie={movie} key={`latest-${movie._id}`}/>
            ))}
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default SeoPageMovies