import {getAPI} from "@/utils/axios"

const API_PREFIX = '/robong'

class RobongApi {
    hotMatches = async () => {
        try {
            return await getAPI({path: `${API_PREFIX}/hotMatches`});
        } catch (error) {

        }

        return false
    }
}

export default new RobongApi