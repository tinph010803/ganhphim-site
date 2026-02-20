import axios from "axios";

const API_KEY = 'AIzaSyC83fB5XYKDH0V5q98EehbIujxRQLPysd4'

class TenorApi {

    getListFeatured = async ({type, pos = ""}) => {
        try {
            let api = `https://tenor.googleapis.com/v2/featured?key=${API_KEY}&limit=30`
            if (type === "sticker") api += `&searchfilter=sticker`
            if (pos) api += `&pos=${pos}`
            const {data} = await axios.get(api)
            return data
        } catch (e) {
        }

        return []
    }

    search = async ({keyword, type, pos = ""}) => {
        try {
            let api = `https://tenor.googleapis.com/v2/search?key=${API_KEY}&limit=30&q=${keyword}`
            if (type === "sticker") api += `&searchfilter=sticker`
            if (pos) api += `&pos=${pos}`
            const {data} = await axios.get(api)
            return data
        } catch (e) {
        }

        return []
    }
}

export default new TenorApi