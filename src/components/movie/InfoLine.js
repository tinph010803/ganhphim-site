import {formatDuration} from "@/utils/helpers";
import {memo} from "react";

const MovieInfoLine = ({movie}) => {
    return (
        <div className="info-line">
            <div className="tag-small"><strong>{movie.rating}</strong></div>
            {(movie.status === "Upcoming" || movie.status === "Trailer") && (<div className="tag-small">
                Sắp chiếu
            </div>)}
            {movie.type !== 1 && <>
                {movie.latest_season > 0 && <div className="tag-small">
                    Phần {movie.latest_season}
                </div>}
                {(movie.latest_episode && Object.keys(movie.latest_episode).length > 0) && <div className="tag-small">
                    Tập {Math.max(...Object.values(movie.latest_episode))}
                </div>}
            </>}
            {movie.type === 1 && <>
                {movie.year && <div className="tag-small">{movie.year}</div>}
                <div className="tag-small">
                    {formatDuration(movie.runtime)}
                </div>
                {movie.quality === "cam" && (<div className="tag-small">CAM</div>)}
            </>}
        </div>
    )
}

export default memo(MovieInfoLine)