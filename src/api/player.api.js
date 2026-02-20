import {getAPI, postAPI, isUsingOphimApi} from "@/utils/axios";

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

        const {result} = await getAPI({path: `${API_PREFIX}/getLink?movie_id=${movie_id}`});
        return result;
    }
}


export default new PlayerApi