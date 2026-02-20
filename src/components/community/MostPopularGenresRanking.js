"use client"

import {memo, useEffect, useState} from "react";
import GenreApi from "@/api/genre.api";
import {Modal} from "react-bootstrap";
import GenreItemRanking from "@/components/genre/ItemRanking";

const MostPopularGenresRanking = () => {
  const [mostPopularGenresRanking, setMostPopularGenresRanking] = useState([])
  const [showModal, setShowModal] = useState(false)

  const getMostPopularGenresRanking = async () => {
    try {
      const result = await GenreApi.mostPopularRanking()
      if (result) setMostPopularGenresRanking(result)
    } catch (error) {
    }
  }

  useEffect(() => {
    getMostPopularGenresRanking()
  }, [])

  return (
    <>
      <div className="it-col this-03">
        <div className="comm-title line-center">
          <i className="fa-solid fa-folder-plus ct-icon"></i>
          <span className="flex-grow-1">Thể loại Hot</span>
        </div>
        <div className="chart-list">
          {mostPopularGenresRanking.slice(0, 5).map(item => {
            return (
              <GenreItemRanking item={item} key={`gk-${item._id}`}/>
            )
          })}
          {mostPopularGenresRanking.length > 0 && <div className="item-more mt-2">
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
            <i className="fa-solid fa-folder-plus ct-icon"></i>
            <span className="flex-grow-1">Thể loại Hot</span>
          </div>
        </div>
        <div className="is-body">
          <div className="irt-table">
            <div className="it-col it-big this-03">
              <div className="chart-list">
                {mostPopularGenresRanking.map(item => {
                  return (
                    <GenreItemRanking item={item} key={`m-gk-${item._id}`}/>
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

export default memo(MostPopularGenresRanking)