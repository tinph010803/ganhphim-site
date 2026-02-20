import {getAPI, postAPI, isUsingOphimApi} from "@/utils/axios";

const API_PREFIX = '/comment'

class CommentApi {
  info = async (id) => {
    if (isUsingOphimApi()) return {result: null}
    const result = await getAPI({path: `${API_PREFIX}/info/${id}`})
    return result
  }

  add = async (data) => {
    if (isUsingOphimApi()) return {status: false, msg: 'Không khả dụng'}
    const res = await postAPI({path: `${API_PREFIX}/add`, data})
    return res
  }

  vote = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    const res = await postAPI({path: `${API_PREFIX}/vote`, data})
    return res
  }

  list = async (filter) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    const queryString = Object.keys(filter).map(key => key + '=' + filter[key]).join('&')
    const res = await getAPI({path: `${API_PREFIX}/list?${queryString}`})
    return res
  }

  replyList = async (parent_id) => {
    if (isUsingOphimApi()) return {result: {items: []}}
    const res = await getAPI({path: `${API_PREFIX}/replyList?parent_id=${parent_id}`})
    return res
  }

  voteList = async (movie_id) => {
    if (isUsingOphimApi()) return {result: {items: []}}
    const res = await getAPI({path: `${API_PREFIX}/voteList?movie_id=${movie_id}`})
    return res
  }

  latestComments = async () => {
    if (isUsingOphimApi()) return {result: []}
    const result = await getAPI({path: `${API_PREFIX}/latestComments`})
    return result
  }

  topComments = async () => {
    if (isUsingOphimApi()) return {result: []}
    const result = await getAPI({path: `${API_PREFIX}/topComments`})
    return result
  }

  action = async ({id, action, info}) => {
    if (isUsingOphimApi()) return {status: false}
    const res = await postAPI({path: `${API_PREFIX}/action`, data: {id, action, info}})
    return res
  }
}


export default new CommentApi