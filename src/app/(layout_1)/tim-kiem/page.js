import {getMetadata} from "@/utils/metadata";
import SearchPageContent from "@/components/seach/SearchPageContent";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
    return await getMetadata({page: "search", data})
}

export async function generateMetadata({searchParams}) {
    const {q} = await searchParams
    const {title, description, metadataBase, openGraph} = await pageMetadata({keyword: q})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/tim-kiem?q=${q}`
        },
        robots: {
            index: false,
            follow: true
        }
    }
}

const SearchPage = async ({searchParams}) => {
    const {q} = await searchParams
    const {h1} = await pageMetadata({keyword: q})

    return (
        <div id="wrapper">
            <H1Tags text={h1}/>
            <div className="fluid-gap">
                <BannerCenter page="movie_list" position="center_1"/>
                <SearchPageContent keyword={q}/>
            </div>
        </div>
    )
}

export default SearchPage