import {memo} from "react";

const MovieTooltipGenres = ({genres}) => {
  return (
    genres.map((genre, index) => (
      <div className="tag-topic" key={`tt-g-${genre._id}`}>{genre.name}</div>
    ))
  )
}

export default memo(MovieTooltipGenres)