"use client"

import {memo, } from "react";

const MovieUpcomingPlayer = ({movie}) => {
  return (
    <div className="ratio ratio-16x9">
      <iframe width="560" height="315"
              src={`https://goatembed.com/view?url=${encodeURIComponent(movie.video_preview)}`}
              allow="autoplay; encrypted-media; picture-in-picture;"
              referrerPolicy="no-referrer" allowFullScreen></iframe>
    </div>
  )
}

export default memo(MovieUpcomingPlayer)