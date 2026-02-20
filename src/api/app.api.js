import {getAPI} from "@/utils/axios"

const API_PREFIX = '/app'

class AppApi {
  linkDownload = async ({platform}) => {
    const result = await getAPI({path: `${API_PREFIX}/linkDownload?platform=${platform}`});
    return result;
  }
}

export default new AppApi