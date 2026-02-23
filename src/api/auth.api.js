import {getAuthTokens, removeAuthTokens, setAuthTokens} from "@/utils/auth";
import {getAPI, postAPI, putAPI, isUsingGtavnApi} from "@/utils/axios";

const API_PREFIX = '/auth'

class AuthApi {
    login = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/login`, data})
        if (res.status) {
            const tokens = isUsingGtavnApi() ? res.data?.tokens : res.result?.tokens
            if (tokens) setAuthTokens(tokens)
        }
        return res
    }

    loginGoogle = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/loginGoogle`, data})
        if (res.status) {
            const tokens = isUsingGtavnApi() ? res.data?.tokens : res.result?.tokens
            if (tokens) setAuthTokens(tokens)
        }
        return res
    }

    register = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/register`, data})
        if (res.status) {
            const tokens = isUsingGtavnApi() ? res.data?.tokens : res.result?.tokens
            if (tokens) setAuthTokens(tokens)
        }
        return res
    }

    forgotPassword = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/forgotPassword`, data})
        return res
    }

    setNewPassword = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/setNewPassword`, data})
        return res
    }

    changePassword = async (data) => {
        const res = await putAPI({path: `${API_PREFIX}/change-password`, data})
        return res
    }

    verifyToken = async (token) => {
        const res = await getAPI({path: `${API_PREFIX}/verifyToken?token=${token}`})
        return res
    }

    getProfile = async () => {
        const res = await getAPI({path: `${API_PREFIX}/profile`})
        return res
    }

    updateProfile = async (data) => {
        const res = await putAPI({path: `${API_PREFIX}/profile`, data})
        return res
    }

    refreshTokens = async () => {
        const {refreshToken} = getAuthTokens()

        if (!refreshToken) return false

        try {
            const refreshPath = isUsingGtavnApi() ? `${API_PREFIX}/refresh` : `${API_PREFIX}/refreshTokens`
            const res = await postAPI({
                path: refreshPath,
                data: {refreshToken}
            })
            const tokens = isUsingGtavnApi() ? res?.data : res?.result?.tokens
            if (res.status && tokens) {
                setAuthTokens(isUsingGtavnApi() ? tokens : tokens)
                return true
            }
        } catch (e) {
            console.error(e)
        }

        removeAuthTokens()

        return false
    }

    logout = async () => {
        const {refreshToken} = getAuthTokens()
        const data = isUsingGtavnApi() ? undefined : {refreshToken}
        const res = await postAPI({
            path: `${API_PREFIX}/logout`,
            data
        })

        removeAuthTokens()

        return res
    }
}


export default new AuthApi