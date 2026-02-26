import {NextResponse} from 'next/server'

// Pages Cloudflare/CDN sẽ cache HTML tĩnh.
// s-maxage=300: CDN cache "fresh" 5 phút
// stale-while-revalidate=86400: Sau 5 phút, vẫn serve bản cũ tức thì + revalidate ngầm
// → user LUÔN nhận HTML tức thì, nội dung cũ tối đa 5 phút
const CACHE_HEADER = 'public, s-maxage=300, stale-while-revalidate=86400'

const cachePaths = [
    '/phimhay', '/phim-bo', '/phim-le',
    '/c/', '/the-loai/', '/quoc-gia/',
    '/dien-vien/', '/dao-dien/', '/network/', '/nha-san-xuat/',
    '/chu-de/', '/lich-chieu',
    '/dongphim/', '/ghienphim/', '/motphim/', '/subnhanh/',
    '/phim/',      // movie detail pages
    '/xem-phim/',  // watch pages
]

export function middleware(request) {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname

    if (cachePaths.some(path => pathname.startsWith(path))) {
        response.headers.set('Cache-Control', CACHE_HEADER)
    }

    return response
}

export const config = {
    matcher: [
        // Chỉ áp dụng cho các page thực, bỏ qua static, API, _next, favicon, v.v.
        '/((?!_next|favicon.ico|api|static|assets|images|.*\\..*).*)',
        '/quoc-gia/:slug.:id',
        '/the-loai/:slug.:id',
        '/network/:slug.:id',
        '/dao-dien/:slug.:id',
        '/dien-vien/:slug.:id',
        '/nha-san-xuat/:slug.:id',
        '/phim/:slug.:id',
        '/c/:slug.:id',
    ],
}
