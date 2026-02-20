const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDRmMGRjZTdiODhiMjZkZDRhY2ZkOTQ3NTJiMWNlYyIsIm5iZiI6MTczOTYzNDQzNi44MzM5OTk5LCJzdWIiOiI2N2IwYjcwNGM0NjUxMDNlMDQzNWI2ZGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DmTZgs6ZJZINN6vDqOHiMGfWPaKXGGcQGy863in5sKI'
export const TMDB_IMG = 'https://image.tmdb.org/t/p'

const tmdbFetch = async (path, lang = 'vi-VN', extraParams = '') => {
    try {
        const res = await fetch(`${TMDB_BASE}${path}?language=${lang}${extraParams}`, {
            headers: {Authorization: `Bearer ${TMDB_TOKEN}`},
            next: {revalidate: 3600},
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

class TmdbApi {
    // Popular persons list (paginated)
    popularPersons = async (page = 1) => {
        const data = await tmdbFetch('/person/popular', 'vi-VN', `&page=${page}`)
        if (!data) return {items: [], page_count: 0}
        const items = (data.results || []).map(p => ({
            _id: String(p.id),
            tmdb_id: p.id,
            name: p.name,
            profile_path: p.profile_path || null,  // raw TMDB relative path e.g. /abc.jpg
        }))
        return {items, page_count: data.total_pages || 1}
    }

    // Search persons by keyword
    searchPersons = async (query, page = 1) => {
        const data = await tmdbFetch('/search/person', 'vi-VN', `&query=${encodeURIComponent(query)}&page=${page}`)
        if (!data) return {items: [], page_count: 0}
        const items = (data.results || []).map(p => ({
            _id: String(p.id),
            tmdb_id: p.id,
            name: p.name,
            profile_path: p.profile_path || null,  // raw TMDB relative path e.g. /abc.jpg
        }))
        return {items, page_count: data.total_pages || 1}
    }

    // Fetch cast list for a movie/tv
    credits = async (tmdbId, tmdbType) => {
        const type = tmdbType === 'tv' ? 'tv' : 'movie'
        const data = await tmdbFetch(`/${type}/${tmdbId}/credits`)
        if (!data) return []
        return (data.cast || []).slice(0, 20).map(p => ({
            _id: String(p.id),
            tmdb_id: p.id,
            cast: {
                _id: String(p.id),
                name: p.name,
                slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                profile_path: p.profile_path || null,  // raw TMDB relative path
                character: p.character || '',
            }
        }))
    }

    // Person detail
    person = async (personId) => {
        return await tmdbFetch(`/person/${personId}`)
    }

    // Movies/TV the person was in
    personCredits = async (personId) => {
        const data = await tmdbFetch(`/person/${personId}/combined_credits`)
        if (!data) return []
        const list = [...(data.cast || [])]
        // Sort by popularity, deduplicate
        const seen = new Set()
        return list
            .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return m.poster_path })
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 30)
    }
}

export default new TmdbApi
