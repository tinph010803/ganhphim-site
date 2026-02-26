"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import Link from "next/link";
import {moviePoster} from "@/utils/image";
import {movieDetailUrl} from "@/utils/url";
import MovieInfoLine from "@/components/movie/InfoLine";
import LoadingElement from "@/components/loading/Element";

const MovieSuggestion = ({movieId, movie, style = "grid"}) => {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMovies = async () => {
    setIsLoading(true)
    try {
      // Ưu tiên lọc theo thể loại & sắp xếp mới nhất
      const ANIMATION_SLUG = 'hoat-hinh'
      const isAnimation = (movie?.genres || []).some(g => g.slug === ANIMATION_SLUG)

      // Nếu phim hiện tại KHÔNG phải hoạt hình → loại thể loại hoạt hình ra khỏi filter
      const genreSlugs = (movie?.genres || [])
        .map(g => g.slug)
        .filter(Boolean)
        .filter(slug => isAnimation || slug !== ANIMATION_SLUG)

      if (genreSlugs.length > 0) {
        // Dùng tối đa 2 thể loại đầu để tìm phim tương tự
        const result = await MovieApi.filter({
          genres: genreSlugs.slice(0, 2),
          sort: 'release_date',
          limit: 16,
          page: 1,
        })
        const items = (result?.items || result || [])
          .filter(m => m._id !== movieId && m.slug !== movie?.slug)
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .slice(0, 10)

        if (items.length >= 4) {
          setMovies(items)
          return
        }
      }

      // Fallback: API suggestion gốc
      if (movieId) {
        const result = await MovieApi.suggestion(movieId)
        setMovies((result || []).slice(0, 10))
      }
    } catch (e) {
      // Fallback nếu lỗi
      if (movieId) {
        const result = await MovieApi.suggestion(movieId)
        setMovies((result || []).slice(0, 10))
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMovies()
  }, [movieId])

  if (isLoading)
    return (
      <div className="cg-body-box is-suggest">
        <LoadingElement/>
      </div>
    )

  if (movies.length === 0) return null

  if (style === "grid")
    return (
      <div className="cg-body-box is-suggest">
        <div className="box-header">
          <div className="heading-md mb-0">Có thể bạn sẽ thích</div>
        </div>
        <div className="box-body">
          <div className="cards-grid-wrapper de-suggest">
            {movies.map(item => (
              <MovieItemStyle1 movie={item} key={`m-s-${item._id}`}/>
            ))}
          </div>
        </div>
      </div>
    )

  if (style === "list")
    return (
      <div className="ws-top">
        <div className="child-box child-suggest">
          <div className="child-header"><span>Đề xuất cho bạn</span></div>
          <div className="child-content">
            <div className="cc-top">
              {movies.slice(0, 6).map(item => {
                return (
                  <div className="item" key={`m-s-${item._id}`}>
                    <div className="h-item">
                      <div className="v-thumb-m">
                        <Link href={movieDetailUrl(item)} className="v-thumbnail">
                          <img src={moviePoster(item.images.posters)} alt={item.title}/>
                        </Link>
                      </div>
                      <div className="info">
                        <h4 className="item-title lim-2">
                          <Link href={movieDetailUrl(item)} title={item.title}>{item.title}</Link>
                        </h4>
                        <div className="alias-title mb-2 lim-1">{item.english_title}</div>
                        <MovieInfoLine movie={item}/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
}

export default memo(MovieSuggestion)