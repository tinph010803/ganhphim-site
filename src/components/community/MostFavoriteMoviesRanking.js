"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import MovieItemRanking from "@/components/movie/item/Ranking";
import {Modal} from "react-bootstrap";

const MostFavoriteMoviesRanking = () => {
  const [mostFavoriteMoviesRanking, setMostFavoriteMoviesRanking] = useState([])
  const [showModal, setShowModal] = useState(false)

  const getMostFavoriteMoviesRanking = async () => {
    try {
      const result = await MovieApi.mostFavoriteRanking()
      if (result) setMostFavoriteMoviesRanking(result)
    } catch (error) {
    }
  }

  useEffect(() => {
    getMostFavoriteMoviesRanking()
  }, [])

  return (
    <>
      <div className="it-col this-01">
        <div className="comm-title line-center">
          <i className="fa-solid fa-heart-circle-check ct-icon"></i>
          <span className="flex-grow-1">Yêu thích nhất</span>
        </div>
        <div className="chart-list">
          {mostFavoriteMoviesRanking.slice(0, 5).map(item => {
            return (
              <MovieItemRanking key={`mfmr-${item._id}`} item={item}/>
            )
          })}
          {mostFavoriteMoviesRanking.length > 0 && <div className="item-more mt-2">
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
            <i className="fa-solid fa-heart-circle-check ct-icon"></i>
            <span className="flex-grow-1">Yêu thích nhất</span>
          </div>
        </div>
        <div className="is-body">
          <div className="irt-table">
            <div className="it-col it-big">
              <div className="chart-list">
                {mostFavoriteMoviesRanking.map(item => {
                  return (
                    <MovieItemRanking key={`m-mfmr-${item._id}`} item={item}/>
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

export default memo(MostFavoriteMoviesRanking)