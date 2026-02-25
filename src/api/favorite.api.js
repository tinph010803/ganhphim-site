import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {normalizeGtavnListItem} from "@/api/movie.api";

const API_PREFIX = '/favorite'

class FavoriteApi {
  add = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const movieId = data.movieId || data.movie_id
      const res = await postAPI({path: `${API_PREFIX}/toggle`, data: {movieId}})
      return {status: res?.status ?? false, msg: res?.message || ''}
    }
    const res = await postAPI({path: `${API_PREFIX}/add`, data})
    return res
  }

  remove = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const movieId = data.movieId || data.movie_id
      const res = await postAPI({path: `${API_PREFIX}/toggle`, data: {movieId}})
      return {status: res?.status ?? false, msg: res?.message || ''}
    }
    const res = await postAPI({path: `${API_PREFIX}/remove`, data})
    return res
  }

  toggle = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const res = await postAPI({path: `${API_PREFIX}/toggle`, data})
      return res
    }
    // Fallback for old API: toggle via add/remove
    return {status: false}
  }

  check = async (movieId) => {
    if (isUsingOphimApi()) return {data: {isFavorited: false}}
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}/check/${movieId}`})
      return res
    }
    return {data: {isFavorited: false}}
  }

  listIds = async () => {
    if (isUsingOphimApi()) return {result: []}
    if (isUsingGtavnApi()) {
      try {
        const res = await getAPI({path: `${API_PREFIX}/list?limit=500&page=1`})
        const rawItems = res?.data?.items || []
        const ids = rawItems
          .map((fav) => fav?.movie?._id || fav?.movieId || null)
          .filter(Boolean)
        return {result: ids}
      } catch (err) {
        return {result: []}
      }
    }
    const res = await getAPI({path: `${API_PREFIX}/listIds`})
    return res
  }

  list = async ({page = 1, limit = 18}) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
      const rawItems = res?.data?.items || []
      const movieItems = rawItems
        .map((fav) => (fav.movie ? normalizeGtavnListItem(fav.movie) : null))
        .filter(Boolean)
      return {
        result: {
          items: movieItems,
          page_count: res?.data?.pagination?.totalPages ?? 0,
        }
      }
    }
    const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
    return res
  }
}


export default new FavoriteApi