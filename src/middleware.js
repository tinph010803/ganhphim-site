import {NextResponse} from 'next/server'

// Pages Cloudflare/CDN sẽ cache HTML tĩnh.
// s-maxage=60: CDN cache 60s, sau đó revalidate ngầm.
// stale-while-revalidate=31536000: Trong khi revalidate, vẫn serve bản cũ ngay lập tức
// → user không bao giờ phải đợi, luôn nhận HTML cached trong ~1ms từ edge.
const CACHE_HEADER = 'public, s-maxage=60, stale-while-revalidate=31536000'

const cachePaths = [
    '/phimhay', '/phim-bo', '/phim-le',
    '/c/', '/the-loai/', '/quoc-gia/',
    '/dien-vien/', '/dao-dien/', '/network/', '/nha-san-xuat/',
    '/phim/',   // movie detail pages
    '/xem-phim/', // watch pages
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
