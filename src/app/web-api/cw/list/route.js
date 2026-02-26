import {getCwCollection, extractToken, getUserIdFromToken} from "@/lib/mongodb";

// GET /web-api/cw/list?page=1&limit=20
export async function GET(request) {
    try {
        const token = extractToken(request);
        const userId = getUserIdFromToken(token);
        if (!userId) return Response.json({result: {items: [], page_count: 0}});

        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
        const skip = (page - 1) * limit;

        const col = await getCwCollection();
        const [total, docs] = await Promise.all([
            col.countDocuments({userId}),
            col.find({userId}).sort({updatedAt: -1}).skip(skip).limit(limit).toArray(),
        ]);

        const items = docs.map(doc => {
            const movieData = doc.movie || {};
            return {
                ...movieData,
                _id: movieData._id || doc.movieId,
                cw: {
                    version: doc.version ?? 1,
                    season_number: doc.seasonNumber ?? 1,
                    episode_number: doc.episodeNumber ?? 1,
                    episode_name: doc.episodeName ?? null,
                    server_label: doc.serverLabel ?? null,
                    time: doc.time ?? 0,
                    duration: doc.duration ?? 0,
                },
            };
        }).filter(item => item._id);

        return Response.json({
            result: {
                items,
                page_count: Math.ceil(total / limit) || 1,
            }
        });
    } catch (e) {
        console.error("[cw/list]", e);
        return Response.json({result: {items: [], page_count: 0}});
    }
}
