import {NextResponse} from 'next/server';
import MovieApi from "@/api/movie.api";

export async function GET(request) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const {protocol, host} = new URL(request.url)

    const baseUrl = `${protocol}//${forwardedHost || host}`

    const urls = [
        {loc: `${baseUrl}/sitemap-page.xml`},
        {loc: `${baseUrl}/sitemap-genre.xml`},
        {loc: `${baseUrl}/sitemap-country.xml`},
        {loc: `${baseUrl}/sitemap-collection.xml`},
    ]

    const {page_count} = await MovieApi.filter({page: 1, limit: 1000})

    for (let i = 1; i <= page_count; i++) {
        urls.push({loc: `${baseUrl}/sitemap-movie-${i}.xml`})
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((item) => {
        return `
          <sitemap>
            <loc>${item.loc}</loc>
          </sitemap>
        `;
    }).join('')}
  </sitemapindex>`;

    // Trả về response với tiêu đề XML
    const responseHeaders = new Headers({
        'Content-Type': 'application/xml; charset=utf-8'
    });

    return new NextResponse(sitemap, {headers: responseHeaders});
}
