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
            {
                destination: '/c/:slug.:id',
                source: '/c/:slug/:id',
                permanent: true,
            },
            {
                destination: '/phim/:slug.:id',
                source: '/phim/:slug/:id',
                permanent: true,
            },
            {
                destination: '/xem-phim/:slug.:id',
                source: '/xem-phim/:slug/:id',
                permanent: true,
            },
            {
                destination: '/the-loai/:slug.:id',
                source: '/the-loai/:slug/:id',
                permanent: true,
            },
            {
                destination: '/quoc-gia/:slug.:id',
                source: '/quoc-gia/:slug/:id',
                permanent: true,
            },
            {
                destination: '/dien-vien/:slug.:id',
                source: '/dien-vien/:slug/:id',
                permanent: true,
            },
            {
                destination: '/dao-dien/:slug.:id',
                source: '/dao-dien/:slug/:id',
                permanent: true,
            },
            {
                destination: '/network/:slug.:id',
                source: '/network/:slug/:id',
                permanent: true,
            },
            {
                destination: '/nha-san-xuat/:slug.:id',
                source: '/nha-san-xuat/:slug/:id',
                permanent: true,
            },
            {
                destination: '/app-rophim',
                source: '/rophim-app',
                permanent: true,
            },
        ]
    },

    async rewrites() {
        return [
            {
                source: '/c/:slug.:id',
                destination: '/chu-de/:slug/:id',
            },
            {
                source: '/phim/:slug.:id',
                destination: '/phim/:slug/:id',
            },
            {
                source: '/xem-phim/:slug.:id',
                destination: '/xem-phim/:slug/:id',
            },
            {
                source: '/the-loai/:slug.:id',
                destination: '/the-loai/:slug/:id',
            },
            {
                source: '/quoc-gia/:slug.:id',
                destination: '/quoc-gia/:slug/:id',
            },
            {
                source: '/dien-vien/:slug.:id',
                destination: '/dien-vien/:slug/:id',
            },
            {
                source: '/dao-dien/:slug.:id',
                destination: '/dao-dien/:slug/:id',
            },
            {
                source: '/network/:slug.:id',
                destination: '/network/:slug/:id',
            },
            {
                source: '/nha-san-xuat/:slug.:id',
                destination: '/nha-san-xuat/:slug/:id',
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
