import {getAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import {unstable_cache} from "next/cache";

const API_PREFIX = '/country'

class CountryApi {
  detail = unstable_cache(async (id) => {
    if (isUsingOphimApi()) {
      const res = await getAPI({path: `/quoc-gia`, version: ''})
      const country = (res?.data?.items || []).find((el) => el._id === id || el.slug === id)
      if (!country) return null

      return {
        _id: country._id,
        name: country.name,
        slug: country.slug,
        code: country.slug,
      }
    }
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `/quoc-gia`})
      const items = res?.data || []
      const country = items.find((el) => el.id === id || el.slug === id)
      if (!country) return null
      return {_id: country.id, name: country.name, slug: country.slug, code: country.slug}
    }

    const result = await getAPI({path: `${API_PREFIX}/detail/${id}`});
    return result;
  }, [], {revalidate: 10})

  movies = async (id) => {
    const result = await getAPI({path: `${API_PREFIX}/movies?id=${id}`});
    return result;
  }

  list = async ()=>{
    if (isUsingOphimApi()) {
      const res = await getAPI({path: `/quoc-gia`, version: ''})
      return {result: (res?.data?.items || []).map((item) => ({_id: item._id, name: item.name, slug: item.slug, code: item.slug}))}
    }
    if (isUsingGtavnApi()) {
      const res = await getAPI({path: `/quoc-gia`})
      return {result: (res?.data || []).map((item) => ({_id: item.id, name: item.name, slug: item.slug, code: item.slug}))}
    }

    const result = await getAPI({path: `${API_PREFIX}/list`});
    return result;
  }
}

export default new CountryApi