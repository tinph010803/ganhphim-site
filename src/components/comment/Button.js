"use client"

import {scrollToCommentSection} from "@/utils/helpers";
import CommentIcon from "@/components/icons/Comment";

const MovieCommentButton = ({page = "detail"}) => {
  if (page === "detail")
    return (
      <div className="item item-comment">
        <a className="item-v" onClick={scrollToCommentSection}>
          <div className="inc-icon icon-16">
            <CommentIcon/>
          </div>
          <span>Bình luận</span>
        </a>
      </div>
    )

  if (page === "watch")
    return (
      <a className="item-v item-comment" onClick={scrollToCommentSection}>
        <div className="inc-icon icon-20">
          <CommentIcon/>
        </div>
        <span>Bình luận</span>
      </a>
    )
}

export default MovieCommentButton