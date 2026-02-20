import {getAPI, postAPI, isUsingOphimApi} from "@/utils/axios";

const API_PREFIX = '/favoriteCast'

class FavoriteCastApi {
  info = async (castId) => {
    if (isUsingOphimApi()) return {result: null}
    const res = await getAPI({path: `${API_PREFIX}/info?cast_id=${castId}`})
    return res
  }

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

  list = async ({page = 1}) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    const res = await getAPI({path: `${API_PREFIX}/list?limit=18&page=${page}`})
    return res
  }
}


export default new FavoriteCastApi