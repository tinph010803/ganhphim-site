import {getAPI, postAPI, putAPI, deleteAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";

const normalizeGtavnComment = (item) => {
  if (!item) return null
  const movie = item.movie || {}
  return {
    _id: item._id,
    content: item.content || '',
    total_like: item.upvotes || 0,
    total_dislike: item.downvotes || 0,
    total_children: item.replyCount || 0,
    author: {
      _id: item.user?._id || item.userId,
      name: item.user?.displayName || item.user?.username || 'Ẩn danh',
      avatar: item.user?.avatar || null,
    },
    movie: {
      _id: movie._id,
      title: movie.name || '',
      slug: movie.slug || '',
      images: {
        posters: [{path: movie.poster ? Object.values(movie.poster)[0] || '' : ''}],
        backdrops: [{path: movie.poster ? Object.values(movie.poster)[0] || '' : ''}],
        titles: [],
      },
    },
    createdAt: item.createdAt,
  }
}

const GTAVN_PREFIX = '/comments'

class CommentApi {
  info = async (id) => {
    if (isUsingOphimApi()) return {result: null}
    if (isUsingGtavnApi()) return {result: null}
    const result = await getAPI({path: `${API_PREFIX}/info/${id}`})
    return result
  }

  add = async (data) => {
    if (isUsingOphimApi()) return {status: false, msg: 'Không khả dụng'}
    if (isUsingGtavnApi()) {
      const gtavnData = {
        movieId: data.movieId || data.movie_id,
        content: data.content,
        isSpoil: data.isSpoil ?? data.is_spoil ?? false,
        ...(data.parentId || data.parent_id ? {parentId: data.parentId || data.parent_id} : {}),
        ...(data.mentionId || data.mention_id ? {mentionId: data.mentionId || data.mention_id} : {}),
        ...(data.episode_number != null ? {episodeNumber: data.episode_number} : {}),
        ...(data.season_number != null ? {seasonNumber: data.season_number} : {}),
      }
      const res = await postAPI({path: GTAVN_PREFIX, data: gtavnData})
      const rawComment = res?.data?.comment || (res?.data?._id ? res.data : null)
      const comment = rawComment ? normalizeGtavnComment(rawComment) : null
      return {
        status: res?.status ?? false,
        msg: res?.message || (res?.status ? 'Đã gửi bình luận' : 'Gửi bình luận thất bại'),
        result: comment,
      }
    }
    const res = await postAPI({path: `${API_PREFIX}/add`, data})
    return res
  }

  update = async ({id, content}) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const res = await putAPI({path: `${GTAVN_PREFIX}/${id}`, data: {content}})
      return res
    }
    return {status: false}
  }

  remove = async (id) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const res = await deleteAPI({path: `${GTAVN_PREFIX}/${id}`})
      return res
    }
    return {status: false}
  }

  vote = async (data) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      const {id, voteType} = data
      if (!id) return {status: false}
      const res = await postAPI({path: `${GTAVN_PREFIX}/${id}/vote`, data: {voteType}})
      return res
    }
    const res = await postAPI({path: `${API_PREFIX}/vote`, data})
    return res
  }

  removeVote = async (id) => {
    if (isUsingGtavnApi()) {
      const res = await deleteAPI({path: `${GTAVN_PREFIX}/${id}/vote`})
      return res
    }
    return {status: false}
  }

  report = async ({id, reason, description}) => {
    if (isUsingGtavnApi()) {
      const res = await postAPI({path: `${GTAVN_PREFIX}/${id}/report`, data: {reason, description}})
      return res
    }
    return {status: false}
  }

  list = async (filter) => {
    if (isUsingOphimApi()) return {result: {items: [], page_count: 0}}
    if (isUsingGtavnApi()) {
      const {movie_id, movieId, page = 1, limit = 20, sort = 'newest'} = filter || {}
      const mId = movie_id || movieId
      if (!mId) return {result: {items: [], item_count: 0, has_more: false}}
      const res = await getAPI({path: `${GTAVN_PREFIX}/movie/${mId}?page=${page}&limit=${limit}&sort=${sort}`})
      const items = (res?.data?.items || []).map(normalizeGtavnComment).filter(Boolean)
      const pagination = res?.data?.pagination || {}
      return {
        result: {
          items,
          item_count: pagination.totalItems ?? 0,
          has_more: pagination.hasNextPage ?? false,
        }
      }
    }
    const queryString = Object.keys(filter).map(key => key + '=' + filter[key]).join('&')
    const res = await getAPI({path: `${API_PREFIX}/list?${queryString}`})
    return res
  }

  replyList = async (parent_id, {page = 1, limit = 20} = {}) => {
    if (isUsingOphimApi()) return {result: []}
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${GTAVN_PREFIX}/${parent_id}/replies?page=${page}&limit=${limit}`})
      const items = (res?.data?.items || []).map(normalizeGtavnComment).filter(Boolean)
      return {result: items}
    }
    const res = await getAPI({path: `${API_PREFIX}/replyList?parent_id=${parent_id}`})
    return res
  }

  voteList = async (movie_id) => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return {result: {like_ids: [], dislike_ids: []}}
    const res = await getAPI({path: `${API_PREFIX}/voteList?movie_id=${movie_id}`})
    return res
  }

  latestComments = async ({page = 1, limit = 20} = {}) => {
    if (isUsingOphimApi()) return {result: []}
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `${GTAVN_PREFIX}/latest?page=${page}&limit=${limit}`})
      const items = (res?.data?.items || []).map(normalizeGtavnComment).filter(Boolean)
      return {result: items}
    }
    const result = await getAPI({path: `${API_PREFIX}/latestComments`})
    return result
  }

  topComments = async (movieId, {limit = 10} = {}) => {
    if (isUsingOphimApi()) return {result: []}
    if (isUsingGtavnApi()) {
      // Gtavn has no global top comments; use /comments/latest as fallback
      const endpointPath = movieId
        ? `${GTAVN_PREFIX}/movie/${movieId}/top?limit=${limit}`
        : `${GTAVN_PREFIX}/latest?limit=${limit}`
      try {
        const res = await getAPI({path: endpointPath})
        const rawItems = res?.data?.items || []
        return {result: rawItems.map(normalizeGtavnComment).filter(Boolean)}
      } catch (e) {
        return {result: []}
      }
    }
    const result = await getAPI({path: `${API_PREFIX}/topComments`})
    return result
  }

  action = async ({id, action, info}) => {
    if (isUsingOphimApi()) return {status: false}
    if (isUsingGtavnApi()) {
      if (action === 'delete') return this.remove(id)
      if (action === 'update' && info?.content) return this.update({id, content: info.content})
      return {status: false}
    }
    const res = await postAPI({path: `${API_PREFIX}/action`, data: {id, action, info}})
    return res
  }
}


export default new CommentApi