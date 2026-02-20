import {NextResponse} from 'next/server';
import axios from "axios";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants/token";
import {isProduction} from "@/utils/helpers";

function decodeStateBase64(input) {
    if (!input) return "/";
    try {
        return Buffer.from(input, "base64").toString("utf8") || "/";
    } catch {
        return "/";
    }
}

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const headers = request.headers;

    const url = new URL(request.url);
    const proto = headers.get('x-forwarded-proto') ?? 'http';
    const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? url.host;
    const origin = `${proto}://${host}`;

    const returnTo = decodeStateBase64(state);

    const res = NextResponse.redirect(new URL(returnTo, origin));

    if (!code) {
        return res;
    }

    try {
        const {data} = await axios.post(`${process.env.API_AUTH_PREFIX}/v1/auth/token`, {
            code,
            grant_type: "authorization_code",
            client_id: "rp"
        });

        if (data.status) {
            const tokens = data.result.tokens

            res.cookies.set(ACCESS_TOKEN_KEY, tokens.access.token, {
                httpOnly: false,
                sameSite: "strict",
                path: "/",
                secure: isProduction,
                maxAge: 3600 * 24
            });

            res.cookies.set(REFRESH_TOKEN_KEY, tokens.refresh.token, {
                httpOnly: false,
                sameSite: "strict",
                path: "/",
                secure: isProduction,
                maxAge: 3600 * 24 * 30
            });
        }
    } catch (error) {
        console.log(error)
    }

    return res
}