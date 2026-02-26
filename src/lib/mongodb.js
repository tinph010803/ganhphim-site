import {MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ganhphim";

let client;
let clientPromise;

if (!uri) {
    throw new Error("MONGODB_URI not set in environment variables");
}

const mongoOptions = {
    tls: true,
    tlsInsecure: true,
};

if (process.env.NODE_ENV === "development") {
    // In development, reuse the connection across hot-reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, mongoOptions);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, mongoOptions);
    clientPromise = client.connect();
}

export async function getDb() {
    const c = await clientPromise;
    return c.db(dbName);
}

// Get the cw_history collection and ensure indexes
export async function getCwCollection() {
    const db = await getDb();
    const col = db.collection("cw_history");
    // Unique compound index — upsert will use this
    await col.createIndex({userId: 1, movieId: 1}, {unique: true});
    return col;
}

// Decode JWT payload to extract userId (no signature verification needed)
export function getUserIdFromToken(token) {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
        return payload.id || payload._id || payload.sub || payload.userId || null;
    } catch {
        return null;
    }
}

// Extract Bearer token from request Authorization header
export function extractToken(request) {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();
    return token || null;
}
