import {getCwCollection, extractToken, getUserIdFromToken} from "@/lib/mongodb";

// POST /web-api/cw/save
export async function POST(request) {
    try {
        const token = extractToken(request);
        const userId = getUserIdFromToken(token);
        if (!userId) return Response.json({success: false, error: "unauthorized"});

        const body = await request.json();
        const movieId = body.movieId || body.movie_id;
        if (!movieId) return Response.json({success: false, error: "missing movieId"});

        const col = await getCwCollection();
        await col.updateOne(
            {userId, movieId},
            {
                $set: {
                    userId,
                    movieId,
                    movie: body.movie || null,
                    seasonNumber: body.season_number ?? body.seasonNumber ?? 1,
                    episodeNumber: body.episode_number ?? body.episodeNumber ?? 1,
                    episodeName: body.episode_name ?? body.episodeName ?? null,
                    serverLabel: body.server_label ?? body.serverLabel ?? null,
                    version: body.version ?? 1,
                    time: body.time ?? 0,
                    duration: body.duration ?? 0,
                    updatedAt: new Date(),
                }
            },
            {upsert: true}
        );

        return Response.json({success: true});
    } catch (e) {
        console.error("[cw/save]", e);
        return Response.json({success: false, error: e.message});
    }
}
