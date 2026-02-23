import {getAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {unstable_cache} from "next/cache";

const API_PREFIX = '/production'

class ProductionApi {
  detail = unstable_cache(async (id) => {
    if (isUsingOphimApi() || isUsingGtavnApi()) return null
    const result = await getAPI({path: `${API_PREFIX}/detail/${id}`});
    return result;
  }, [], {revalidate: 10})
}

export default new ProductionApi