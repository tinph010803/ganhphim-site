import Cookies from "js-cookie";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants/token";
import {tokenEmitter} from "@/utils/tokenEvents";

const isLocalStorageAvailable = () => {
    try {
        const testKey = "__test__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

const setAuthTokens = (tokens) => {
    const accessToken = tokens.access.token;
    const refreshToken = tokens.refresh.token;

    if (isLocalStorageAvailable()) {
        // Ưu tiên lưu vào localStorage
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        // Fallback về cookies nếu localStorage không khả dụng
        Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            path: "/",
            expires: 7,
            secure: true,
            sameSite: "strict"
        });
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
            path: "/",
            expires: 365,
            secure: true,
            sameSite: "strict"
        });
    }

    tokenEmitter.emit('tokensChanged', {accessToken})
}

const removeAuthTokens = () => {
    // Xóa từ localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    // Xóa từ cookies
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    tokenEmitter.emit('tokensChanged', {accessToken: null})
};

const getAuthTokens = () => {
    let accessToken = null
    let refreshToken = null

    if (isLocalStorageAvailable()) {
        // Ưu tiên lấy từ localStorage
        accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    }

    // Nếu không có trong localStorage, lấy từ cookies
    if (!accessToken) {
        accessToken = Cookies.get(ACCESS_TOKEN_KEY)
    }
    if (!refreshToken) {
        refreshToken = Cookies.get(REFRESH_TOKEN_KEY)
    }

    return {
        accessToken,
        refreshToken
    }
}

export {
    setAuthTokens,
    removeAuthTokens,
    getAuthTokens
}