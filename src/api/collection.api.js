import {getAPI, isUsingOphimApi} from "@/utils/axios";
import {normalizeOphimListItem} from "@/api/movie.api";
import SITE_TOPICS from "@/constants/topics";

const API_PREFIX = '/collection'

// Virtual collections for OPhim home page (12 collections = 3 pages x 4)
const OPHIM_HOME_COLLECTIONS = [
  {_id: 'ophim-han-quoc',      name: 'Phim Hàn Quốc mới',   style: 1, group: true, color: '#f4a724', path: '/quoc-gia/han-quoc'},
  {_id: 'ophim-au-my',         name: 'Phim US-UK mới',       style: 1, group: true, color: '#e84393', path: '/quoc-gia/au-my'},
  {_id: 'ophim-trung-quoc',    name: 'Phim Trung Quốc mới',  style: 1, group: true, color: '#f4724a', path: '/quoc-gia/trung-quoc'},
]

class CollectionApi {
  // Tìm topic tĩnh theo slug/_id
  _findSiteTopic = (id) => SITE_TOPICS.find(t => t._id === id || t.slug === id) || null

  info = async (id) => {
    // Ưu tiên topic tĩnh (đây là topics bạn tự định nghĩa)
    const siteTopic = this._findSiteTopic(id)
    if (siteTopic) return {result: siteTopic}

    // Fallback → gọi API collection thật (nếu có)
    try {
      const result = await getAPI({path: `${API_PREFIX}/info/${id}`});
      return result;
    } catch {
      return {result: null}
    }
  }

  list = async ({page = 1, limit = 4}) => {
    if (isUsingOphimApi()) {
      const batch = OPHIM_HOME_COLLECTIONS.slice((page - 1) * limit, page * limit)
      if (batch.length === 0) return {result: {collections: [], totalPages: 0}}
      const totalPages = Math.ceil(OPHIM_HOME_COLLECTIONS.length / limit)

      const collections = await Promise.all(batch.map(async (col) => {
        try {
          const path = col.path.includes('?') ? `${col.path}&page=1` : `${col.path}?page=1`
          const res = await getAPI({path, version: ''})
          const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
          const rawItems = (res?.data?.items || []).slice(0, 24)
          let movies = rawItems.map(item => normalizeOphimListItem(item, cdn))
          if (col.style === 2) {
            const detailed = await Promise.all(rawItems.slice(0, 10).map(async (item, i) => {
              try {
                const det = await getAPI({path: `/phim/${item.slug}`, version: ''})
                const ov = (det?.data?.item?.content || '').replace(/<[^>]*>/g, '').slice(0, 200)
                return {...movies[i], overview: ov}
              } catch { return movies[i] }
            }))
            movies = [...detailed, ...movies.slice(10)]
          }
          return {_id: col._id, name: col.name, style: col.style, group: col.group || false, color: col.color, path: col.path, type: 1, slug: col._id, movies, random_data: false}
        } catch {
          return {_id: col._id, name: col.name, style: col.style, color: col.color, path: col.path, type: 1, slug: col._id, movies: [], random_data: false}
        }
      }))

      return {result: {collections, totalPages}}
    }
    const result = await getAPI({path: `${API_PREFIX}/list?page=${page}&limit=${limit}`});
    return result;
  }

  homepageTopics = async () => {
    const total = SITE_TOPICS.length
    return {result: {items: SITE_TOPICS.slice(0, 12), more: Math.max(0, total - 12)}}
  }

  allTopics = async () => {
    return {result: {items: SITE_TOPICS, more: 0}}
  }

  movies = async (id) => {
    if (isUsingOphimApi()) return {result: []}
    const result = await getAPI({path: `${API_PREFIX}/movies/${id}`});
    return result;
  }

  all = async () => {
    if (isUsingOphimApi()) return {result: []}
    const result = await getAPI({path: `${API_PREFIX}/all`});
    return result;
  }
}

export default new CollectionApi