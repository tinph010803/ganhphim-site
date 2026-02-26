import {getCwCollection, extractToken, getUserIdFromToken} from "@/lib/mongodb";

// POST /web-api/cw/remove
export async function POST(request) {
    try {
        const token = extractToken(request);
        const userId = getUserIdFromToken(token);
        if (!userId) return Response.json({success: false, error: "unauthorized"});

        const body = await request.json();
        const movieId = body.movieId || body.movie_id;
        if (!movieId) return Response.json({success: false, error: "missing movieId"});

        const col = await getCwCollection();
        await col.deleteOne({userId, movieId});

        return Response.json({success: true});
    } catch (e) {
        console.error("[cw/remove]", e);
        return Response.json({success: false, error: e.message});
    }
}
