"use client"

import {Modal, Spinner} from "react-bootstrap";
import {memo, useEffect, useRef, useState} from "react";
import ReviewsApi from "@/api/reviews.api";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {scrollToCommentSection, showToast} from "@/utils/helpers";
import {reviewsList} from "@/constants/reviews";
import {setShowModal} from "@/redux/features/reviewsSlice";
import {fetchCommentInfo, setCurTab} from "@/redux/features/commentSlice";

const MovieReviewsModal = ({movie, stats, reviewsInfo, setReviewsInfo}) => {
    const dispatch = useAppDispatch()
    const {loggedUser} = useAppSelector(state => state.auth)
    const {showModal} = useAppSelector(state => state.reviews)
    const [point, setPoint] = useState(0)
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const contentInputRef = useRef(null)

    const handleViewReviewsClick = () => {
        dispatch(setShowModal(false))
        scrollToCommentSection()

        dispatch(fetchCommentInfo(reviewsInfo.comment._id))
        dispatch(setCurTab("reviews"))
    }

    const handleReviewsClick = (point) => {
        if (reviewsInfo !== null) return
        setPoint(point)
    }

    const handleSendReviews = async () => {
        if (!isLoading) {
            if (loggedUser === null) {
                showToast({message: `Vui lòng đăng nhập để đánh giá.`, type: 'error'})
                return
            }

            if (point === 0) {
                showToast({message: `Vui lòng chọn 1 đánh giá.`, type: 'error'})
                return
            }

            setIsLoading(true)
            const {status, msg, result} = await ReviewsApi.send({
                movie_id: movie._id,
                point: point,
                content: contentInputRef.current.value,
            })

            setIsLoading(false)

            if (status) {
                showToast({message: msg, type: 'success'})
                dispatch(setShowModal(false))
                setReviewsInfo(result)
            }
        }
    }

    useEffect(() => {
        if (reviewsInfo) {
            setPoint(reviewsInfo.point)
            setContent(reviewsInfo.comment.content)
        }
    }, [reviewsInfo, contentInputRef.current]);

    return (
        <Modal centered={true} show={showModal} className="v-modal modal-md" onHide={(isOpen) => {
            dispatch(setShowModal(isOpen))
        }}>
            <button className="btn modal-close" onClick={() => dispatch(setShowModal(false))}>
                <i className="fa-solid fa-times"></i>
            </button>
            <div className="is-header mb-2">
                <h4 className="heading-sm text-center mb-0 ">{movie.title}</h4>
            </div>
            <div className="is-body mb-5">
                <div className="d-block text-center mb-4">
                    <div className="line-center">
                        <div className="ro-icon"></div>
                        <strong className="text-white">{stats?.pointAvg}</strong>
                        <span>/ {stats?.totalReviews} lượt đánh giá</span>
                    </div>
                </div>
                <div className="rate-emo">
                    {reviewsList().map(item => {
                        return (
                            <div className={`item-v ${point === item.point ? 'active' : ''}`}
                                 key={`reviews-${item.point}`}
                                 onClick={() => handleReviewsClick(item.point)}>
                                <div className="inc-icon">
                                    <img src={item.image}/>
                                </div>
                                <span>{item.title}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="rate-comment">
                    {reviewsInfo &&
                        <>
                            <div id="focus-comment" className="form-control v-form-control">{content}</div>
                            {reviewsInfo.comment.total_children > 0 &&
                                <div className="btn btn-xs btn-outline btn-rounded has-reply"><i
                                    className="fa-solid fa-comment text-primary"></i>{reviewsInfo.comment.total_children} trả
                                    lời</div>}
                        </>}
                    {reviewsInfo === null &&
                        <textarea className="form-control v-form-control" rows="3" cols="3" ref={contentInputRef}
                                  placeholder="Viết nhận xét về phim (tuỳ chọn)"></textarea>}
                </div>
            </div>
            <div className="is-footer gap-3">
                {reviewsInfo === null &&
                    <button type="button" className="btn btn-primary" onClick={() => handleSendReviews()}>
                        Gửi đánh giá
                        {isLoading && <Spinner
                            className="ms-2"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />}
                    </button>}
                {reviewsInfo &&
                    <button type="button" className="btn btn-primary" onClick={() => handleViewReviewsClick()}>Xem đánh
                        giá</button>}
                <button type="button" className="btn btn-light px-4"
                        onClick={() => dispatch(setShowModal(false))}>Đóng
                </button>
            </div>
        </Modal>
    )
}

export default memo(MovieReviewsModal)