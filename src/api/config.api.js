import {getAPI, isUsingOphimApi} from "@/utils/axios"

const API_PREFIX = '/config'

class ConfigApi {
    list = async () => {
        if (isUsingOphimApi()) return {result: {}}
        const result = await getAPI({path: `${API_PREFIX}/list`});
        return result;
    }
}

export default new ConfigApi