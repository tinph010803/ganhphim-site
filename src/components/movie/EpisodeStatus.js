import {memo} from "react";

const MovieEpisodeStatus = ({movie, className = ""}) => {
    if (movie.type === 2) {
        const latestEpisode = movie.latest_episode ? Math.max(...Object.values(movie.latest_episode)) : 1
        let totalEpisodes = "?"
        if (movie.total_episodes) totalEpisodes = movie.total_episodes
        if (movie.status !== "On Going" && (movie.total_episodes < latestEpisode || totalEpisodes === "?")) totalEpisodes = latestEpisode

        if (movie.status === "On Going" && latestEpisode !== totalEpisodes)
            return (
                <div className={`status on-going ${className}`}>
                    <div className="line-center small">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                        <span>Đang chiếu: {latestEpisode} / {totalEpisodes} tập</span>
                    </div>
                </div>
            )
        else if (movie.status !== "Upcoming")
            return (
                <div className={`status complete ${className}`}>
                    <div className="line-center small">
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Đã hoàn thành: {latestEpisode} / {totalEpisodes} tập</span>
                    </div>
                </div>
            )
    }

    return null
}

export default memo(MovieEpisodeStatus)