import {NextResponse} from 'next/server';

export async function GET(request) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const {protocol, host} = new URL(request.url)

  const baseUrl = `${protocol}//${forwardedHost || host}`

  const robotsTxt = `
User-agent: *
Disallow: /duyet-tim?q=*
Disallow: /tim-kiem?q=*
Disallow: /c/*
Disallow: /xem-chung/*
Allow: /*.js$
Allow: /*.css$
Sitemap: ${baseUrl}/sitemap.xml
  `;

  const responseHeaders = new Headers({
    'Content-Type': 'text/plain',
  });

  return new NextResponse(robotsTxt, {headers: responseHeaders});
}
