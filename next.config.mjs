/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    experimental: {},
    images: {
        domains: ['static.nutscdn.com', 'image.tmdb.org', 'media.tenor.com', 'img.ophim.live', 'ophim1.com']
    },
    env: {
        API_PREFIX: process.env.API_PREFIX,
        API_SERVER_PREFIX: process.env.API_SERVER_PREFIX,
        INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
        APP_ENV: process.env.APP_ENV,
        TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
        W2G_SOCKET_URL: process.env.W2G_SOCKET_URL,
        SOCKET_URL: process.env.SOCKET_URL,
        API_AUTH_PREFIX: process.env.API_AUTH_PREFIX,
        IDP_URL: process.env.IDP_URL,
        RB_BASE_URL: process.env.RB_BASE_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },

    async headers() {
        return [
            {
                source: "/images/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'none';"
                    }
                ]
            }
        ];
    },

    async redirects() {
        return [
            // Old slug/id (slash format) → clean slug
            { source: '/c/:slug/:id', destination: '/c/:slug', permanent: true },
            { source: '/phim/:slug/:id', destination: '/phim/:slug', permanent: true },
            { source: '/xem-phim/:slug/:id', destination: '/xem-phim/:slug', permanent: true },
            { source: '/the-loai/:slug/:id', destination: '/the-loai/:slug', permanent: true },
            { source: '/quoc-gia/:slug/:id', destination: '/quoc-gia/:slug', permanent: true },

            { source: '/dao-dien/:slug/:id', destination: '/dao-dien/:slug', permanent: true },
            { source: '/network/:slug/:id', destination: '/network/:slug', permanent: true },
            { source: '/nha-san-xuat/:slug/:id', destination: '/nha-san-xuat/:slug', permanent: true },
            // Old slug.id (dot format) → clean slug
            { source: '/c/:slug.:id', destination: '/c/:slug', permanent: true },
            { source: '/phim/:slug.:id', destination: '/phim/:slug', permanent: true },
            { source: '/xem-phim/:slug.:id', destination: '/xem-phim/:slug', permanent: true },
            { source: '/the-loai/:slug.:id', destination: '/the-loai/:slug', permanent: true },
            { source: '/quoc-gia/:slug.:id', destination: '/quoc-gia/:slug', permanent: true },

            { source: '/dao-dien/:slug.:id', destination: '/dao-dien/:slug', permanent: true },
            { source: '/network/:slug.:id', destination: '/network/:slug', permanent: true },
            { source: '/nha-san-xuat/:slug.:id', destination: '/nha-san-xuat/:slug', permanent: true },
            { source: '/rophim-app', destination: '/app-rophim', permanent: true },
        ]
    },

    async rewrites() {
        return [
            {
                source: '/c/:slug',
                destination: '/chu-de/:slug',
            },
            {
                source: '/sitemap.xml',
                destination: '/sitemap',
            },
            {
                source: '/sitemap-page.xml',
                destination: '/sitemap-page',
            },
            {
                source: '/sitemap-genre.xml',
                destination: '/sitemap-genre',
            },
            {
                source: '/sitemap-country.xml',
                destination: '/sitemap-country',
            },
            {
                source: '/sitemap-collection.xml',
                destination: '/sitemap-collection',
            },
            {
                source: '/sitemap-movie-:page.xml',
                destination: '/sitemap-movie/:page',
            },
            {
                source: '/robots.txt',
                destination: '/robots',
            },
        ]
    },
};

export default nextConfig;
