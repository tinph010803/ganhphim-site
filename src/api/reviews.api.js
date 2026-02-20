import {getAPI, postAPI, isUsingOphimApi} from "@/utils/axios";

const API_PREFIX = '/reviews'

class ReviewsApi {
  send = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    const res = await postAPI({path: `${API_PREFIX}/send`, data})
    return res
  }

  statsByMovie = async (movie_id) => {
    if (isUsingOphimApi()) return {result: null}
    const res = await getAPI({path: `${API_PREFIX}/statsByMovie?movie_id=${movie_id}`})
    return res
  }

  infoByUser = async (movie_id) => {
    if (isUsingOphimApi()) return {result: null}
    const res = await getAPI({path: `${API_PREFIX}/infoByUser?movie_id=${movie_id}`})
    return res
  }
}


export default new ReviewsApi