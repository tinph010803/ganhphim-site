import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {getAuthTokens} from "@/utils/auth";

const API_PREFIX = '/continueWatching'
const LS_PREFIX = 'rophim_cw_'
const CW_API_BASE = '/web-api/cw'

// --- Auth token helper ---
function getToken() {
  try { return getAuthTokens()?.accessToken || null } catch { return null }
}

// --- Internal fetch to Next.js web-api routes ---
async function cwFetch(path, options = {}) {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

// --- localStorage helpers (fallback for guests) ---
function lsSet(movieId, data) {
  try { localStorage.setItem(LS_PREFIX + movieId, JSON.stringify(data)) } catch (e) {}
}

function lsGet(movieId) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_PREFIX + movieId) : null
    return raw ? JSON.parse(raw) : null
  } catch (e) { return null }
}

function lsRemove(movieId) {
  try { localStorage.removeItem(LS_PREFIX + movieId) } catch (e) {}
}

function lsGetAll() {
  try {
    if (typeof window === 'undefined') return []
    const items = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(LS_PREFIX)) {
        try {
          const val = JSON.parse(localStorage.getItem(key))
          if (val) items.push(val)
        } catch (e) {}
      }
    }
    return items
  } catch (e) { return [] }
}

class ContinueWatchingApi {
  info = async (movieId) => {
    if (isUsingOphimApi()) return {result: null}
    if (isUsingGtavnApi()) {
      const token = getToken()
      if (token) {
        // Logged in → fetch from MongoDB
        const res = await cwFetch(`${CW_API_BASE}/info?movieId=${encodeURIComponent(movieId)}`)
        if (res) return res
      }
      // Guest → localStorage
      const d = lsGet(movieId)
      if (!d) return {result: null}
      return {
        result: {
          movie_id: movieId,
          season_number: d.season_number ?? 1,
          episode_number: d.episode_number ?? 1,
          episode_name: d.episode_name ?? null,
          server_label: d.server_label ?? null,
          version: d.version ?? 1,
          time: d.time ?? 0,
          duration: d.duration ?? 0,
        }
      }
    }
    const res = await getAPI({path: `${API_PREFIX}/info?movie_id=${movieId}`})
    return res
  }

  save = async (data) => {
    if (isUsingOphimApi()) return null
    if (isUsingGtavnApi()) {
      const movieId = data.movieId || data.movie_id
      if (!movieId) return null
      const token = getToken()
      if (token) {
        // Logged in → save to MongoDB
        await cwFetch(`${CW_API_BASE}/save`, {
          method: 'POST',
          body: JSON.stringify({
            movieId,
            movie: data.movie || null,
            season_number: data.season_number ?? data.seasonNumber ?? 1,
            episode_number: data.episode_number ?? data.episodeNumber ?? 1,
            episode_name: data.episode_name ?? null,
            server_label: data.server_label ?? null,
            version: data.version ?? 1,
            time: data.time ?? 0,
            duration: data.duration ?? 0,
          }),
        })
        // Also mirror to localStorage so it works instantly if user goes offline
        const existing = lsGet(movieId) || {}
        lsSet(movieId, {
          movieId,
          movie: data.movie || existing.movie || null,
          season_number: data.season_number ?? data.seasonNumber ?? existing.season_number ?? 1,
          episode_number: data.episode_number ?? data.episodeNumber ?? existing.episode_number ?? 1,
          episode_name: data.episode_name ?? existing.episode_name ?? null,
          server_label: data.server_label ?? existing.server_label ?? null,
          version: data.version ?? existing.version ?? 1,
          time: data.time ?? 0,
          duration: data.duration ?? 0,
          updatedAt: new Date().toISOString(),
        })
        return {success: true}
      }
      // Guest → localStorage only
      const existing = lsGet(movieId) || {}
      lsSet(movieId, {
        movieId,
        movie: data.movie || existing.movie || null,
        season_number: data.season_number ?? data.seasonNumber ?? existing.season_number ?? 1,
        episode_number: data.episode_number ?? data.episodeNumber ?? existing.episode_number ?? 1,
        episode_name: data.episode_name ?? existing.episode_name ?? null,
        server_label: data.server_label ?? existing.server_label ?? null,
        version: data.version ?? existing.version ?? 1,
        time: data.time ?? 0,
        duration: data.duration ?? 0,
        updatedAt: new Date().toISOString(),
      })
      return {success: true}
    }
    const res = await postAPI({path: `${API_PREFIX}/save`, data})
    return res
  }

  remove = async (data) => {
    if (isUsingOphimApi()) return null
    if (isUsingGtavnApi()) {
      const movieId = data.movieId || data.movie_id
      if (!movieId) return null
      const token = getToken()
      if (token) {
        await cwFetch(`${CW_API_BASE}/remove`, {
          method: 'POST',
          body: JSON.stringify({movieId}),
        })
      }
      lsRemove(movieId)
      return {success: true}
    }
    const res = await postAPI({path: `${API_PREFIX}/remove`, data})
    return res
  }

  list = async ({page = 1, limit = 20}) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    if (isUsingGtavnApi()) {
      const token = getToken()
      if (token) {
        // Logged in → fetch from MongoDB
        const res = await cwFetch(`${CW_API_BASE}/list?page=${page}&limit=${limit}`)
        if (res?.result) return res
      }
      // Guest → localStorage
      const allItems = lsGetAll()
        .filter(d => d && d.movieId)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

      const totalItems = allItems.length
      const totalPages = Math.ceil(totalItems / limit) || 1
      const start = (page - 1) * limit
      const pageItems = allItems.slice(start, start + limit)

      const items = pageItems.map(d => {
        const movieData = d.movie || {}
        return {
          ...movieData,
          _id: movieData._id || d.movieId,
          cw: {
            version: d.version ?? 1,
            season_number: d.season_number ?? 1,
            episode_number: d.episode_number ?? 1,
            episode_name: d.episode_name ?? null,
            server_label: d.server_label ?? null,
            time: d.time ?? 0,
            duration: d.duration ?? 0,
          },
        }
      }).filter(item => item._id)

      return {result: {items, page_count: totalPages}}
    }
    const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
    return res
  }
}


export default new ContinueWatchingApi
