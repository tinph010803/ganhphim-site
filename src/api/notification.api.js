import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";

const API_PREFIX = '/notification'

class NotificationApi {
  latest = async () => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return {result: {items: [], unseen: 0}}
    const res = await getAPI({path: `${API_PREFIX}/latest`});
    return res
  }

  list = async ({limit = 10, after_time, type}) => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return {result: {items: [], page_count: 0}}
    const res = await getAPI({path: `${API_PREFIX}/list?limit=${limit}&after_time=${after_time}&type=${type}`});
    return res
  }

  seenAll = async () => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return null
    const res = await postAPI({path: `${API_PREFIX}/seenAll`});
    return res
  }

  seen = async (id) => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return null
    const res = await postAPI({path: `${API_PREFIX}/seen?id=${id}`});
    return res
  }
}

export default new NotificationApi