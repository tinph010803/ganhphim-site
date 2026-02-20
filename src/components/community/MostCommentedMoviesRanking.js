"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import MovieItemRanking from "@/components/movie/item/Ranking";
import {Modal} from "react-bootstrap";

const MostCommentedMoviesRanking = () => {
  const [mostCommentedMoviesRanking, setMostCommentedMoviesRanking] = useState([])
  const [showModal, setShowModal] = useState(false)

  const getMostCommentedMoviesRanking = async () => {
    try {
      const result = await MovieApi.mostCommentedRanking()
      if (result) setMostCommentedMoviesRanking(result)
    } catch (error) {
    }
  }

  useEffect(() => {
    getMostCommentedMoviesRanking()
  }, [])

  return (
    <>
      <div className="it-col this-01">
        <div className="comm-title line-center">
          <i className="fa-solid fa-clapperboard ct-icon"></i>
          <span className="flex-grow-1">Sôi nổi nhất</span>
        </div>
        <div className="chart-list">
          {mostCommentedMoviesRanking.slice(0, 5).map(item => {
            return (
              <MovieItemRanking key={`mcmr-${item._id}`} item={item}/>
            )
          })}
          {mostCommentedMoviesRanking.length > 0 && <div className="item-more mt-2">
            <a className="small" onClick={() => setShowModal(true)}>Xem thêm</a>
          </div>}
        </div>
      </div>
      <Modal className="v-modal d-modal" centered={true} show={showModal}
             onHide={() => setShowModal(!showModal)}>
        <button className="btn modal-close" aria-label="Close" onClick={() => setShowModal(!showModal)}>
          <i className="fa-solid fa-times"></i>
        </button>
        <div className="is-header mb-3">
          <div className="comm-title line-center m-0">
            <i className="fa-solid fa-clapperboard ct-icon"></i>
            <span className="flex-grow-1">Sôi nổi nhất</span>
          </div>
        </div>
        <div className="is-body">
          <div className="irt-table">
            <div className="it-col it-big">
              <div className="chart-list">
                {mostCommentedMoviesRanking.map(item => {
                  return (
                    <MovieItemRanking key={`m-mcmr-${item._id}`} item={item}/>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default memo(MostCommentedMoviesRanking)