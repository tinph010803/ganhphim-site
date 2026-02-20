import {NextResponse} from "next/server";

export const runtime = 'edge';

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) return new NextResponse('Missing url', {status: 400})

    // Validate URL is well-formed and uses HTTP/HTTPS
    let parsed
    try {
        parsed = new URL(url)
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return new NextResponse('Invalid url', {status: 400})
        }
    } catch {
        return new NextResponse('Invalid url', {status: 400})
    }

    try {
        const upstream = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://ophim1.com/',
                'Origin': 'https://ophim1.com',
            },
            cache: 'no-store',
        })

        if (!upstream.ok) {
            return new NextResponse(`Upstream error: ${upstream.status}`, {status: upstream.status})
        }

        const contentType = upstream.headers.get('content-type') || 'application/vnd.apple.mpegurl'
        const isM3u8 = url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('x-mpegURL')

        if (isM3u8) {
            const text = await upstream.text()
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)

            const rewritten = text.replace(/^(?!#)([^\n\r]+)/gm, (match) => {
                const trimmed = match.trim()
                if (!trimmed) return match
                const absUrl = /^https?:\/\//i.test(trimmed) ? trimmed : baseUrl + trimmed
                return `/web-api/proxy-m3u8?url=${encodeURIComponent(absUrl)}`
            })

            return new NextResponse(rewritten, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                },
            })
        }

        // .ts segments — stream binary directly (no buffering)
        return new NextResponse(upstream.body, {
            status: upstream.status,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=86400',
            },
        })
    } catch (e) {
        return new NextResponse('Proxy error: ' + e.message, {status: 500})
    }
}
