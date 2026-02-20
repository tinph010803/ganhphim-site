import MovieFilter from "@/components/movie/Filter";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async () => {
    return await getMetadata({page: "tv"})
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
            canonical: "/phim-bo"
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
                        <h3 className="category-name">Phim bộ</h3>
                    </div>
                    <MovieFilter initFilter={{type: "2", exclude_status: ["Upcoming"]}}/>
                </div>
                <BannerCenter page="movie_list" position="center_2"/>
            </div>
        </div>
    )
}

export default MoviePage