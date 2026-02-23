import TmdbApi from "@/api/tmdb.api";
import {NextResponse} from "next/server";

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const title = searchParams.get('title')
    const year = searchParams.get('year') || null

    if (!title || title === 'null' || title === 'undefined') {
        return NextResponse.json(null, {status: 400})
    }

    const result = await TmdbApi.searchMovie(title, year)
    return NextResponse.json(result)
}
