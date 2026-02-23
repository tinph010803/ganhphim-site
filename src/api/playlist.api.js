import {getAPI, postAPI, putAPI, deleteAPI, isUsingGtavnApi} from "@/utils/axios";

const API_PREFIX = '/playlist'

class PlaylistApi {
  add = async (data) => {
    if (isUsingGtavnApi()) {
      // data = { name }
      const res = await postAPI({path: API_PREFIX, data})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/add`, data})
    return res
  }

  update = async ({id, data}) => {
    if (isUsingGtavnApi()) {
      const res = await putAPI({path: `${API_PREFIX}/${id}`, data})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/update/${id}`, data})
    return res
  }

  delete = async (id) => {
    if (isUsingGtavnApi()) {
      const res = await deleteAPI({path: `${API_PREFIX}/${id}`})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/delete`, data: {id}})
    return res
  }

  addMovie = async (data) => {
    if (isUsingGtavnApi()) {
      // data = { playlistId, movieId }
      const {playlistId, movieId} = data
      const res = await postAPI({path: `${API_PREFIX}/${playlistId}/movie`, data: {movieId}})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/addMovie`, data})
    return res
  }

  removeMovie = async (data) => {
    if (isUsingGtavnApi()) {
      // data = { playlistId, movieId }
      const {playlistId, movieId} = data
      const res = await deleteAPI({path: `${API_PREFIX}/${playlistId}/movie/${movieId}`})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/removeMovie`, data})
    return res
  }

  list = async ({page = 1, limit = 20} = {}) => {
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}?page=${page}&limit=${limit}`})
      return res
    }
    const res = await getAPI({path: `${API_PREFIX}/list`})
    return res
  }

  detail = async (id) => {
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}/${id}`})
      return res
    }
    return {result: null}
  }

  listByMovie = async (movieId) => {
    if (isUsingGtavnApi()) return {result: []}
    const res = await getAPI({path: `${API_PREFIX}/listByMovie?movie_id=${movieId}`})
    return res
  }

  movies = async (playlistId, {page = 1, limit = 20} = {}) => {
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${API_PREFIX}/${playlistId}/movies?page=${page}&limit=${limit}`})
      return res
    }
    const res = await getAPI({path: `${API_PREFIX}/movies?playlist_id=${playlistId}`})
    return res
  }
}


export default new PlaylistApi