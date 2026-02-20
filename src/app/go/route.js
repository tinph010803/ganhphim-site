import {NextResponse} from "next/server";

const ALLOWLIST = new Set([
    "robong.tv"
]);

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const to = searchParams.get("to");
    if (!to) return NextResponse.json({error: "Missing 'to'"}, {status: 400});

    let dest;
    try {
        dest = new URL(to);
    } catch {
        return NextResponse.json({error: "Bad URL"}, {status: 400});
    }

    // Chỉ cho http/https
    if (!["http:", "https:"].includes(dest.protocol)) {
        return NextResponse.json({error: "Invalid protocol"}, {status: 400});
    }

    // Kiểm tra allowlist (có thể cho phép subdomain riêng của bạn)
    const hostOk =
        ALLOWLIST.has(dest.hostname)
    if (!hostOk) {
        return NextResponse.json({error: "Host not allowed"}, {status: 400});
    }

    // Redirect chuẩn
    return NextResponse.redirect(dest.toString(), {status: 302});
}
