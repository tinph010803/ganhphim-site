import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {unstable_cache} from "next/cache";
import {cache} from "react";

const API_PREFIX = '/movie'

const OPHIM_CDN = 'https://img.ophim.live/uploads/movies'

const toAbsoluteImage = (cdn, fileName) => {
    if (!fileName) return ''
    if (/^https?:\/\//i.test(fileName)) return fileName
    const base = cdn || OPHIM_CDN
    return `${base}/${fileName}`
}

const parseEpisodeNumber = (episodeCurrent) => {
    if (!episodeCurrent) return null
    if (/full/i.test(episodeCurrent)) return 1
    const matched = episodeCurrent.toString().match(/\d+/)
    return matched ? parseInt(matched[0]) : null
}

const parseTotalEpisodes = (episodeTotal) => {
    if (!episodeTotal) return null
    const matched = episodeTotal.toString().match(/\d+/)
    return matched ? parseInt(matched[0]) : null
}

const mapOphimType = (type) => {
    return type === 'series' ? 2 : 1
}

export const normalizeOphimListItem = (item, cdn) => {
    const episodeNumber = parseEpisodeNumber(item.episode_current)
    const quality = (item.quality || '').toLowerCase()

    return {
        _id: item._id,
        public_id: item._id,
        slug: item.slug,
        title: item.name,
        english_title: item.origin_name || item.name,
        type: mapOphimType(item.type),
        status: item.status === 'completed' || /hoàn tất|full/i.test(item.episode_current || '') ? 'Ended' : item.status === 'ongoing' ? 'On Going' : item.status === 'trailer' ? 'Trailer' : item.status === 'upcoming' ? 'Upcoming' : 'Released',
        quality,
        overview: '',
        year: item.year,
        latest_episode: episodeNumber ? {'1': episodeNumber} : {'1': 1},
        genres: (item.category || []).map((genre) => ({
            _id: genre.id,
            name: genre.name,
            slug: genre.slug,
        })),
        countries: (item.country || []).map((country) => ({
            _id: country.id,
            name: country.name,
            slug: country.slug,
            code: country.slug,
        })),
        images: {
            posters: [{path: toAbsoluteImage(cdn, item.poster_url || item.thumb_url)}],
            backdrops: [{path: toAbsoluteImage(cdn, item.thumb_url || item.poster_url)}],
            titles: [],
        },
    }
}

// Map OPhim server_name / lang_key → internal version type id
const serverNameToVersionType = (serverName = '') => {
    const n = serverName.toLowerCase()
    if (n.includes('vietsub') || n.includes('phụ đề') || n.includes('vs')) return 1
    if (n.includes('lồng tiếng') || n.includes('lt')) return 2
    if (n.includes('thuyết minh') && n.includes('bắc')) return 3
    if (n.includes('thuyết minh') && n.includes('nam')) return 4
    if (n.includes('thuyết minh')) return 3
    return 1
}

const langKeyToVersionType = (key = '') => {
    if (key === 'vs') return 1
    if (key === 'lt') return 2
    return 1
}

const normalizeOphimDetail = (data) => {
    const movie = data?.item
    if (!movie) return null

    const cdn = `${data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
    const episodeNumber = parseEpisodeNumber(movie.episode_current)

    // Build latest_episode from lang_key so all versions are available
    const langKeys = movie.lang_key || []
    const latestEp = {}
    if (langKeys.length > 0) {
        langKeys.forEach(k => {
            const vType = langKeyToVersionType(k)
            latestEp[String(vType)] = episodeNumber || 1
        })
    } else {
        latestEp['1'] = episodeNumber || 1
    }
    return {
        _id: movie._id,
        public_id: movie._id,
        slug: movie.slug,
        title: movie.name,
        english_title: movie.origin_name || movie.name,
        overview: movie.content || '',
        type: mapOphimType(movie.type),
        status: movie.status === 'completed' ? 'Ended' : movie.status === 'ongoing' ? 'On Going' : movie.status === 'trailer' ? 'Trailer' : movie.status === 'upcoming' ? 'Upcoming' : 'Released',
        quality: (movie.quality || '').toLowerCase(),
        year: movie.year,
        imdb_rating: parseFloat(movie.imdb?.vote_average || movie.tmdb?.vote_average || 0) || 0,
        tmdb_id: movie.tmdb?.id || null,
        tmdb_type: movie.tmdb?.type || null,
        latest_episode: latestEp,
        total_episodes: parseTotalEpisodes(movie.episode_total),
        genres: (movie.category || []).map((genre) => ({
            _id: genre.id,
            name: genre.name,
            slug: genre.slug,
        })),
        countries: (movie.country || []).map((country) => ({
            _id: country.id,
            name: country.name,
            slug: country.slug,
            code: country.slug,
        })),
        images: {
            posters: [{path: toAbsoluteImage(cdn, movie.poster_url || movie.thumb_url)}],
            backdrops: [{path: toAbsoluteImage(cdn, movie.thumb_url || movie.poster_url)}],
            titles: [],
        },
        networks: [],
        production_companies: [],
        directors: (movie.director || []).filter(Boolean).map((name, i) => ({_id: `d_${i}`, name, slug: name})),
        casts: (movie.actor || []).filter(Boolean).map((name, i) => ({_id: `c_${i}`, name, slug: name})),
        runtime: null,
        episodes: movie.episodes || [],
        lang_key: movie.lang_key || [],
    }
}

const mapOphimPageCount = (pagination) => {
    const totalItems = Number(pagination?.totalItems || 0)
    const perPage = Number(pagination?.totalItemsPerPage || 24)
    if (perPage <= 0) return 0
    return Math.ceil(totalItems / perPage)
}

// ─── GTAVN helpers ──────────────────────────────────────────────────────────
const isGtavnObj = (val) => val && typeof val === 'object' && !Array.isArray(val)

const gtavnImg = (imgObj) => {
    if (!imgObj) return ''
    if (typeof imgObj === 'string') return imgObj
    if (isGtavnObj(imgObj)) {
        const vals = Object.values(imgObj)
        return vals[0] || ''
    }
    return ''
}

export const normalizeGtavnListItem = (item) => {
    const epCurrentRaw = isGtavnObj(item.episode_current)
        ? Object.values(item.episode_current)[0]
        : item.episode_current
    const episodeNumber = parseEpisodeNumber(epCurrentRaw)
    const quality = (item.quality || '').toLowerCase()
    const posterUrl = gtavnImg(item.poster)
    const thumbUrl = gtavnImg(item.thumb)
    return {
        _id: item._id,
        public_id: item._id,
        slug: item.slug,
        title: item.name,
        english_title: item.origin_name || item.name,
        type: mapOphimType(item.type),
        status: item.status === 'completed' || /hoàn tất|full/i.test(epCurrentRaw || '')
            ? 'Ended'
            : item.status === 'ongoing' ? 'On Going'
            : item.status === 'trailer' ? 'Trailer'
            : 'Released',
        quality,
        overview: (item.content || '').replace(/<[^>]*>/g, '').slice(0, 300),
        year: item.year,
        latest_episode: episodeNumber ? {'1': episodeNumber} : {'1': 1},
        genres: (item.categories || []).map((g) => ({_id: g.id, name: g.name, slug: g.slug})),
        countries: (item.countries || []).map((c) => ({_id: c.id, name: c.name, slug: c.slug, code: c.slug})),
        images: {
            posters: [{path: posterUrl || thumbUrl}],
            backdrops: [{path: thumbUrl || posterUrl}],
            titles: [],
        },
    }
}

const normalizeGtavnDetail = (data) => {
    const movie = data?.item
    if (!movie) return null
    const epCurrentRaw = isGtavnObj(movie.episode_current)
        ? Object.values(movie.episode_current)[0]
        : (movie.episode_current || null)
    const episodeNumber = parseEpisodeNumber(epCurrentRaw)
    const posterUrl = gtavnImg(movie.poster)
    const thumbUrl = gtavnImg(movie.thumb)
    return {
        _id: movie._id,
        public_id: movie._id,
        slug: movie.slug,
        title: movie.name,
        english_title: movie.origin_name || movie.name,
        overview: (movie.content || '').replace(/<[^>]*>/g, ''),
        type: mapOphimType(movie.type),
        status: movie.status === 'completed' ? 'Ended'
            : movie.status === 'ongoing' ? 'On Going'
            : movie.status === 'trailer' ? 'Trailer'
            : 'Released',
        quality: (movie.quality || '').toLowerCase(),
        year: movie.year,
        imdb_rating: parseFloat(movie.imdb?.vote_average || movie.tmdb?.vote_average || 0) || 0,
        tmdb_id: movie.tmdb?.id || null,
        tmdb_type: movie.tmdb?.type || null,
        latest_episode: {'1': episodeNumber || 1},
        total_episodes: parseTotalEpisodes(
            isGtavnObj(movie.episode_total)
                ? Object.values(movie.episode_total)[0]
                : movie.episode_total
        ),
        genres: (movie.categories || []).map((g) => ({_id: g.id, name: g.name, slug: g.slug})),
        countries: (movie.countries || []).map((c) => ({_id: c.id, name: c.name, slug: c.slug, code: c.slug})),
        images: {
            posters: [{path: posterUrl || thumbUrl}],
            backdrops: [{path: thumbUrl || posterUrl}],
            titles: [],
        },
        networks: [],
        production_companies: [],
        directors: (movie.director || []).filter(Boolean).map((name, i) => ({_id: `d_${i}`, name, slug: name})),
        casts: (movie.actor || []).filter(Boolean).map((name, i) => ({_id: `c_${i}`, name, slug: name})),
        runtime: null,
        gtavn_servers: isGtavnObj(movie.episodes) ? movie.episodes : null,
        episodes: Array.isArray(movie.episodes)
            ? movie.episodes
            : Object.entries(movie.episodes || {}).filter(([, v]) => v).flatMap(([, serverGroups]) =>
                Array.isArray(serverGroups) ? serverGroups : []
            ),
        lang_key: [],
    }
}

const mapGtavnPageCount = (pagination) => {
    if (!pagination) return 0
    if (pagination.totalPages) return Number(pagination.totalPages)
    const total = Number(pagination.totalItems || 0)
    const perPage = Number(pagination.totalItemsPerPage || pagination.itemsPerPage || 24)
    return perPage > 0 ? Math.ceil(total / perPage) : 0
}

// unstable_cache: persists the result across different requests (disk/memory cache)
// React.cache: deduplicates calls that share the same args WITHIN the same request
// (e.g. generateMetadata + page component both calling detail(slug) → only 1 HTTP call)
const _fetchMovieDetail = unstable_cache(async (id) => {
    const t0 = Date.now()
    let result
    if (isUsingOphimApi()) {
        try {
            const res = await getAPI({path: `/phim/${id}`, version: ''})
            result = normalizeOphimDetail(res?.data)
        } catch (e) {
            result = null
        }
    } else if (isUsingGtavnApi()) {
        try {
            const res = await getAPI({path: `/phim/${id}`})
            result = normalizeGtavnDetail(res?.data)
        } catch (e) {
            console.error(`[MovieApi.detail] gtavn API error for slug "${id}":`, e?.message, e?.code, e?.response?.status)
            result = null
        }
    } else {
        const {result: r} = await getAPI({path: `${API_PREFIX}/detail/${id}`});
        result = r;
    }
    console.log(`[MovieApi.detail] "${id}" → ${Date.now() - t0}ms`)
    return result
}, ['movie-detail-v3'], {revalidate: 300})

const _cachedMovieDetail = cache(_fetchMovieDetail)

class MovieApi {
    detail = _cachedMovieDetail

    hot = async () => {
        if (isUsingOphimApi()) {
            const res = await getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=1', version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            const rawItems = (res?.data?.items || []).slice(0, 10)
            // Fetch detail for each to get overview (description)
            return await Promise.all(rawItems.map(async (item) => {
                const base = normalizeOphimListItem(item, cdn)
                try {
                    const det = await getAPI({path: `/phim/${item.slug}`, version: ''})
                    const ov = (det?.data?.item?.content || '').replace(/<[^>]*>/g, '').slice(0, 300)
                    return {...base, overview: ov}
                } catch { return base }
            }))
        }
        if (isUsingGtavnApi()) {
            const res = await getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=1'})
            return (res?.data?.items || []).slice(0, 10).map(normalizeGtavnListItem)
        }
        const {result} = await getAPI({path: `${API_PREFIX}/hot`});
        return result;
    }

    cinema = async () => {
        if (isUsingOphimApi()) {
            const res = await getAPI({path: '/danh-sach/phim-chieu-rap?page=1', version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            return (res?.data?.items || []).map((item) => normalizeOphimListItem(item, cdn))
        }
        if (isUsingGtavnApi()) {
            const res = await getAPI({path: '/danh-sach/phim-chieu-rap?page=1'})
            return (res?.data?.items || []).map(normalizeGtavnListItem)
        }
        const {result} = await getAPI({path: `${API_PREFIX}/filter?type=1&status=released&limit=20`});
        return result?.items || []
    }

    bySlug = async (slug, page = 1) => {
        if (isUsingOphimApi()) {
            const res = await getAPI({path: `/danh-sach/${slug}?page=${page}`, version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            const rawItems = (res?.data?.items || [])
            return await Promise.all(rawItems.map(async (item) => {
                const base = normalizeOphimListItem(item, cdn)
                try {
                    const det = await getAPI({path: `/phim/${item.slug}`, version: ''})
                    const ov = (det?.data?.item?.content || '').replace(/<[^>]*>/g, '').slice(0, 300)
                    return {...base, overview: ov}
                } catch { return base }
            }))
        }
        if (isUsingGtavnApi()) {
            const res = await getAPI({path: `/danh-sach/${slug}?page=${page}`})
            return (res?.data?.items || []).map(normalizeGtavnListItem)
        }
        const {result} = await getAPI({path: `${API_PREFIX}/filter?limit=20&page=${page}`});
        return result?.items || []
    }

    casts = async (id) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return []
        const {result} = await getAPI({path: `${API_PREFIX}/casts/${id}`});
        return result;
    }

    gallery = async (id) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return {videos: [], images: []}
        const {result} = await getAPI({path: `${API_PREFIX}/gallery/${id}`});
        return result;
    }

    ost = async (id) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return []
        const {result} = await getAPI({path: `${API_PREFIX}/ost/${id}`});
        return result;
    }

    filter = async (filter) => {
        if (isUsingOphimApi()) {
            const page = Number(filter?.page || 1)
            const query = filter?.q || filter?.keyword || ''
            const actor = filter?.actor || ''
            const toArr = (v) => Array.isArray(v) ? v : (v ? [v] : [])
            const countries = toArr(filter?.countries)
            const genres = toArr(filter?.genres)

            let path = `/danh-sach/phim-moi-cap-nhat?page=${page}`

            if (query) {
                path = `/tim-kiem?keyword=${encodeURIComponent(query)}&limit=24&page=${page}`
            } else if (actor) {
                path = `/tim-kiem?keyword=${encodeURIComponent(actor)}&limit=24&page=${page}`
            } else if (countries.length > 0) {
                path = `/quoc-gia/${countries[0]}?page=${page}`
            } else if (genres.length > 0) {
                path = `/the-loai/${genres[0]}?page=${page}`
            } else if (filter?.status === 'completed') {
                path = `/danh-sach/phim-hoan-thanh?page=${page}`
            } else if (filter?.type === '1') {
                path = `/danh-sach/phim-le?page=${page}`
            } else if (filter?.type === '2') {
                path = `/danh-sach/phim-bo?page=${page}`
            }

            const res = await getAPI({path, version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            const items = (res?.data?.items || []).map((item) => normalizeOphimListItem(item, cdn))

            return {
                items,
                page_count: mapOphimPageCount(res?.data?.params?.pagination || res?.data?.pagination),
            }
        }
        if (isUsingGtavnApi()) {
            const page = Number(filter?.page || 1)
            const query = filter?.q || filter?.keyword || ''
            const actor = filter?.actor || ''
            const toArr = (v) => Array.isArray(v) ? v : (v ? [v] : [])
            const countries = toArr(filter?.countries)
            const genres = toArr(filter?.genres)

            let path = `/danh-sach/phim-moi-cap-nhat?page=${page}`

            if (query) {
                path = `/tim-kiem?keyword=${encodeURIComponent(query)}&limit=24&page=${page}`
            } else if (actor) {
                path = `/tim-kiem?keyword=${encodeURIComponent(actor)}&limit=24&page=${page}`
            } else if (countries.length > 0) {
                path = `/quoc-gia/${countries[0]}?page=${page}`
            } else if (genres.length > 0) {
                path = `/the-loai/${genres[0]}?page=${page}`
            } else if (filter?.status === 'completed') {
                path = `/danh-sach/phim-bo?page=${page}`
            } else if (filter?.type === '1') {
                path = `/danh-sach/phim-le?page=${page}`
            } else if (filter?.type === '2') {
                path = `/danh-sach/phim-bo?page=${page}`
            }

            const res = await getAPI({path})
            const items = (res?.data?.items || []).map(normalizeGtavnListItem)

            return {
                items,
                page_count: mapGtavnPageCount(res?.data?.params?.pagination || res?.data?.pagination),
            }
        }

        const sortByYear = filter.sort === 'year'
        const apiFilter = sortByYear ? {...filter, sort: 'release_date'} : filter
        const queryString = Object.keys(apiFilter).map(key => key + '=' + apiFilter[key]).join('&')
        const {result} = await getAPI({path: `${API_PREFIX}/filterV2?${queryString}`});
        if (sortByYear && result?.items) {
            result.items = [...result.items].sort((a, b) => (b.year || 0) - (a.year || 0))
        }
        return result;
    }

    seasons = async (mId) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) {
            try {
                const res = isUsingGtavnApi()
                    ? await getAPI({path: `/phim/${mId}`})
                    : await getAPI({path: `/phim/${mId}`, version: ''})
                const movie = res?.data?.item
                if (!movie) return []

                let episodesArr = []
                if (Array.isArray(movie.episodes)) {
                    episodesArr = movie.episodes
                } else if (movie.episodes && typeof movie.episodes === 'object') {
                    episodesArr = Object.entries(movie.episodes)
                        .filter(([, v]) => v)
                        .map(([key, data]) => ({
                            server_name: key,
                            server_data: Array.isArray(data) ? data : [],
                        }))
                }
                if (episodesArr.length === 0) return []

                // Group by episode_number, collect all server versions
                const epMap = new Map()
                episodesArr.forEach((server) => {
                    const vType = serverNameToVersionType(server.server_name)
                    ;(server.server_data || []).forEach((ep) => {
                        const epNum = parseFloat(ep.name) || 1
                        const key = epNum
                        if (!epMap.has(key)) {
                            epMap.set(key, {
                                _id: `${mId}_${epNum}`,
                                episode_number: epNum,
                                season_number: 1,
                                name: ep.name,
                                image_path: null,
                                versions: [],
                            })
                        }
                        epMap.get(key).versions.push({
                            type: vType,
                            link: ep.link_embed || ep.link_m3u8,
                            m3u8: ep.link_m3u8 || '',
                        })
                    })
                })

                const uniqueEpisodes = Array.from(epMap.values())
                    .sort((a, b) => a.episode_number - b.episode_number)

                return [
                    {
                        _id: `${mId}_s1`,
                        season_number: 1,
                        episodes: uniqueEpisodes,
                    },
                ]
            } catch (e) {
                return []
            }
        }

        const {result} = await getAPI({path: `${API_PREFIX}/seasons?mId=${mId}`});
        return result;
    }

    episodes = async ({sId, type}) => {
        if (isUsingGtavnApi()) return null
        const {result} = await getAPI({path: `${API_PREFIX}/season/episodes?sId=${sId}&type=${type}`});
        return result;
    }

    logView = async (id) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return null
        const result = await postAPI({path: `${API_PREFIX}/logView/${id}`});
        return result;
    }

    suggestion = async (id) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return []
        const {result} = await getAPI({path: `${API_PREFIX}/suggestion/${id}`});
        return result;
    }

    topViews = async (range = "today") => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return []
        const {result} = await getAPI({path: `${API_PREFIX}/topViews?range=${range}`});
        return result;
    }

    mostCommentedRanking = async () => {
        if (isUsingOphimApi()) {
            const res = await getAPI({path: '/danh-sach/phim-bo?page=1', version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || OPHIM_CDN}/uploads/movies`
            return (res?.data?.items || []).slice(0, 10).map((item, i) => ({
                ...normalizeOphimListItem(item, cdn),
                current_rank: i + 1,
                direction: 'same',
            }))
        }
        if (isUsingGtavnApi()) {
            const res = await getAPI({path: '/danh-sach/phim-bo?page=1'})
            return (res?.data?.items || []).slice(0, 10).map((item, i) => ({
                ...normalizeGtavnListItem(item),
                current_rank: i + 1,
                direction: 'same',
            }))
        }
        const {result} = await getAPI({path: `${API_PREFIX}/mostCommentedRanking`});
        return result;
    }

    mostFavoriteRanking = async () => {
        if (isUsingOphimApi()) {
            const res = await getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=1', version: ''})
            const cdn = `${res?.data?.APP_DOMAIN_CDN_IMAGE || OPHIM_CDN}/uploads/movies`
            return (res?.data?.items || []).slice(0, 10).map((item, i) => ({
                ...normalizeOphimListItem(item, cdn),
                current_rank: i + 1,
                direction: 'same',
            }))
        }
        if (isUsingGtavnApi()) {
            const res = await getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=1'})
            return (res?.data?.items || []).slice(0, 10).map((item, i) => ({
                ...normalizeGtavnListItem(item),
                current_rank: i + 1,
                direction: 'same',
            }))
        }
        const {result} = await getAPI({path: `${API_PREFIX}/mostFavoriteRanking`});
        return result;
    }

    scheduledEpisodes = async (date) => {
        if (isUsingOphimApi() || isUsingGtavnApi()) return []
        const {result} = await getAPI({path: `${API_PREFIX}/scheduledEpisodes?date=${date}`});
        return result;
    }

    showtimesByDate = async (date) => {
        // date must be YYYY-MM-DD format
        try {
            const res = await fetch(`https://rophimm.net/baseapi/api/v1/showtimes/by-date/${date}`)
            if (!res.ok) return []
            const data = await res.json()
            return Array.isArray(data) ? data : []
        } catch (e) {
            return []
        }
    }

    showtimesByMovie = async (movieId) => {
        try {
            const res = await fetch(`https://rophimm.net/baseapi/api/v1/showtimes/by-movie/${movieId}`)
            if (!res.ok) return []
            const data = await res.json()
            return Array.isArray(data) ? data : []
        } catch (e) {
            return []
        }
    }

    showtimesBySlug = async (slug) => {
        try {
            const today = new Date()
            const BATCH_SIZE = 14
            const MAX_BATCHES = 3 // tối đa 42 ngày tương lai

            let movieId = null

            for (let batch = 0; batch < MAX_BATCHES; batch++) {
                const startOffset = batch * BATCH_SIZE
                const dates = Array.from({length: BATCH_SIZE}, (_, i) => {
                    const d = new Date(today)
                    d.setDate(d.getDate() + startOffset + i)
                    return d.toISOString().slice(0, 10)
                })

                const results = await Promise.all(dates.map(async (date) => {
                    try {
                        const res = await fetch(`https://rophimm.net/baseapi/api/v1/showtimes/by-date/${date}`)
                        if (!res.ok) return []
                        return await res.json()
                    } catch { return [] }
                }))

                for (const dayResults of results) {
                    if (!Array.isArray(dayResults)) continue
                    const found = dayResults.find(item => item.movie?.slug === slug)
                    if (found) {
                        movieId = found.movie_id ?? found.movie?.id
                        break
                    }
                }

                if (movieId) break
            }

            if (!movieId) return []
            return await this.showtimesByMovie(movieId)
        } catch (e) {
            return []
        }
    }

    seoData = async () => {
        if (isUsingOphimApi()) {
            const [latestRes, hotRes] = await Promise.all([
                getAPI({path: `/danh-sach/phim-moi-cap-nhat?page=1`, version: ''}),
                getAPI({path: `/danh-sach/phim-moi-cap-nhat?page=2`, version: ''}),
            ])
            const cdn1 = `${latestRes?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            const cdn2 = `${hotRes?.data?.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live'}/uploads/movies`
            const latestMovies = (latestRes?.data?.items || []).slice(0, 12).map(i => normalizeOphimListItem(i, cdn1))
            const hotMovies = (hotRes?.data?.items || []).slice(0, 12).map(i => normalizeOphimListItem(i, cdn2))
            return {latestMovies, hotMovies, randomMovies: []}
        }
        if (isUsingGtavnApi()) {
            const [latestRes, hotRes] = await Promise.all([
                getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=1'}),
                getAPI({path: '/danh-sach/phim-moi-cap-nhat?page=2'}),
            ])
            const latestMovies = (latestRes?.data?.items || []).slice(0, 12).map(normalizeGtavnListItem)
            const hotMovies = (hotRes?.data?.items || []).slice(0, 12).map(normalizeGtavnListItem)
            return {latestMovies, hotMovies, randomMovies: []}
        }
        const {result} = await getAPI({path: `${API_PREFIX}/seoData`});
        return result;
    }
}

export default new MovieApi