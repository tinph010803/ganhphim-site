"use client"

import {commentProcessing, timeAgo} from "@/utils/helpers";
import CommentForm from "@/components/comment/Form";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setShowReplyForm, updateComment} from "@/redux/features/commentSlice";
import {memo, useEffect, useRef, useState} from "react";
import CommentApi from "@/api/comment.api";
import CommentVote from "@/components/comment/Vote";
import CommentActions from "@/components/comment/Actions";
import {getReviews} from "@/constants/reviews";
import {userAvatar} from "@/utils/image";
import UserName from "@/components/user/Name";
import {Spinner} from "react-bootstrap";

const CommentItem = ({comment, movie, isFocus = false}) => {
    const dispatch = useAppDispatch()
    const {showReplyForm} = useAppSelector(state => state.comment)
    const [repliesLoaded, setRepliesLoaded] = useState(false)
    const [isLoadingGetReplies, setIsLoadingGetReplies] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [showSpoil, setShowSpoil] = useState(false)
    const commentInputRef = useRef(null)

    const reviews = comment.reviews ? getReviews(comment.reviews.point) : null

    const handleReplyClick = (commentId) => {
        if (commentId !== showReplyForm) {
            dispatch(setShowReplyForm(commentId))
        } else {
            dispatch(setShowReplyForm(null))
        }
    }

    useEffect(() => {
        if (showReplyForm === comment._id && commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }, [showReplyForm])

    const getReplies = async () => {
        setIsLoadingGetReplies(true)
        const {result} = await CommentApi.replyList(comment._id)
        dispatch(updateComment({id: comment._id, updateData: {replies: result}}))
        setIsLoadingGetReplies(false)
    }

    const handleGetReplies = async () => {
        if (!repliesLoaded && !isLoadingGetReplies) {
            await getReplies()
            setRepliesLoaded(true)
        }
        setShowReplies(!showReplies)
    }

    const addReply = async (reply) => {
        dispatch(setShowReplyForm(null))
        const updateData = {total_children: 1, replies: [reply]}

        if (showReplies) {
            dispatch(updateComment({id: reply.parent_id, updateData}))
        } else {
            if (!repliesLoaded && comment.parent_id === null) {
                await getReplies()
            } else {
                dispatch(updateComment({id: reply.parent_id, updateData}))
            }
            setShowReplies(true)
            setRepliesLoaded(true)
        }
    }

    useEffect(() => {
        if (isFocus) {
            getReplies()
            setShowReplies(true)
            setRepliesLoaded(true)
        }
    }, [isFocus, comment._id])

    return (
        <div className={`d-item ${isFocus ? "mine" : ""} ${comment.is_pinned ? "d-item-pin" : ""}`}
             id={`cm-${comment._id}`}>
            <div className="user-avatar">
                <img src={userAvatar(comment.author)}/>
            </div>
            <div className="info">
                {comment.is_pinned && (<div className="stick">
                    <div className="line-center">
                        <i className="fa-solid fa-thumbtack"></i>
                        <span>Ghim bởi Rổ</span>
                    </div>
                </div>)}
                <div className="comment-header">
                    {reviews && <div className="rated">
                        <span>{reviews.icon}</span> {reviews.title}
                    </div>}
                    <UserName user={comment.author}/>
                    <div className="ch-logs">
                        <div className="c-time">{timeAgo(comment.created_at)}</div>
                    </div>
                    {(comment.season_number > 0 && comment.episode_number > 0 && !comment.is_reviews) &&
                        <span className="ch-for">P.{comment.season_number}<span>{comment.episode_number}</span></span>}
                </div>
                <div className={`text ${comment.is_spoil && !showSpoil ? 'text-spoil' : ''}`}>
                    {comment.mention_user && <span className="rep-sub">@{comment.mention_user.name}</span>}
                    <span dangerouslySetInnerHTML={{__html: commentProcessing(comment.content)}}></span>
                </div>
                {comment.is_spoil && <div className="spoil-toggle mt-2 small">
                    <a className="text-primary" onClick={() => setShowSpoil(!showSpoil)}>{showSpoil ? 'Ẩn' : 'Xem'}</a>
                </div>}
                <div className="comment-bottom line-center d-flex">
                    <CommentVote comment={comment}/>
                    <button type="button" className="btn btn-xs btn-basic btn-comment"
                            onClick={() => handleReplyClick(comment._id)}>
                        <i className="fa-solid fa-reply"></i>
                        <span>Trả lời</span>
                    </button>
                    <CommentActions id={comment._id} isPinned={comment.is_pinned}/>
                </div>
                {showReplyForm === comment._id && <div className="my-area my-area-sub reply-active">
                    <CommentForm movie={movie} parentId={comment.parent_id || comment._id} mentionId={comment.user_id}
                                 cbAddReply={addReply} commentInputRef={commentInputRef}/>
                </div>}
                {comment.total_children > 0 && <div className="replies-wrap">
                    <a className="text-primary replies-toggle" onClick={() => handleGetReplies(comment._id)}>
                        <i className={`fa-solid ${showReplies ? "fa-angle-up" : "fa-angle-down"} me-1`}></i>
                        {comment.total_children} bình luận {isLoadingGetReplies && <Spinner
                        className="ms-2"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    </a>
                    {(comment.replies && showReplies) && <div className="replies">
                        {comment.replies.map((reply) => {
                            return (
                                <CommentItem key={`cm-rl-${reply._id}`} comment={reply} movie={movie}/>
                            )
                        })}
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default memo(CommentItem)