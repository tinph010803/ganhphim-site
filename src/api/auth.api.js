import {getAuthTokens, removeAuthTokens, setAuthTokens} from "@/utils/auth";
import {getAPI, postAPI} from "@/utils/axios";

const API_PREFIX = '/auth'

class AuthApi {
    login = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/login`, data})
        if (res.status) {
            setAuthTokens(res.result.tokens)
        }
        return res
    }

    loginGoogle = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/loginGoogle`, data})
        if (res.status) {
            setAuthTokens(res.result.tokens)
        }
        return res
    }

    register = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/register`, data})
        if (res.status) {
            setAuthTokens(res.result.tokens)
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

    verifyToken = async (token) => {
        const res = await getAPI({path: `${API_PREFIX}/verifyToken?token=${token}`})
        return res
    }

    refreshTokens = async () => {
        const {refreshToken} = getAuthTokens()

        if (!refreshToken) return false

        try {
            const {result, status} = await postAPI({
                path: `${API_PREFIX}/refreshTokens`,
                data: {refreshToken}
            })
            if (status) {
                setAuthTokens(result.tokens)
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
        const res = await postAPI({
            path: `${API_PREFIX}/logout`,
            data: {refreshToken: refreshToken}
        })

        removeAuthTokens()

        return res
    }
}


export default new AuthApi