import MovieApi from "@/api/movie.api";
import {notFound} from "next/navigation";
import MovieInfoTags from "@/components/movie/InfoTags"
import MovieGenreTags from "@/components/movie/GenreTags"
import MovieImagesPoster from "@/components/movie/images/Poster"
import W2gCreateForm from "@/components/w2g/CreateForm";
import Link from "next/link";
import {movieDetailUrl, movieWatchUrl} from "@/utils/url";
import {getMetadata} from "@/utils/metadata";

const pageMetadata = async () => {
    return await getMetadata({page: "w2gCreateRoom"})
}

export async function generateMetadata({params}) {
    const {movie_id} = await params

    const {title, description, metadataBase, openGraph} = await pageMetadata()
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/xem-chung/tao-phong/${movie_id}`
        }
    }
}

const W2gCreateRoomPage = async ({params, searchParams}) => {
    const {movie_id} = await params
    const {ss = 1, ep = 1} = await searchParams
    const movie = await MovieApi.detail(movie_id)

    if (!movie) return notFound()

    return (
        <>
            <div id="wrapper" className="live-category is-live-create">
                <div className="fluid-gap">
                    <div className="cards-row wide">
                        <div className="row-header mb-4">
                            <Link className="btn btn-circle btn-outline" href={movieWatchUrl(movie)}>
                                <i className="fa-solid fa-angle-left"></i>
                            </Link>
                            <h3 className="category-name me-2">Tạo phòng xem chung</h3>
                        </div>
                        <div className="row-content">
                            <div className="w2g-create">
                                <div className="w2g-org-detail">
                                    <div className="div-poster">
                                        <div className="v-thumbnail position-relative">
                                            <MovieImagesPoster movie={movie} size="500-0"/>
                                        </div>
                                    </div>
                                    <div className="info">
                                        <h2 className="heading-sm media-name">
                                            <Link href={movieDetailUrl(movie)} title={movie.title}>{movie.title}</Link>
                                        </h2>
                                        <div className="alias-name mb-3 text-primary">{movie.english_title}</div>
                                        <div className="detail-more">
                                            <MovieInfoTags movie={movie}/>
                                            <div className="hl-tags">
                                                <MovieGenreTags genres={movie.genres} position="w2g"/>
                                            </div>
                                            <div className="description small-text lim-3 mb-4">
                                                {movie.overview}
                                            </div>
                                            {movie.type === 2 && (<div className="buttons line-center w-100">
                                                <div className="btn btn-outline">
                                                    <i className="fa-solid fa-play"></i>
                                                    <span>Phần {ss} - Tập {ep}</span>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                                <W2gCreateForm movie={movie} ss={ss} ep={ep}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default W2gCreateRoomPage