import {getAPI, postAPI} from "@/utils/axios";

const API_PREFIX = '/playlist'

class PlaylistApi {
  add = async (data) => {
    const res = await postAPI({path: `${API_PREFIX}/add`, data})

    return res
  }

  update = async ({id, data}) => {
    const res = await postAPI({path: `${API_PREFIX}/update/${id}`, data})

    return res
  }

  delete = async (id) => {
    const res = await postAPI({path: `${API_PREFIX}/delete`, data: {id}})

    return res
  }

  addMovie = async (data) => {
    const res = await postAPI({path: `${API_PREFIX}/addMovie`, data})

    return res
  }

  removeMovie = async (data) => {
    const res = await postAPI({path: `${API_PREFIX}/removeMovie`, data})

    return res
  }

  list = async () => {
    const res = await getAPI({path: `${API_PREFIX}/list`})

    return res
  }

  listByMovie = async (movieId) => {
    const res = await getAPI({path: `${API_PREFIX}/listByMovie?movie_id=${movieId}`})

    return res
  }

  movies = async (playlistId) => {
    const res = await getAPI({path: `${API_PREFIX}/movies?playlist_id=${playlistId}`})

    return res
  }
}


export default new PlaylistApi