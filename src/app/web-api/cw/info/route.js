import {getCwCollection, extractToken, getUserIdFromToken} from "@/lib/mongodb";

// GET /web-api/cw/info?movieId=xxx
export async function GET(request) {
    try {
        const token = extractToken(request);
        const userId = getUserIdFromToken(token);
        if (!userId) return Response.json({result: null});

        const movieId = new URL(request.url).searchParams.get("movieId");
        if (!movieId) return Response.json({result: null});

        const col = await getCwCollection();
        const doc = await col.findOne({userId, movieId});
        if (!doc) return Response.json({result: null});

        return Response.json({
            result: {
                movie_id: doc.movieId,
                season_number: doc.seasonNumber ?? 1,
                episode_number: doc.episodeNumber ?? 1,
                episode_name: doc.episodeName ?? null,
                server_label: doc.serverLabel ?? null,
                version: doc.version ?? 1,
                time: doc.time ?? 0,
                duration: doc.duration ?? 0,
            }
        });
    } catch (e) {
        console.error("[cw/info]", e);
        return Response.json({result: null});
    }
}
