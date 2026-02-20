import {getAPI, isUsingOphimApi} from "@/utils/axios";
import {unstable_cache} from "next/cache";
import TmdbApi from "@/api/tmdb.api";

const API_PREFIX = '/cast'

class CastApi {
  detail = unstable_cache(async (id) => {
    const {result} = await getAPI({path: `${API_PREFIX}/detail/${id}`});
    return result;
  }, [], {revalidate: 10})

  popular = async ()=>{
    const result = await getAPI({path: `${API_PREFIX}/popular`});
    return result;
  }

  favorite = async ()=>{

  }

  list = async (filter) => {
    if (isUsingOphimApi()) {
      const page = Number(filter?.page || 1)
      const keyword = filter?.keyword || filter?.q || ''
      if (keyword) {
        return await TmdbApi.searchPersons(keyword, page)
      }
      return await TmdbApi.popularPersons(page)
    }
    const queryString = Object.keys(filter).map(key => key + '=' + filter[key]).join('&')
    const {result} = await getAPI({path: `${API_PREFIX}/list?${queryString}`});
    return result;
  }
}

export default new CastApi