import MovieFilter from "@/components/movie/Filter";
import GenreApi from "@/api/genre.api";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import {genreUrl} from "@/utils/url";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
    return await getMetadata({page: "category", data})
}

export async function generateMetadata({params}) {
    const {slug} = await params
    const genre = await GenreApi.detail(slug)

    if (genre) {
        if (slug !== genre.slug) {
            return redirect(genreUrl(genre))
        }
        const {title, description, metadataBase, openGraph} = await pageMetadata({category_name: genre.name})
        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph
            },
            alternates: {
                canonical: genreUrl(genre)
            }
        }
    } else {
        return notFound()
    }
}

const GenrePage = async ({params}) => {
    const {slug} = await params
    const genre = await GenreApi.detail(slug)

    if (genre) {
        const {h1} = await pageMetadata({category_name: genre.name})
        return (
            <div id="wrapper">
                <H1Tags text={h1}/>
                <div className="fluid-gap">
                    <BannerCenter page="movie_list" position="center_1"/>
                    <div className="cards-row wide">
                        <div className="row-header">
                            <h3 className="category-name">Phim {genre.name}</h3>
                        </div>
                        <MovieFilter initFilter={{genres: [genre.slug], exclude_status: ["Upcoming"]}}/>
                    </div>
                    <BannerCenter page="movie_list" position="center_2"/>
                </div>
            </div>
        )
    }
}

export default GenrePage
