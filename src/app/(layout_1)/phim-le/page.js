import MovieFilter from "@/components/movie/Filter";
import {getMetadata} from "@/utils/metadata";
import {genreUrl} from "@/utils/url";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

let metadata = null

const pageMetadata = async () => {
    return await getMetadata({page: "movie"})
}

export async function generateMetadata({params}) {
    const {title, description, metadataBase, openGraph} = await pageMetadata()
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: "/phim-le"
        }
    }
}

const MoviePage = async ({params}) => {
    const {h1} = await pageMetadata()

    return (
        <div id="wrapper">
            <H1Tags text={h1}/>
            <div className="fluid-gap">
                <BannerCenter page="movie_list" position="center_1"/>
                <div className="cards-row wide">
                    <div className="row-header">
                        <h3 className="category-name">Phim lẻ</h3>
                    </div>
                    <MovieFilter initFilter={{type: "1", exclude_status: ["Upcoming"]}}/>
                </div>
                <BannerCenter page="movie_list" position="center_2"/>
            </div>
        </div>
    )
}

export default MoviePage