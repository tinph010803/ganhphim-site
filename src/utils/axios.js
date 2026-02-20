import axios from "axios";
import AuthApi from "@/api/auth.api";
import {getAuthTokens} from "@/utils/auth";

const REFRESH_STATUS = 403;
const DEFAULT_HEADERS = {"Content-Type": "application/json"};

const getBaseURL = () => {
    const isServer = typeof window === "undefined";
    return isServer ? process.env.API_SERVER_PREFIX : process.env.API_PREFIX;
};

const isUsingOphimApi = () => {
    const base = getBaseURL() || "";
    return /ophim1\.com/i.test(base);
};

let isRefreshing = false;
let refreshQueue = [];

const flushRefreshQueue = (error) => {
    refreshQueue.forEach(({resolve, reject}) => (error ? reject(error) : resolve()));
    refreshQueue = [];
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    headers: {...DEFAULT_HEADERS},
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.baseURL = getBaseURL();

        const {accessToken} = getAuthTokens() || {};
        if (accessToken) {
            config.headers = {
                ...(config.headers || {}),
                Authorization: `Bearer ${accessToken}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const {config, response} = error || {};
        const status = response?.status;
        const original = config;

        if (!response) return Promise.reject(error);

        if(original.url.includes("/auth/refreshTokens")) return Promise.reject(error)

        if (status === REFRESH_STATUS && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({resolve, reject});
                }).then(() => axiosInstance(original));
            }

            isRefreshing = true;
            try {
                const ok = await AuthApi.refreshTokens();
                if (!ok) throw new Error("Refresh tokens failed");

                flushRefreshQueue(null);
                return axiosInstance(original);
            } catch (e) {
                flushRefreshQueue(e);
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

const buildPath = (path, version = "v1") => {
    if (version === "") {
        return path.startsWith("/") ? path : `/${path}`;
    }

    const v = version.startsWith("/") ? version.slice(1) : version;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `/${v}${p}`;
};

const getAPI = async ({path, version = "v1", config = {}}) => {
    const url = buildPath(path, version);
    const res = await axiosInstance.get(url, config);
    return res.data;
};

const postAPI = async ({path, data, version = "v1", config = {}}) => {
    const url = buildPath(path, version);
    const res = await axiosInstance.post(url, data, {
        headers: {...(config.headers || {})},
        ...config,
    });
    return res.data;
};

const putAPI = async ({path, data, version = "v1", config = {}}) => {
    const url = buildPath(path, version);
    const res = await axiosInstance.put(url, data, {
        headers: {...(config.headers || {})},
        ...config,
    });
    return res.data;
};

const patchAPI = async ({path, data, version = "v1", config = {}}) => {
    const url = buildPath(path, version);
    const res = await axiosInstance.patch(url, data, {
        headers: {...(config.headers || {})},
        ...config,
    });
    return res.data;
};

const deleteAPI = async ({path, version = "v1", config = {}}) => {
    const url = buildPath(path, version);
    const res = await axiosInstance.delete(url, config);
    return res.data;
};

export {
    axiosInstance,
    getAPI,
    postAPI,
    putAPI,
    patchAPI,
    deleteAPI,
    getBaseURL,
    isUsingOphimApi,
};
