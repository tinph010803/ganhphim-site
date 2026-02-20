import {NextResponse} from 'next/server';
import GenreApi from "@/api/genre.api";
import {genreUrl} from "@/utils/url";

export async function GET(request) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const {protocol, host} = new URL(request.url)

    const baseUrl = `${protocol}//${forwardedHost || host}`

    const {result} = await GenreApi.list()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${result.map((item) => {
        return `
          <url>
            <loc>${baseUrl}${genreUrl(item)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>
        `;
    }).join('')}
  </urlset>`;

    // Trả về response với tiêu đề XML
    const responseHeaders = new Headers({
        'Content-Type': 'application/xml; charset=utf-8'
    });

    return new NextResponse(sitemap, {headers: responseHeaders});
}
