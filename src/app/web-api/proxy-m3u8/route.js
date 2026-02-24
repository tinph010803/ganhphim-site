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

    // Nếu URL rõ ràng không phải .m3u8 (ví dụ .ts, .aac, .mp4...), redirect thẳng về CDN
    // để browser dùng IP thật → tránh Vercel datacenter IP bị CDN block
    const looksLikeM3u8 = /\.m3u8(\?.*)?$/i.test(parsed.pathname) ||
        !parsed.pathname.includes('.')
    if (!looksLikeM3u8) {
        return NextResponse.redirect(url, {status: 302})
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
            const origin = parsed.origin // e.g. https://s2.phim1280.tv

            // Helper: resolve a segment line to an absolute URL
            function resolveSegUrl(seg) {
                if (/^https?:\/\//i.test(seg)) return seg
                if (seg.startsWith('/')) return origin + seg
                return baseUrl + seg
            }

            // Helper: get the first 2 meaningful path components as a "base path signature"
            function getBaseSig(absUrl) {
                try {
                    const parts = new URL(absUrl).pathname.split('/').filter(Boolean)
                    return parts.slice(0, 2).join('/')
                } catch {
                    return ''
                }
            }

            // --- Step 1: Split playlist into sections divided by #EXT-X-DISCONTINUITY ---
            const rawLines = text.split('\n')
            const sections = []
            let currentSection = []
            for (const line of rawLines) {
                if (line.trim() === '#EXT-X-DISCONTINUITY') {
                    sections.push(currentSection)
                    currentSection = []
                    // Do NOT carry the discontinuity tag into any kept section
                } else {
                    currentSection.push(line)
                }
            }
            sections.push(currentSection)

            // --- Step 2: Find the dominant (main content) base path signature ---
            const sigFreq = {}
            for (const section of sections) {
                for (const line of section) {
                    const trimmed = line.trim()
                    if (!trimmed || trimmed.startsWith('#')) continue
                    const sig = getBaseSig(resolveSegUrl(trimmed))
                    if (sig) sigFreq[sig] = (sigFreq[sig] || 0) + 1
                }
            }
            const sortedSigs = Object.entries(sigFreq).sort((a, b) => b[1] - a[1])
            const mainSig = sortedSigs[0]?.[0] ?? ''

            // --- Step 3: Keep only sections whose segments match the main signature ---
            // A section with NO segments at all (pure header/footer tags) is always kept.
            const AD_KEYWORDS = /\/(adjump|adinsert|adsegment|adv|\/ads\/|preroll|midroll|postroll|vast|ima)\//i
            const keptSections = sections.filter(sectionLines => {
                const segLines = sectionLines.filter(l => {
                    const t = l.trim()
                    return t && !t.startsWith('#')
                })
                if (segLines.length === 0) return true // no segments → keep (header tags, etc.)

                // Check keyword-based ad patterns first
                const hasAdKeyword = segLines.some(l => AD_KEYWORDS.test(l.trim()))
                if (hasAdKeyword) return false

                // Check if this section's base signature differs from main content
                const sectionSig = getBaseSig(resolveSegUrl(segLines[0].trim()))
                if (mainSig && sectionSig && sectionSig !== mainSig) return false

                return true
            })

            // --- Step 4: Also do line-by-line keyword sweep on the remaining sections ---
            const filteredLines = []
            for (const sectionLines of keptSections) {
                for (let i = 0; i < sectionLines.length; i++) {
                    const trimmed = sectionLines[i].trim()
                    if (!trimmed.startsWith('#') && trimmed && AD_KEYWORDS.test(trimmed)) {
                        if (filteredLines.length > 0 && filteredLines[filteredLines.length - 1].trim().startsWith('#EXTINF')) {
                            filteredLines.pop()
                        }
                        continue
                    }
                    filteredLines.push(sectionLines[i])
                }
            }
            const cleanText = filteredLines.join('\n')

            const rewritten = cleanText.replace(/^(?!#)([^\n\r]+)/gm, (match) => {
                const trimmed = match.trim()
                if (!trimmed) return match
                let absUrl
                if (/^https?:\/\//i.test(trimmed)) {
                    absUrl = trimmed
                } else if (trimmed.startsWith('/')) {
                    // Path tuyệt đối: resolve từ origin, không phải từ baseUrl
                    absUrl = origin + trimmed
                } else {
                    absUrl = baseUrl + trimmed
                }
                // Chỉ proxy các sub-playlist .m3u8 (để strip ads trong nested playlist).
                // Các .ts segment để browser tự fetch thẳng từ CDN bằng IP của mình,
                // tránh bị CDN block do IP datacenter của Vercel.
                if (/\.m3u8(\?.*)?$/i.test(absUrl)) {
                    return `/web-api/proxy-m3u8?url=${encodeURIComponent(absUrl)}`
                }
                return absUrl
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

        // .ts segments — redirect trực tiếp về CDN để tránh Vercel proxy binary
        // (browser dùng IP thật, CDN không block; tránh size limit của edge function)
        return NextResponse.redirect(url, {status: 302})
    } catch (e) {
        return new NextResponse('Proxy error: ' + e.message, {status: 500})
    }
}
