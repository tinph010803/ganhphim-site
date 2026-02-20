"use client"

import CommentIcon from "@/components/icons/Comment";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import CommentForm from "@/components/comment/Form";
import CommentUserPanel from "@/components/comment/UserPanel";
import {memo, useEffect, useRef} from "react";
import {
    fetchCommentInfo,
    fetchComments,
    fetchMoreComments,
    fetchVoteList, setCommentFocus,
    setComments,
    setCurTab
} from "@/redux/features/commentSlice";
import CommentItem from "@/components/comment/Item";
import LoadingElement from "@/components/loading/Element";
import {Spinner} from "react-bootstrap";
import {playerPostMessage, scrollToCommentSection} from "@/utils/helpers";
import {useSearchParams} from "next/navigation";
import useOnceWhen from "@/hooks/useOnceWhen";
import AdsComment from "@/components/ads/Comment";

const MovieCommentWidget = ({movie, page = "detail"}) => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const {loggedUser} = useAppSelector(state => state.auth)
    const {curEpisode, curSeason} = useAppSelector(state => state.movie)
    const {
        comments,
        total_comments,
        hasMore,
        isLoading,
        curTab,
        commentFocus,
        isLoadingMore
    } = useAppSelector(state => state.comment)
    const commentInputRef = useRef(null)

    useEffect(() => {
        const handleTimeClick = (item) => {
            window.scrollTo(0, 0)
            playerPostMessage({
                event: "web_seek",
                param: {time: item.getAttribute("data-time")}
            })
        }

        if (page === "watch") {
            document.querySelectorAll('.seek-time').forEach(item => {
                item.addEventListener('click', () => {
                    handleTimeClick(item)
                })
            })
        }

        return () => {
            document.querySelectorAll('.seek-time').forEach(item => {
                item.removeEventListener('click', () => {
                    handleTimeClick(item)
                })
            })
        }
    }, [comments]);

    useEffect(() => {
        if (commentFocus) {
            dispatch(setComments(comments.filter(el => el._id !== commentFocus._id)))
            const fcid = searchParams.get("fcid")
            if (fcid) {
                const el = document.getElementById(`cm-${fcid}`);
                if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    el.classList.add('d-item-pin')
                }
            }
        }
    }, [commentFocus])

    const getComments = async () => {
        const filter = {movie_id: movie._id, is_reviews: curTab === "reviews" ? 1 : 0}
        if (page === "watch") {
            if (movie.type !== 1) {
                if (curEpisode && curSeason) {
                    if (filter.is_reviews === 0) {
                        filter.episode_number = curEpisode.episode_number
                        filter.season_number = curSeason.season_number
                    }
                    dispatch(fetchComments(filter))
                }
            } else {
                dispatch(fetchComments(filter))
            }
        } else {
            dispatch(fetchComments(filter))
        }
    }

    useOnceWhen(loggedUser, () => {
        dispatch(fetchVoteList(movie._id))
    });

    useEffect(() => {
        const cid = searchParams.get("cid")
        if (cid) {
            scrollToCommentSection()
            dispatch(fetchCommentInfo(cid))
        } else {
            dispatch(setCommentFocus(null))
        }
    }, [searchParams]);

    useEffect(() => {
        getComments()
    }, [curTab, curEpisode])

    const loadMoreComments = async () => {
        const filter = {
            movie_id: movie._id,
            is_reviews: curTab === "reviews" ? 1 : 0
        }
        if (curEpisode && curSeason) {
            filter.episode_number = curEpisode.episode_number
            filter.season_number = curSeason.season_number
        }
        const lastComment = comments[comments.length - 1]
        filter.after_time = lastComment.created_at
        dispatch(fetchMoreComments(filter))
    }

    return (
        <div id="comment-area" className="child-box child-discuss">
            <div className="child-header">
                <div className="inc-icon">
                    <CommentIcon/>
                </div>
                <span>Bình luận {total_comments > 0 ? `(${total_comments})` : ''}</span>
                <div className="model-tabs actor-tabs">
                    <a className={`item ${curTab === "comments" ? "active" : ""}`}
                       onClick={() => dispatch(setCurTab("comments"))}>Bình
                        luận</a>
                    <a className={`item ${curTab === "reviews" ? "active" : ""}`}
                       onClick={() => dispatch(setCurTab("reviews"))}>Đánh
                        giá</a>
                </div>
            </div>
            <div className="child-content">
                <div className="discuss-wrap">
                    {(curTab === "comments" && !loggedUser?.is_shared) && <div className="my-area">
                        <CommentUserPanel loggedUser={loggedUser}/>
                        <CommentForm movie={movie} commentInputRef={commentInputRef}/>
                    </div>}
                    <div className="discuss-list">
                        {isLoading && <LoadingElement/>}
                        {(commentFocus && curTab === "comments") &&
                            <CommentItem comment={commentFocus} movie={movie} isFocus={true}/>}
                        {comments.flatMap((comment, index) => {
                            const items = [
                                <CommentItem key={`cm-${comment._id}`} comment={comment} movie={movie}/>
                            ]

                            if (index === 2) items.push(<AdsComment key={`cm-sp`}/>)

                            return items
                        })}
                        {hasMore && <div className="d-item py-3 more">
                            <a className="primary-text" onClick={() => loadMoreComments()}>Xem thêm bình luận...
                                {isLoadingMore && <Spinner
                                    className="ms-2"
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />}</a>
                        </div>}
                    </div>
                    {(comments.length === 0 && !isLoading && !commentFocus && curTab === "comments") &&
                        <div className="v-notice mt-3">
                            <div className="inc-icon icon-notice">
                                <img src="/images/icons/comment.svg"/>
                            </div>
                            <p className="mb-0">Chưa có bình luận nào</p>
                        </div>}
                    {(comments.length === 0 && !isLoading && curTab === "reviews") && <div className="v-notice mt-3">
                        <div className="inc-icon icon-notice">
                            <img src="/images/icons/comment.svg"/>
                        </div>
                        <p className="mb-0">Chưa có đánh giá nào</p>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default memo(MovieCommentWidget)