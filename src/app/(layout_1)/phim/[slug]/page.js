import MovieApi from "@/api/movie.api";
import {movieBackdrop} from "@/utils/image";
import Link from "next/link";
import {movieDetailUrl, movieWatchUrl} from "@/utils/url";
import MovieCasts from "@/components/movie/Casts";
import MovieCommentWidget from "@/components/comment/Widget";
import MovieReviewsButton from "@/components/movie/reviews/Button";
import MovieFavoriteButton from "@/components/movie/favorite/Button";
import MoviePlaylistButton from "@/components/playlist/Button";
import MovieTopViewsOfWeek from "@/components/movie/TopViewsOfWeek";
import MovieDetailInfo from "@/components/movie/detail/Info";
import MovieShareButton from "@/components/movie/share/Button";
import {getMetadata} from "@/utils/metadata";
import MovieCommentButton from "@/components/comment/Button";
import {notFound, redirect} from "next/navigation";
import MovieDetailContent from "@/components/movie/detail/Content";
import {memo} from "react";
import ShareModal from "@/components/sharethis/Modal";
import MovieRemindButton from "@/components/movie/remind/Button";
import H1Tags from "@/components/layout/H1Tags";
import AdsBannerSidebar from "@/components/ads/BannerSidebar";
import AdsBannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
    return await getMetadata({page: "detail", data})
}

export async function generateMetadata({params}) {
    const {slug} = await params
    const movie = await MovieApi.detail(slug)

    if (movie) {
        if (slug !== movie.slug) {
            return redirect(movieDetailUrl(movie))
        }

        const {title, description, metadataBase, openGraph} = await pageMetadata({movie})
        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph,
                url: movieDetailUrl(movie),
                images: [
                    {url: movieBackdrop(movie.images.backdrops)}
                ]
            },
            alternates: {
                canonical: movieDetailUrl(movie)
            }
        }
    } else {
        return notFound()
    }
}

const MovieDetail = async ({params}) => {
    const {slug} = await params
    const movie = await MovieApi.detail(slug)
    if (movie) {
        const {h1} = await pageMetadata({movie})
        movie.is_upcoming = movie?.status === "Upcoming"
        return (
            <>
                <H1Tags text={h1}/>
                <div className="top-detail-wrap">
                    <div className="background-fade"
                         style={{backgroundImage: `url(${movieBackdrop(movie.images.backdrops)})`}}></div>
                    <div className="cover-fade">
                        <div className="cover-image"
                             style={{backgroundImage: `url(${movieBackdrop(movie.images.backdrops)})`}}></div>
                    </div>
                </div>
                <div id="wrapper" className="wrapper-w-slide">
                    <div className="detail-container">
                        <div className="dc-side">
                            <MovieDetailInfo movie={movie}/>
                            <AdsBannerSidebar page="movie_detail" position="left_1"/>
                            <MovieCasts movieId={movie._id} movie={movie}/>
                            <MovieTopViewsOfWeek/>
                            <AdsBannerSidebar page="movie_detail" position="left_2"/>
                        </div>
                        <div className="dc-main">
                            <div className="dm-bar">
                                <div className="elements">
                                    {!movie.is_upcoming &&
                                        <Link href={movieWatchUrl(movie)}
                                              className="btn btn-xl btn-rounded button-play flex-shrink-0">
                                            <i className="fa-solid fa-play"></i>
                                            <span>Xem Ngay</span>
                                        </Link>}
                                    {movie.is_upcoming && (
                                        <Link href={movieWatchUrl(movie)}
                                              className="btn btn-xl btn-rounded button-play is-coming flex-shrink-0">
                                            <i className="fa-solid fa-video"></i>
                                            <span>Xem Trailer</span>
                                            <div className="text">Phim sắp ra mắt</div>
                                        </Link>
                                    )}
                                    <div className="touch-group flex-grow-1">
                                        <div className="is-left flex-grow-1">
                                            {movie.is_upcoming ?
                                                <MovieRemindButton position="detail" movieId={movie._id}/> :
                                                <MovieFavoriteButton position="detail" movieId={movie._id}/>}
                                            <MoviePlaylistButton movieId={movie._id} position="detail"/>
                                            <MovieShareButton/>
                                            <MovieCommentButton/>
                                        </div>
                                        <div className="is-right">
                                            <MovieReviewsButton movie={movie}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AdsBannerCenter page="movie_detail" position="center_1" style={{marginBottom: "30px",marginTop:"30px"}}/>
                            <div className="content-gap">
                                <div className="cg-body">
                                    <MovieDetailContent movie={movie}/>
                                </div>
                                <MovieCommentWidget movie={movie}/>
                            </div>
                        </div>
                    </div>
                    <AdsBannerCenter page="movie_detail" position="center_2" style={{marginTop: "32px"}}/>
                </div>
                <ShareModal/>
            </>
        )
    }
}

export default memo(MovieDetail)
