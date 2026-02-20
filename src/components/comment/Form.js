"use client"

import SendIcon from "@/components/icons/Send";
import {memo, useState} from "react";
import {showToast} from "@/utils/helpers";
import {Spinner} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import CommentApi from "@/api/comment.api";
import {addComment} from "@/redux/features/commentSlice";

const CommentForm = ({movie, parentId = null, mentionId = null, cbAddReply = null, commentInputRef}) => {
  const dispatch = useAppDispatch()
  const [commentLength, setCommentLength] = useState(0)
  const [isSpoil, setIsSpoil] = useState(false)
  const [isSendingComment, setIsSendingComment] = useState(false)
  const {loggedUser} = useAppSelector(state => state.auth)
  const {curEpisode, curSeason} = useAppSelector(state => state.movie)
  const maxLength = 1000

  const countMessageLength = () => {
    setCommentLength(commentInputRef.current.value.length)
  }

  const handleSendComment = async () => {
    if (!loggedUser) {
        showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
        return
    }
    if (!isSendingComment) {
      if (commentInputRef.current.value.length > 0) {
        const data = {
          movie_id: movie._id,
          is_spoil: isSpoil,
          content: commentInputRef.current.value,
          parent_id: parentId,
          mention_id: mentionId
        }
        if (curEpisode && curSeason) {
          data.episode_number = curEpisode.episode_number
          data.season_number = curSeason.season_number
        }

        setIsSendingComment(true)
        const {msg, status, result} = await CommentApi.add(data)
        if (status) {
          showToast({message: msg, type: 'success'})
          commentInputRef.current.value = ""
          setCommentLength(0)
          setIsSpoil(false)
          if (cbAddReply) {
            cbAddReply(result)
          } else {
            dispatch(addComment(result))
          }
        } else {
          showToast({message: msg, type: 'error'})
        }
        setIsSendingComment(false)
      } else {
        showToast({message: "Vui lòng nhập bình luận.", type: 'error'})
      }
    }
  }

  return (
    <div className="textarea-wrap">
      <div className="ma-input">
        <textarea className="form-control v-form-control v-form-textarea" rows="4" cols="3" ref={commentInputRef}
                  onChange={countMessageLength} maxLength={maxLength}
                  placeholder="Viết bình luận"></textarea>
        <div className="chac-left">{commentLength} / {maxLength}</div>
      </div>
      <div className="line-center d-flex gap-3 ma-buttons">
        <div className="v-toggle v-toggle-min line-center">
          <div id="spoil-toggle" className={`toggle-x ${isSpoil ? 'on' : 'off'}`} onClick={() => setIsSpoil(!isSpoil)}>
            <span></span>
          </div>
          <div className="text">Tiết lộ?</div>
        </div>
        <div className="flex-grow-1"></div>
        <button className="btn btn-basic btn-submit" type="button" onClick={handleSendComment}>
          <span>Gửi</span>
          {!isSendingComment && <div className="inc-icon icon-20 ms-1">
            <SendIcon/>
          </div>}
          {isSendingComment && <Spinner
            className="ms-2"
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />}
        </button>
      </div>
    </div>
  )
}

export default memo(CommentForm)