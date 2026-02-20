import {getAPI, postAPI, isUsingOphimApi} from "@/utils/axios";

const API_PREFIX = '/continueWatching'

class ContinueWatchingApi {
  info = async (movieId) => {
    if (isUsingOphimApi()) return {result: null}
    const res = await getAPI({path: `${API_PREFIX}/info?movie_id=${movieId}`})
    return res
  }

  save = async (data) => {
    if (isUsingOphimApi()) return null
    const res = await postAPI({path: `${API_PREFIX}/save`, data})
    return res
  }

  remove = async (data) => {
    if (isUsingOphimApi()) return null
    const res = await postAPI({path: `${API_PREFIX}/remove`, data})
    return res
  }

  list = async ({page = 1, limit = 20}) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&page=${page}`})
    return res
  }
}


export default new ContinueWatchingApi