import {getAPI, postAPI} from "@/utils/axios";
import {getAuthTokens, removeAuthTokens} from "@/utils/auth";

const API_PREFIX = '/user'

class UserApi {
    info = async () => {
        return await getAPI({path: `${API_PREFIX}/info`})
    }

    avatars = async () => {
        return await getAPI({path: `${API_PREFIX}/avatars`})
    }

    vipPackagesList = async () => {
        return await getAPI({path: `${API_PREFIX}/getVipPackagesList`})
    }

    updateProfile = async (data) => {
        return await postAPI({path: `${API_PREFIX}/updateProfile`, data})
    }

    saveSettings = async (data) => {
        return await postAPI({path: `${API_PREFIX}/saveSettings`, data})
    }

    upgradeRox = async (data) => {
        return await postAPI({path: `${API_PREFIX}/upgradeRox`, data})
    }

    changePassword = async (data) => {
        return await postAPI({path: `${API_PREFIX}/changePassword`, data})
    }

    setPassword = async (data) => {
        return await postAPI({path: `${API_PREFIX}/setPassword`, data})
    }

    ban = async (id) => {
        return await postAPI({path: `${API_PREFIX}/ban`, data: {id}})
    }

    loginTV = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/loginTV`, data})
        return res
    }

    uploadAvatar = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/uploadAvatar`, data})
        return res
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


export default new UserApi