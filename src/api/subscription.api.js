import {postAPI} from "@/utils/axios"

const API_PREFIX = '/subscription'

class Subscription {
  subscribe = async (data) => {
    const result = await postAPI({path: `${API_PREFIX}/subscribe`, data});
    return result;
  }
}

export default new Subscription