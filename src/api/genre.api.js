import {getAPI} from "@/utils/axios";
import {unstable_cache} from "next/cache";
import {isUsingOphimApi} from "@/utils/axios";

const API_PREFIX = '/genre'

class GenreApi {
  detail = unstable_cache(async (id) => {
    if (isUsingOphimApi()) {
      const res = await getAPI({path: `/the-loai`, version: ''})
      const genre = (res?.data?.items || []).find((el) => el._id === id || el.slug === id)
      if (!genre) return null

      return {
        _id: genre._id,
        name: genre.name,
        slug: genre.slug,
      }
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
      const res = await getAPI({path: `/the-loai`, version: ''})
      return {result: (res?.data?.items || []).map((item) => ({_id: item._id, name: item.name, slug: item.slug}))}
    }

    const result = await getAPI({path: `${API_PREFIX}/list`});
    return result;
  }

  mostPopularRanking = async () => {
    if (isUsingOphimApi()) {
      const TOP_GENRES = [
        {_id: 'hanh-dong', name: 'Hành động', slug: 'hanh-dong'},
        {_id: 'tinh-cam',  name: 'Tình cảm',  slug: 'tinh-cam'},
        {_id: 'kinh-di',   name: 'Kinh dị',   slug: 'kinh-di'},
        {_id: 'co-trang',  name: 'Cổ trang',  slug: 'co-trang'},
        {_id: 'hai-huoc',  name: 'Hài hước',  slug: 'hai-huoc'},
      ]
      return TOP_GENRES.map((g, i) => ({...g, current_rank: i + 1, direction: 'same'}))
    }
    const {result} = await getAPI({path: `${API_PREFIX}/mostPopularRanking`});
    return result;
  }
}

export default new GenreApi