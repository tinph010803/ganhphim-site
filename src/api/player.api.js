import {getAPI, postAPI, isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";

const API_PREFIX = '/player'

class PlayerApi {
    getLink = async (movie_id) => {
        if (isUsingOphimApi()) {
            try {
                const movie = await getAPI({path: `/phim/${movie_id}`, version: ''})
                const episodes = movie?.data?.item?.episodes || []
                if (episodes.length > 0 && episodes[0].server_data?.length > 0) {
                    const firstEpisode = episodes[0].server_data[0]
                    return firstEpisode.link_embed || firstEpisode.link_m3u8 || ''
                }
                return ''
            } catch (e) {
                return ''
            }
        }
        if (isUsingGtavnApi()) {
            try {
                const res = await getAPI({path: `/phim/${movie_id}`})
                const item = res?.data?.item
                const episodes = item?.episodes
                const episodesArr = Array.isArray(episodes)
                    ? episodes
                    : Object.values(episodes || {}).filter(Boolean)
                if (episodesArr.length > 0) {
                    const serverData = episodesArr[0]?.server_data || episodesArr[0]
                    const firstEp = Array.isArray(serverData) ? serverData[0] : serverData
                    if (firstEp) return firstEp.link_embed || firstEp.link_m3u8 || ''
                }
                return ''
            } catch (e) {
                return ''
            }
        }

        const {result} = await getAPI({path: `${API_PREFIX}/getLink?movie_id=${movie_id}`});
        return result;
    }
}


export default new PlayerApi