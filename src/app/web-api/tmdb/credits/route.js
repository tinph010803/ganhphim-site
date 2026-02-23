import TmdbApi from "@/api/tmdb.api";
import {NextResponse} from "next/server";

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const tmdbType = searchParams.get('tmdbType') || 'movie'

    if (!tmdbId || tmdbId === 'null' || tmdbId === 'undefined') {
        return NextResponse.json([], {status: 400})
    }

    const credits = await TmdbApi.credits(tmdbId, tmdbType)
    return NextResponse.json(credits)
}
