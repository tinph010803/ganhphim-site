"use client"

import Link from "next/link";
import {movieDetailUrl} from "@/utils/url";
import MoviePlayer from "@/components/movie/watch/Player";
import ActionBar from "@/components/movie/watch/ActionBar";
import MovieInfoTags from "@/components/movie/InfoTags";
import MovieGenreTags from "@/components/movie/GenreTags";
import MovieCommentWidget from "@/components/comment/Widget";
import MovieCommentButton from "@/components/comment/Button";
import MovieReviewsButton from "@/components/movie/reviews/Button";
import MovieCasts from "@/components/movie/Casts";
import MovieSuggestion from "@/components/movie/Suggestion";
import {memo, useEffect} from "react";
import MovieImagesPoster from "@/components/movie/images/Poster";
import MovieVersions from "@/components/movie/Versions";
import MovieEpisodes from "@/components/movie/Episodes";
import MovieUpcomingPlayer from "@/components/movie/watch/UpcomingPlayer";
import MovieEpisodeStatus from "@/components/movie/EpisodeStatus";
import MovieApi from "@/api/movie.api";
import Cookies from 'js-cookie'
import BannerCenter from "@/components/ads/BannerCenter";
import AdsBannerSidebar from "@/components/ads/BannerSidebar";
import AdsBannerCenter from "@/components/ads/BannerCenter";
import GtavnServers from "@/components/movie/watch/GtavnServers";

const MovieWatchContent = ({movie}) => {
    useEffect(() => {
        const COOKIE_NAME = `lastView_${movie._id}`
        const TTL = 30 * 60 * 1000
        const now = Date.now()

        const last = parseInt(Cookies.get(COOKIE_NAME) || '0', 10)

        if (now - last > TTL) {
            MovieApi.logView(movie._id)

            Cookies.set(COOKIE_NAME, now.toString(), {expires: 1})
        }
    }, [movie])

    return (
        <>
            <BannerCenter page="movie_watch" position="center_1" style={{marginBottom: "32px"}}/>
            <div className="watch-player">
                <div className="wp-bread line-center">
                    <Link className="btn btn-circle btn-outline me-2" href={movieDetailUrl(movie)}>
                        <i className="fa-solid fa-angle-left"></i>
                    </Link>
                    <h2 className="heading-sm page-name mb-0">Xem phim {movie.title}</h2>
                </div>
                <div className="player-ratio">
                    {!movie.is_upcoming && (<MoviePlayer movie={movie}/>)}
                    {movie.is_upcoming && (<MovieUpcomingPlayer movie={movie}/>)}
                    <ActionBar movie={movie}/>
                </div>
            </div>
            <div className="watch-container">
                <div className="wc-main">
                    <div className="wm-info">
                        <div className="v-thumb-l">
                            <div className="v-thumbnail">
                                <MovieImagesPoster movie={movie}/>
                            </div>
                        </div>
                        <div className="info">
                            <h2 className="heading-sm media-name">
                                <Link href={movieDetailUrl(movie)} title={movie.title}>{movie.title}</Link>
                            </h2>
                            <div className="alias-name">{movie.english_title}</div>
                            <div className="detail-more">
                                <MovieInfoTags movie={movie}/>
                                <div className="hl-tags">
                                    <MovieGenreTags genres={movie.genres}/>
                                </div>
                                <MovieEpisodeStatus movie={movie}/>
                            </div>
                        </div>
                        <div className="desc-line">
                            <div className="description lim-3"
                                 dangerouslySetInnerHTML={{__html: movie.overview}}/>
                            <Link href={movieDetailUrl(movie)} className="text-primary">Thông tin phim <i
                                className="fa-solid fa-angle-right small me-2"></i></Link>
                        </div>
                    </div>
                    {!movie.is_upcoming && (<div id="episodes-list" className="wm-episodes">
                        {movie.gtavn_servers
                            ? <GtavnServers movie={movie} page="watch"/>
                            : (movie.type === 1
                                ? <MovieVersions movie={movie} page={`watch`}/>
                                : <MovieEpisodes movie={movie} page={`watch`}/>)
                        }
                    </div>)}
                    <AdsBannerCenter page="movie_watch" position="center_1"/>
                    <MovieCommentWidget movie={movie} page={"watch"}/>
                    <AdsBannerCenter page="movie_watch" position="center_2"/>
                </div>
                <div className="wc-side">
                    <div className="ws-rate">
                        <div className="line-center gap-3 wsr-left">
                            <a className="item-v item-rate">
                                <div className="inc-icon icon-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                                         fill="none">
                                        <path
                                            d="M30.36 14.63C30.94 14.06 31.15 13.23 30.9 12.45C30.65 11.67 29.99 11.12 29.18 11L21.46 9.88C21.46 9.88 21.38 9.85 21.37 9.81L17.92 2.81C17.56 2.08 16.83 1.62 16.01 1.62C15.19 1.62 14.46 2.07 14.1 2.81L10.65 9.81C10.65 9.81 10.6 9.87 10.55 9.88L2.83001 11C2.02001 11.12 1.37001 11.67 1.11001 12.45C0.860006 13.23 1.06001 14.06 1.65001 14.63L7.24001 20.08C7.24001 20.08 7.28001 20.15 7.28001 20.19L5.96001 27.88C5.82001 28.68 6.15001 29.48 6.81001 29.96C7.47001 30.44 8.33001 30.5 9.05001 30.12L15.96 26.49C15.96 26.49 16.04 26.47 16.08 26.49L22.99 30.12C23.3 30.29 23.64 30.37 23.98 30.37C24.42 30.37 24.86 30.23 25.23 29.96C25.89 29.48 26.21 28.68 26.08 27.88L24.76 20.19C24.76 20.19 24.76 20.11 24.8 20.08L30.39 14.63H30.36Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                                <span>Đánh giá</span>
                            </a>
                            <div className="v-line"></div>
                            <MovieCommentButton page={"watch"}/>
                        </div>
                        <MovieReviewsButton movie={movie}/>
                    </div>
                    <AdsBannerSidebar page="movie_watch" position="right_1"/>
                    <div className="ws-actors">
                        <MovieCasts movieId={movie._id} movie={movie}/>
                    </div>
                    <MovieSuggestion movieId={movie.public_id} style="list"/>
                    <AdsBannerSidebar page="movie_watch" position="right_2"/>
                </div>
            </div>
        </>
    )
}

export default memo(MovieWatchContent)