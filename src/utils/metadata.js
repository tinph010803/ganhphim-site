import {headers} from "next/headers";
import {_metadata} from "@/constants/metadata";
import {TYPE_PRESENT_NORTH, TYPE_PRESENT_SOUTH, TYPE_SUBTITLE, TYPE_VOICEOVER} from "@/constants/episodeVersion";

const replaceData = ({str, data}) => {
    const {
        siteName,
        movie,
        season_number,
        episode_number,
        version = 1,
        domain,
        category_name,
        keyword,
        collection_name,
        user
    } = data

    if (siteName) str = str.replace(/{site_name}/g, siteName)
    if (domain) str = str.replace(/{domain}/g, domain)
    if (keyword) str = str.replace(/{keyword}/g, keyword)
    if (season_number) {
        if (parseInt(season_number) > 1) {
            str = str.replace(/{season_number}/g, season_number)
        } else {
            str = str.replace(/Phần {season_number}/gi, "")
        }
    }
    if (episode_number) str = str.replace(/{episode_number}/g, episode_number)
    if (version) {
        if (version == TYPE_SUBTITLE.id) {
            str = str.replace(/{version}/g, "Vietsub")
        }
        if (version == TYPE_VOICEOVER.id) {
            str = str.replace(/{version}/g, "Lồng tiếng")
        }
        if (version == TYPE_PRESENT_SOUTH.id || version == TYPE_PRESENT_NORTH.id) {
            str = str.replace(/{version}/g, "Thuyết minh")
        }
    }
    if (movie) {
        str = str.replace(/{movie_title}/g, movie.title).replace(/{movie_english_title}/g, movie?.english_title).replace(/{overview}/g, movie?.overview)
    }
    if (category_name) {
        str = str.replace(/{category_name}/g, category_name)
    }
    if (collection_name) {
        str = str.replace(/{collection_name}/g, collection_name)
    }
    if (user) {
        str = str.replace(/{user_name}/g, user.name)
    }

    return str
}

const getMetadata = async ({page = "default", data = {}}) => {
    const headersList = await headers()
    const host = headersList.get('host')
    try {
        const metadata = _metadata[page] || _metadata["default"]

        const siteName = "RoPhim"

        data = {...data, siteName, domain: host}

        const title = replaceData({str: metadata.title, data}),
            description = replaceData({str: metadata.description, data})

        return {
            metadataBase: new URL(`${headersList.get('x-forwarded-proto')}://${host}`),
            title,
            description,
            h1: replaceData({str: metadata.h1, data}),
            openGraph: {
                url: '/',
                images: [
                    {
                        url: "/images/capture.png",
                        width: 1200,
                        height: 630,
                    },
                ],
                locale: 'vi_VN',
                type: 'website',
                siteName,
                title,
                description,
            }
        }
    } catch (error) {
        console.log(error)
    }

    return null
}

export {
    getMetadata,
    replaceData
}