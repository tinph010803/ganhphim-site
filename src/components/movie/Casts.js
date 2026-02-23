"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import {peopleAvatar} from "@/utils/image";
import Link from "next/link";
import {isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";

const fetchTmdbCredits = async (tmdbId, tmdbType) => {
  try {
    const res = await fetch(`/web-api/tmdb/credits?tmdbId=${tmdbId}&tmdbType=${tmdbType || 'movie'}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const TMDB_CAST_PREFIX = '/dien-vien/tmdb/'

const MovieCasts = ({movieId, movie}) => {
  const [casts, setCasts] = useState([])

  const getCasts = async () => {
    if (isUsingOphimApi() || isUsingGtavnApi()) {
      let tmdbId = movie?.tmdb_id
      let tmdbType = movie?.tmdb_type

      // If no tmdb_id, try searching by title
      if (!tmdbId && movie?.title) {
        const res = await fetch(`/web-api/tmdb/search-movie?title=${encodeURIComponent(movie.english_title || movie.title)}&year=${movie.year || ''}`)
        if (res.ok) {
          const found = await res.json()
          if (found?.id) { tmdbId = found.id; tmdbType = found.type }
        }
      }

      if (tmdbId) {
        const tmdbCasts = await fetchTmdbCredits(tmdbId, tmdbType)
        if (tmdbCasts.length > 0) {
          setCasts(tmdbCasts)
          return
        }
      }
      // Fallback: local names without photos
      const base = (movie?.casts || [])
      if (base.length === 0) return
      setCasts(base.map(c => ({
        _id: c._id,
        tmdb_id: null,
        cast: {_id: c._id, name: c.name, slug: c.slug, profile_path: null, character: null}
      })))
      return
    }
    const res = await MovieApi.casts(movieId)
    setCasts(res)
  }

  useEffect(() => {
    getCasts()
  }, [])

  return (
    <div className="child-box child-actors">
      <div className="child-header">Diễn viên</div>
      <div className="child-actors-list">
        {casts.map(item => {
          const href = item.tmdb_id ? `${TMDB_CAST_PREFIX}${item.tmdb_id}` : null
          return (
            <div className="v-item" key={`cast-${item._id}`}>
              {href
                ? <Link href={href} className="v-actor v-actor-medium"><img src={peopleAvatar(item.cast.profile_path)} alt={item.cast.name}/></Link>
                : <span className="v-actor v-actor-medium"><img src={peopleAvatar(item.cast.profile_path)} alt={item.cast.name}/></span>
              }
              <div className="info">
                <h4 className="item-title lim-2">
                  {href ? <Link href={href}>{item.cast.name}</Link> : item.cast.name}
                </h4>
                {item.cast.character && <div className="alias-title lim-1" style={{fontSize:'11px',opacity:.6}}>{item.cast.character}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(MovieCasts)