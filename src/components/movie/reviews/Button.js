"use client"

import {memo, useEffect, useState} from "react";
import MovieReviewsModal from "@/components/movie/reviews/Modal";
import ReviewsApi from "@/api/reviews.api";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {getTitleOfReviews} from "@/constants/reviews";
import {setShowModal} from "@/redux/features/reviewsSlice";
import useOnceWhen from "@/hooks/useOnceWhen";

const MovieReviewsButton = ({movie}) => {
  const dispatch = useAppDispatch()
  const [stats, setStats] = useState(null)
  const [reviewsInfo, setReviewsInfo] = useState(null)
  const {loggedUser} = useAppSelector(state => state.auth)

  const statsByMovie = async () => {
    const {result, status} = await ReviewsApi.statsByMovie(movie._id)
    if (status) setStats(result)
  }

  const infoByUser = async () => {
    const {result, status} = await ReviewsApi.infoByUser(movie._id)
    if (status) setReviewsInfo(result)
  }

  useEffect(() => {
    Promise.all([
      statsByMovie()
    ])
  }, [])

  useOnceWhen(loggedUser, () => {
    infoByUser()
  });

  if (stats)
    return (
      <>
        <div className="v-rating" onClick={() => dispatch(setShowModal(true))}>
          <div className="ro-rating">
            <div className="ro-icon"></div>
            <span className="point">{stats.pointAvg}</span>
            <span className="a-rate">Đánh giá</span>
          </div>
          {reviewsInfo && <div className="caption line-center">
            <i className="fa-solid fa-quote-left"></i><span>{getTitleOfReviews(reviewsInfo.point)}</span>
          </div>}
        </div>
        <MovieReviewsModal movie={movie} stats={stats} reviewsInfo={reviewsInfo} setReviewsInfo={setReviewsInfo}/>
      </>
    )
}

export default memo(MovieReviewsButton)