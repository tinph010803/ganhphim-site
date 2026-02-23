import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {normalizeGtavnListItem} from "@/api/movie.api";

const API_PREFIX = '/favorite'

class FavoriteApi {
  add = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    const res = await postAPI({path: `${API_PREFIX}/add`, data})
    return res
  }

  remove = async (data) => {
    if (isUsingOphimApi()) return {status: false}
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
    if (isUsingGtavnApi()) return {result: []}
    const res = await getAPI({path: `${API_PREFIX}/listIds`})
    return res
  }

  list = async ({page = 1, limit = 18}) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
      if (res?.status && res?.data?.items) {
        return {
          ...res,
          data: {
            ...res.data,
            items: (res.data.items || []).map((fav) => ({
              ...fav,
              movie: fav.movie ? normalizeGtavnListItem(fav.movie) : null,
            })),
          },
        }
      }
      return res
    }
    const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
    return res
  }
}


export default new FavoriteApi