"use client"

import {memo, useEffect, useState} from "react";

const MovieItemLatestEpisode = ({movie}) => {
  const [latestEpisode, setLatestEpisode] = useState(null);

  useEffect(() => {
    if (movie.latest_episode) {
      const result = {...movie.latest_episode}
      if (movie.latest_episode["3"] !== undefined && movie.latest_episode["4"] !== undefined) {
        if (movie.latest_episode["3"] > movie.latest_episode["4"]) {
          delete result["4"]
        } else {
          delete result["3"]
        }
      }
      setLatestEpisode(result)
    }
  }, [movie]);

  const statusLower = movie.status?.toLowerCase()
  if (statusLower === "upcoming" || statusLower === "trailer")
    return (
      <div className="pin-new">
        <div className="line-center line-coming">
          <strong>Sắp chiếu</strong>
        </div>
      </div>
    )

  if (latestEpisode) {
    if (movie.type === 1 || movie.type === "single") {
      // Phim lẻ: không hiện số tập, LT và TM gộp 1 (ưu tiên LT)
      const hasPD = latestEpisode["1"] !== undefined;
      const ltVersion = latestEpisode["2"] !== undefined ? "lt"
        : (latestEpisode["3"] !== undefined || latestEpisode["4"] !== undefined) ? "tm"
        : null;
      return (
        <div className="pin-new m-pin-new">
          {hasPD && (
            <div className="line-center line-pd" key={`m_${movie._id}_pd`}>
              <span></span>
            </div>
          )}
          {ltVersion && (
            <div className={`line-center line-${ltVersion}`} key={`m_${movie._id}_lt`}>
              <span></span>
            </div>
          )}
        </div>
      )
    }

    // Phim bộ: hiện label + số tập
    return (
      <div className="pin-new m-pin-new">
        {Object.keys(latestEpisode).map(version => (
          <div className={`line-center line-${version === "1" ? "pd" : (version === "2" ? "lt" : "tm")}`}
               key={`m_${movie._id}_${version}`}>
            <span></span><strong>{movie.latest_episode[version]}</strong>
          </div>
        ))}
      </div>
    )
  }
}

export default memo(MovieItemLatestEpisode)