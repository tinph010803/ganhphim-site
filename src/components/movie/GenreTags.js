import {genreUrl} from "@/utils/url";
import {memo} from "react";

const MovieGenreTags = ({genres, position=''}) => {
  return (
    genres.map((item, index) => (
      <a className="tag-topic" key={`${position}-m-g-slide-${item._id}`} href={genreUrl(item)}>{item.name}</a>
    ))
  )
}

export default memo(MovieGenreTags)