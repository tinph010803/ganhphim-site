/**
 * Danh sách chủ đề tĩnh – thêm/sửa/xoá tại đây.
 * Mỗi chủ đề có:
 *   slug        – URL  /chu-de/<slug>
 *   name        – Tên hiển thị
 *   color       – Màu chủ đạo (dùng cho overlay & gradient tiêu đề)
 *   thumbnail   – Ảnh minh hoạ hiện bên phải thẻ card
 *   type        – 2 = lọc theo filter (MovieFilter), 1 = danh sách cố định
 *   filter      – áp vào MovieFilter khi type = 2
 *     .q           Từ khoá tìm kiếm
 *     .country_code   Mã quốc gia (vd: usa, han-quoc, trung-quoc)
 *     .genre_ids   ID thể loại (chuỗi, phân cách dấu phẩy)
 *     .type        phim-le | phim-bo
 *     .quality     HD | FHD | 4K
 */

const SITE_TOPICS = [
  {
    slug: 'hot-ran-ran',
    name: 'Hot Rần Rần',
    color: '#e5091a',
    thumbnail: 'https://img.upanhnhanh.com/09135e97e7ae94ff1d45780b7e22941f',
    filter: { sort_by: 'views', status: 'ongoing' },
  },
  {
    slug: 'dang-chieu-phat',
    name: 'Đang Chiếu Phát',
    color: '#b5420a',
    thumbnail: 'https://img.upanhnhanh.com/5ac700506a3109f17a7b61a7cccf1ee4',
    filter: { status: 'ongoing' },
  },
  {
    slug: 'phim-truyen-hinh-trung-quoc-dai-luc',
    name: 'Phim Trung Quốc',
    color: '#1a6b3a',
    thumbnail: 'https://img.upanhnhanh.com/817f1f6835167655bf1d6eb73e842a25',
    filter: { country_code: 'trung-quoc', type: 'phim-bo' },
  },
  {
    slug: 'hoat-hinh-chon-loc',
    name: 'Hoạt hình',
    color: '#1a3a6b',
    thumbnail: 'https://img.upanhnhanh.com/a710824cb68eb5bd5b14bee9696d931e',
    filter: { q: 'hoạt hình' },
  },
  {
    slug: 'phieu-luu-mao-hiem',
    name: 'Phiêu Lưu Mạo Hiểm',
    color: '#5c2a0a',
    thumbnail: 'https://img.upanhnhanh.com/f5f8ff6d550da4ee7f2f469b6b3d3e4c',
    filter: { q: 'phiêu lưu mạo hiểm' },
  },
  {
    slug: 'co-trang-huyen-ao',
    name: 'Cổ trang huyền ảo',
    color: '#2a4a1a',
    thumbnail: 'https://img.upanhnhanh.com/4c13333b13dbf51be35002a08b224074',
    filter: { q: 'cổ trang huyền ảo' },
  },
  {
    slug: 'phim-han-quoc',
    name: 'Phim Hàn Quốc',
    color: '#1a2a5c',
    thumbnail: 'https://img.upanhnhanh.com/94571cba98cfe7b5468d2d99e213bb97',
    filter: { country_code: 'han-quoc' },
  },
  {
    slug: 'thanh-xuan',
    name: 'Thanh xuân',
    color: '#0a2a4a',
    thumbnail: 'https://img.upanhnhanh.com/88ef66d9554f495fe0a08bd866bb5478',
    filter: { q: 'thanh xuân' },
  },
  {
    slug: 'chua-lanh-tam-hon',
    name: 'Phim "Chữa Lành"',
    color: '#5c1a1a',
    thumbnail: 'https://img.upanhnhanh.com/8c1e760e0826ba62a8f10f1c271ebbbb',
    filter: { q: 'chữa lành' },
  },
  {
    slug: 'chuyen-the-van-hoc',
    name: 'Chuyển Thể Văn Học',
    color: '#1a3a5c',
    thumbnail: 'https://img.upanhnhanh.com/9fedf0d5f28b369268d7819d8dc1d865',
    filter: { q: 'chuyển thể' },
  },
  {
    slug: 'phim-4k',
    name: 'Phim 4K',
    color: '#1a1a1a',
    thumbnail: 'https://img.upanhnhanh.com/15fa15c1a85b68866f059dab9b0dfde5',
    filter: { quality: '4K' },
  },
  {
    slug: 'phim-cong-so',
    name: 'Phim Công Sở',
    color: '#0a1a2a',
    thumbnail: 'https://img.upanhnhanh.com/6d8a2fc03f1fc1c612a0f1ea53c54304',
    filter: { q: 'công sở' },
  },
  {
    slug: 'hinh-su-toi-pham-han-quoc',
    name: 'Hình sự tội phạm Hàn Quốc',
    color: '#0a1a2a',
    thumbnail: 'https://img.upanhnhanh.com/1cde1f9801b281f6303b968f77d7d7c4',
    filter: { q: 'hình sự tội phạm', country_code: 'han-quoc' },
  },
  {
    slug: 'co-trang-huyen-huyen',
    name: 'Phim Cổ Trang Huyền Huyễn',
    color: '#1a2a1a',
    thumbnail: 'https://img.upanhnhanh.com/a49be080a43f68e0674dc703cdbcc694',
    filter: { q: 'cổ trang huyền huyễn' },
  },
  {
    slug: 'dien-anh-au-my',
    name: 'Điện ảnh Âu Mỹ',
    color: '#5c1a1a',
    thumbnail: 'https://img.upanhnhanh.com/d4590ecd4dfd717a3a91d9614e51d1c7',
    filter: { country_code: 'au-my', type: 'phim-le' },
  },
]

// Normalize: thêm _id, type mặc định
const TOPICS = SITE_TOPICS.map(t => ({
  _id: t.slug,
  type: 2,
  ...t,
}))

export default TOPICS
