"use client"

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  addDislikeId,
  addLikeId,
  removeDislikeId,
  removeLikeId,
  updateComment,
  updateReply
} from "@/redux/features/commentSlice";
import CommentApi from "@/api/comment.api";
import {showToast} from "@/utils/helpers";

const CommentVote = ({comment}) => {
  const dispatch = useAppDispatch()
  const {loggedUser} = useAppSelector(state => state.auth)
  const {likeIds, dislikeIds} = useAppSelector(state => state.comment)

  const updateCommentInRedux = (updateData) => {
    if (comment.parent_id) {
      dispatch(updateReply({comment, updateData}))
    } else {
      dispatch(updateComment({id: comment._id, updateData}))
    }
  }

  const handleLikeClick = async () => {
      if (!loggedUser) {
          showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
          return
      }

    if (likeIds.indexOf(comment._id) >= 0) {
      dispatch(removeLikeId(comment._id))
      updateCommentInRedux({total_like: -1})
    } else {
      if (dislikeIds.indexOf(comment._id) >= 0) {
        updateCommentInRedux({total_like: 1, total_dislike: -1})
      } else {
        updateCommentInRedux({total_like: 1})
      }
      dispatch(addLikeId(comment._id))
    }

    await CommentApi.vote({comment_id: comment._id, type: 1})
  }

  const handleDislikeClick = async () => {
      if (!loggedUser) {
          showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
          return
      }

    if (dislikeIds.indexOf(comment._id) >= 0) {
      dispatch(removeDislikeId(comment._id))
      updateCommentInRedux({total_dislike: -1})
    } else {
      if (likeIds.indexOf(comment._id) >= 0) {
        updateCommentInRedux({total_like: -1, total_dislike: 1})
      } else {
        updateCommentInRedux({total_dislike: 1})
      }
      dispatch(addDislikeId(comment._id))
    }

    await CommentApi.vote({comment_id: comment._id, type: 2})
  }
  return (
    <div className="group-react line-center">
      <div className={`item item-up line-center ${likeIds.indexOf(comment._id) >= 0 ? 'active' : ''}`}
           onClick={handleLikeClick}>
        <i className="fa-solid fa-circle-up"></i>
        {comment.total_like > 0 && <span>{comment.total_like}</span>}
      </div>
      <div className={`item item-down line-center ${dislikeIds.indexOf(comment._id) >= 0 ? 'active' : ''}`}
           onClick={handleDislikeClick}>
        <i className="fa-solid fa-circle-down"></i>
        {comment.total_dislike > 0 && <span>{comment.total_dislike}</span>}
      </div>
    </div>
  )
}

export default CommentVote