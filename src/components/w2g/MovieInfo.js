"use client"

import MovieImagesPoster from "@/components/movie/images/Poster";
import MovieInfoTags from "@/components/movie/InfoTags";
import MovieGenreTags from "@/components/movie/GenreTags";
import MovieEpisodeStatus from "@/components/movie/EpisodeStatus";

const W2gMovieInfo = ({movie})=>{
    return (
        <div className="l_detail">
            <div className="ld-source">
                <div className="ld-source-detail">
                    <div className="v-thumb-l">
                        <div className="v-thumbnail">
                            <MovieImagesPoster movie={movie}/>
                        </div>
                    </div>
                    <div className="info">
                        <h2 className="heading-md media-name">{movie.title}</h2>
                        <div className="alias-name mb-3">{movie.english_title}</div>
                        <div className="detail-more">
                            <MovieInfoTags movie={movie}/>
                            <div className="hl-tags">
                                <MovieGenreTags genres={movie.genres}/>
                            </div>
                            <MovieEpisodeStatus movie={movie} className="mb-4"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default W2gMovieInfo