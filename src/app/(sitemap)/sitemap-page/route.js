import {NextResponse} from 'next/server';

export async function GET(request) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const {protocol, host} = new URL(request.url)

    const baseUrl = `${protocol}//${forwardedHost || host}`

    const urls = [
        {loc: `${baseUrl}/`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/duyet-tim`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/dien-vien`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/phim-bo`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/phim-le`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/chu-de`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/xem-chung`, changefreq: `daily`, priority: 0.7},
        {loc: `${baseUrl}/hoi-dap`, changefreq: `monthly`, priority: 0.6},
        {loc: `${baseUrl}/chinh-sach-bao-mat`, changefreq: `monthly`, priority: 0.6},
        {loc: `${baseUrl}/dieu-khoan-su-dung`, changefreq: `monthly`, priority: 0.6},
        {loc: `${baseUrl}/gioi-thieu`, changefreq: `monthly`, priority: 0.6},
        {loc: `${baseUrl}/lien-he`, changefreq: `monthly`, priority: 0.6},
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((item) => {
        return `
          <url>
            <loc>${item.loc}</loc>
            <changefreq>${item.changefreq}</changefreq>
            <priority>${item.priority}</priority>
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
