import MovieApi from "@/api/movie.api";
import {movieBackdrop} from "@/utils/image";
import {movieWatchUrl} from "@/utils/url";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import MovieWatchContent from "@/components/movie/watch/Content";
import ShareModal from "@/components/sharethis/Modal";
import {headers} from "next/headers";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata({params, searchParams}) {
    const {slug, id} = await params
    const _searchParams = await searchParams
    const {ss, ep, ver} = _searchParams
    const movie = await MovieApi.detail(slug)

    if (movie) {
        if (slug !== movie.slug) {
            return redirect(movieWatchUrl(movie))
        }
        const data = {
            movie,
            season_number: ss,
            episode_number: ep,
            version: ver
        }
        const {
            title,
            description,
            metadataBase,
            openGraph
        } = await getMetadata({
            page: (movie.type === 2 && ss && ep) ? "watch_tv" : "watch",
            data
        })

        const hdrs = await headers()
        const host = hdrs.get("host") || "";
        const proto = hdrs.get("x-forwarded-proto") || "https";
        const path = movieWatchUrl(movie);
        const qs = new URLSearchParams(_searchParams).toString();
        const currentUrl = `${proto}://${host}${path}${qs ? "?" + qs : ""}`;

        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph,
                url: movieWatchUrl(movie),
                images: [
                    {url: movieBackdrop(movie.images.backdrops)}
                ]
            },
            alternates: {
                canonical: currentUrl
            }
        }
    } else {
        return notFound()
    }
}

const MovieDetail = async ({params, searchParams}) => {
    const {slug} = await params
    const {ss, ep, ver} = await searchParams
    const movie = await MovieApi.detail(slug)
    if (movie) {
        const {h1} = await getMetadata({
            page: (movie.type === 2 && ss && ep) ? "watch_tv" : "watch",
            data: {
                movie,
                season_number: ss,
                episode_number: ep,
                version: ver
            }
        })

        movie.is_upcoming = movie?.status === "Upcoming"

        return (
            <>
                <div id="wrapper" className="makeup wrapper-watch">
                    <H1Tags text={h1}/>
                    <MovieWatchContent movie={movie}/>
                </div>
                <ShareModal/>
            </>
        )
    }
}

export default MovieDetail