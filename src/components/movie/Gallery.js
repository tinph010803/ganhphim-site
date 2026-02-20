"use client"

import {memo, useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import Viewer from 'viewerjs'
import "viewerjs/src/css/viewer.css"
import {Modal} from "react-bootstrap";

const MovieGallery = ({movieId}) => {
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [showModalVideo, setShowModalVideo] = useState(false)
  const [video, setVideo] = useState(null)

  const getGallery = async () => {
    const result = await MovieApi.gallery(movieId)
    setVideos(result.videos)
    setImages(result.images)
  }

  const watchVideo = (item) => {
    setShowModalVideo(true)
    setVideo(item)
  }

  useEffect(() => {
    getGallery()
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      new Viewer(document.getElementById("image-gallery"))
    }
  }, [images]);

  return (
    <div className="cg-body-box is-gallery">
      <div className="box-body">
        <div className="heading-sm mb-3">Videos</div>
        {videos.length === 0 && (
          <div className="v-notice mb-3">
            <div className="inc-icon icon-notice">
              <img src="/images/icons/empty-box.svg"/>
            </div>
            <p className="mb-0">Đang cập nhật...</p>
          </div>
        )}
        {videos.length > 0 && (
          <div className="gallery-row is-video">
            {videos.map((item) => (
              <div className="item" key={`g-v-${item._id}`}>
                <a className="media-item" onClick={() => watchVideo(item)}>
                  <div className="play-button is-center"><i className="fa-solid fa-play"></i></div>
                  <img src={item.thumbnail}/>
                </a>
                <h4 className="media-title">{item.title}</h4>
              </div>
            ))}
          </div>
        )}
        <div className="heading-sm mb-3">Ảnh</div>
        {images.length === 0 && (
          <div className="v-notice mb-3">
            <div className="inc-icon icon-notice">
              <img src="/images/icons/empty-box.svg"/>
            </div>
            <p className="mb-0">Đang cập nhật...</p>
          </div>
        )}
        {images.length > 0 && (
          <div className="flexbin flexbin-margin" id="image-gallery">
            {images.map((item, index) => (
              <a className="media-item" key={`g-i-${item._id}`}>
                <img src={item.path} alt={`Image ${index}`}/>
              </a>
            ))}
          </div>
        )}
      </div>
      <Modal className="v-modal modal-trailer" centered={true} show={showModalVideo}
             onHide={() => setShowModalVideo(!showModalVideo)}>
        <button className="btn modal-close" aria-label="Close" onClick={() => setShowModalVideo(false)}>
          <i className="fa-solid fa-times"></i>
        </button>
        <div className="video-area">
          <div className="ratio ratio-16x9">
            {video && <video src={video.path} autoPlay={true} controls={true}></video>}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default memo(MovieGallery)