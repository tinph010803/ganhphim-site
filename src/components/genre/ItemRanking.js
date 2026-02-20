import Link from "next/link";
import {genreUrl} from "@/utils/url";
import {memo} from "react";

const GenreItemRanking = ({item})=>{
  return (
    <div className="item">
      <div className="pos">{item.current_rank}.</div>
      {item.direction === "up" &&
        <div className="dev dev-up"><i className="fa-solid fa-arrow-trend-up"></i></div>}
      {item.direction === "down" &&
        <div className="dev dev-down"><i className="fa-solid fa-arrow-trend-down"></i></div>}
      {item.direction === "same" &&
        <div className="dev dev-stand"><i className="fa-solid fa-minus"></i></div>}
      <div className="topic-color" style={{backgroundColor: `rgb(116, 45, 75)`}}>
        <Link href={genreUrl(item)}>{item.name}</Link>
      </div>
    </div>
  )
}

export default memo(GenreItemRanking)