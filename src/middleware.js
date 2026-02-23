import {NextResponse} from 'next/server'

const cachePaths = ['/phimhay', '/phim/', '/xem-phim/', '/c/', '/the-loai/', '/quoc-gia/', '/dien-vien/', '/dao-dien/', '/network/', '/nha-san-xuat/', '/phim-bo', '/phim-le']

export function middleware(request) {
    // console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname

    if (cachePaths.some(path => pathname.startsWith(path))) {
        // console.log("add header cache:", pathname)
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=60, stale-while-revalidate=30'
        )
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
