"use client"

import {formatDuration} from "@/utils/helpers";
import {memo} from "react";

const MovieInfoTags = ({movie}) => {
    return (
        <div className="hl-tags">
            {movie.imdb_rating > 0 && <div className="tag-imdb">
                <span>{movie.imdb_rating}</span>
            </div>}
            {["2k", "4k"].indexOf(movie.quality) >= 0 && <div className="tag-quality">
                <span>{movie.quality.toUpperCase()}</span>
            </div>}
            {movie.rating && <div className="tag-model">
                <span className="last"><strong>{movie.rating}</strong></span>
            </div>}
            {movie.year && <div className="tag-classic">
                <span>{movie.year}</span>
            </div>}
            {movie.type !== 1 && <>
                {movie.latest_season > 0 && (
                    <div className="tag-classic">
                        <span>Phần {movie.latest_season}</span>
                    </div>
                )}
                {(movie.latest_episode && Object.keys(movie.latest_episode).length > 0) && <div className="tag-classic">
                    <span>Tập {movie.latest_episode["1"] ? movie.latest_episode["1"] : Math.max(...Object.values(movie.latest_episode))}</span>
                </div>}
            </>}
            {(movie.type === 1 && movie.runtime) && <div className="tag-classic">
                <span>{formatDuration(movie.runtime)}</span>
            </div>}
            {movie.quality === "cam" && (<div className="tag-classic">CAM</div>)}
        </div>
    )
}

export default memo(MovieInfoTags)