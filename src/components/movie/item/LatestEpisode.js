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

  if (movie.status === "Upcoming")
    return (
      <div className="pin-new">
        <div className="line-center line-coming">
          <strong>Sắp chiếu</strong>
        </div>
      </div>
    )

  if (latestEpisode)
    return (
      <div className="pin-new m-pin-new">
        {Object.keys(latestEpisode).map(version => {
          return (
            <div className={`line-center line-${version === "1" ? "pd" : (version === "2" ? "lt" : "tm")}`}
                 key={`m_${movie._id}_${version}`}>
              {movie.type === 1 && `${version === "1" ? "P.Đề" : (version === "2" ? "L.Tiếng" : "T.Minh")}`}
              {movie.type !== 1 && <><span></span><strong>{movie.latest_episode[version]}</strong></>}
            </div>
          )
        })}
      </div>
    )
}

export default memo(MovieItemLatestEpisode)