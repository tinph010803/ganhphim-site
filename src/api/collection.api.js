import {getAPI, isUsingOphimApi} from "@/utils/axios";
import {normalizeOphimListItem} from "@/api/movie.api";

const API_PREFIX = '/collection'

// Static Gen-Z topics for OPhim mode
const OPHIM_TOPICS = [
  { _id: 'marvel-dc', slug: 'marvel-dc', name: 'Marvel & DC', keyword: 'marvel', color: '#c0392b' },
  { _id: 'anime-hay', slug: 'anime-hay', name: 'Anime Đỉnh Nóc', keyword: 'anime', color: '#8e44ad' },
  { _id: 'hai-buoc', slug: 'hai-buoc', name: 'Hài Bước Không Nổi', keyword: 'hài', color: '#f39c12' },
  { _id: 'kinh-di-chet-ngu', slug: 'kinh-di-chet-ngu', name: 'Kinh Dị Chết Ngủ', keyword: 'kinh dị', color: '#2c3e50' },
  { _id: 'tinh-cam-ngon-ngot', slug: 'tinh-cam-ngon-ngot', name: 'Tình Cảm Ngọt Xỉu', keyword: 'tình cảm', color: '#e91e8c' },
  { _id: 'hanh-dong-chay-no', slug: 'hanh-dong-chay-no', name: 'Hành Động Cháy Nổ', keyword: 'hành động', color: '#e74c3c' },
  { _id: 'xuyen-khong-bua', slug: 'xuyen-khong-bua', name: 'Xuyên Không Bựa Vãi', keyword: 'xuyên không', color: '#1abc9c' },
  { _id: 'co-trang-ngon', slug: 'co-trang-ngon', name: 'Cổ Trang Ngôn Tình', keyword: 'cổ trang', color: '#795548' },
  { _id: 'nao-nao-dau-dau', slug: 'nao-nao-dau-dau', name: 'Não Não Đau Đầu', keyword: 'tâm lý', color: '#9b59b6' },
  { _id: 'long-tieng-cuc-manh', slug: 'long-tieng-cuc-manh', name: 'Lồng Tiếng Cực Mạnh', keyword: 'lồng tiếng', color: '#27ae60' },
  { _id: 'sitcom-cuoi-vo-xu', slug: 'sitcom-cuoi-vo-xu', name: 'Sitcom Cười Vỡ Xu', keyword: 'sitcom', color: '#3498db' },
  { _id: 'chua-lanh-tui', slug: 'chua-lanh-tui', name: 'Chữa Lành Cho Tui', keyword: 'chữa lành', color: '#f06292' },
  { _id: 'toi-pham-hoc-duong', slug: 'toi-pham-hoc-duong', name: 'Tội Phạm Học Đường', keyword: 'tội phạm', color: '#1a1a2e' },
  { _id: 'kdrama-idol', slug: 'kdrama-idol', name: 'K-Drama Thần Tượng', keyword: 'hàn quốc idol', color: '#e84393' },
  { _id: 'tu-tien-thang-cap', slug: 'tu-tien-thang-cap', name: 'Tu Tiên Thăng Cấp', keyword: 'tu tiên', color: '#ff6b35' },
  { _id: 'trinh-tham-rung-ron', slug: 'trinh-tham-rung-ron', name: 'Trinh Thám Rùng Rợn', keyword: 'trinh thám', color: '#2d3561' },
  { _id: 'kiem-hiep-vo-lam', slug: 'kiem-hiep-vo-lam', name: 'Kiếm Hiệp Võ Lâm', keyword: 'kiếm hiệp', color: '#a04000' },
  { _id: 'phim-bua-genz', slug: 'phim-bua-genz', name: 'Phim Bựa GenZ', keyword: 'hài bựa', color: '#ff4757' },
  { _id: 'gia-dinh-roi-loan', slug: 'gia-dinh-roi-loan', name: 'Gia Đình Rối Loạn', keyword: 'gia đình', color: '#6c5ce7' },
  { _id: 'sieu-nhan-ba-chau', slug: 'sieu-nhan-ba-chau', name: 'Siêu Nhân Bá Châu', keyword: 'siêu nhân', color: '#00b894' },
  { _id: 'phim-my-bap', slug: 'phim-my-bap', name: 'Phim Mỹ Bắp', keyword: 'phim mỹ', color: '#fdcb6e' },
  { _id: 'zombie-chay-di', slug: 'zombie-chay-di', name: 'Zombie Chạy Đi!!!', keyword: 'zombie', color: '#55efc4' },
  { _id: 'romance-office', slug: 'romance-office', name: 'Tình Office Sến Mà Ghiền', keyword: 'văn phòng tình cảm', color: '#fd79a8' },
  { _id: 'phim-vietsub-hot', slug: 'phim-vietsub-hot', name: 'Vietsub Hot Nhất', keyword: 'vietsub', color: '#00cec9' },
]

// Virtual collections for OPhim home page (12 collections = 3 pages x 4)
const OPHIM_HOME_COLLECTIONS = [
  {_id: 'ophim-han-quoc',      name: 'Phim Hàn Quốc mới',   style: 1, group: true, color: '#f4a724', path: '/quoc-gia/han-quoc'},
  {_id: 'ophim-au-my',         name: 'Phim US-UK mới',       style: 1, group: true, color: '#e84393', path: '/quoc-gia/au-my'},
  {_id: 'ophim-trung-quoc',    name: 'Phim Trung Quốc mới',  style: 1, group: true, color: '#f4724a', path: '/quoc-gia/trung-quoc'},
]

class CollectionApi {
  _findTopic = (id) => OPHIM_TOPICS.find(t => t._id === id || t.slug === id) || null

  info = async (id) => {
    if (isUsingOphimApi()) {
      const topic = this._findTopic(id)
      if (!topic) return {result: null}
      return {
        result: {
          _id: topic._id,
          name: topic.name,
          slug: topic.slug,
          color: topic.color,
          type: 2,
          filter: { q: topic.keyword },
        }
      }
    }
    const result = await getAPI({path: `${API_PREFIX}/info/${id}`});
    return result;
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
          // For style-2 (big slide with description visible), fetch overview for first 10
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
    if (isUsingOphimApi()) return {result: {items: OPHIM_TOPICS.slice(0, 12), more: Math.max(0, OPHIM_TOPICS.length - 12)}}
    const result = await getAPI({path: `${API_PREFIX}/homepageTopics`});
    return result;
  }

  allTopics = async () => {
    if (isUsingOphimApi()) return {result: {items: OPHIM_TOPICS, more: 0}}
    try {
      const result = await getAPI({path: `${API_PREFIX}/allTopics`});
      return result;
    } catch (e) {
      return {result: {items: [], more: 0}}
    }
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