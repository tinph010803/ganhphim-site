"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import TmdbApi from "@/api/tmdb.api";
import {peopleAvatar} from "@/utils/image";
import Link from "next/link";
import {isUsingOphimApi} from "@/utils/axios";

const TMDB_CAST_PREFIX = '/dien-vien/tmdb/'

const MovieCasts = ({movieId, movie}) => {
  const [casts, setCasts] = useState([])

  const getCasts = async () => {
    if (isUsingOphimApi()) {
      // Base list: actors from OPhim's actor field
      const base = (movie?.casts || [])
      if (base.length === 0) return

      // Try to enrich with TMDB photos by name matching
      if (movie?.tmdb_id) {
        const tmdbCasts = await TmdbApi.credits(movie.tmdb_id, movie.tmdb_type)
        if (tmdbCasts.length > 0) {
          const normalize = (s) => s?.toLowerCase().trim()
          const enriched = base.map(c => {
            const matched = tmdbCasts.find(t => normalize(t.cast.name) === normalize(c.name))
            return {
              _id: c._id,
              tmdb_id: matched?.tmdb_id || null,
              cast: {
                _id: c._id,
                name: c.name,
                slug: c.slug,
                profile_path: matched?.cast.profile_path || null,
                character: matched?.cast.character || null,
              }
            }
          })
          setCasts(enriched)
          return
        }
      }

      // Fallback: name-only list
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