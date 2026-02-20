"use client"

import {movieBackdrop, movieTitle} from "@/utils/image";
import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl, movieWatchUrl} from "@/utils/url";
import MovieGenreTags from "@/components/movie/GenreTags";
import MovieFavoriteButton from "@/components/movie/favorite/Button";
import InfoIcon from "@/components/icons/Info";
import {memo, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setTopSlideShowReplayBtn, setTopSlideShowVideoPreview} from "@/redux/features/appSlice";
import MovieInfoTags from "@/components/movie/InfoTags";

const MovieItemTopSlide = ({item, index}) => {
  const dispatch = useAppDispatch()
  const {
    enableVideoPreviewSound,
    topSlideShowVideoPreview,
    topSlideActiveIndex,
    tooltipItem
  } = useAppSelector(state => state.app)
  const videoRef = useRef(null)

  const [backdrop, setBackdrop] = useState(null)

  useEffect(() => {
    if (videoRef.current) {
      if (topSlideShowVideoPreview && index === topSlideActiveIndex) {
        try {
          if (tooltipItem) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
        } catch (e) {
          console.error("Error playing video:", e);
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Đặt lại thời gian về 0
      }
    }
  }, [topSlideShowVideoPreview, videoRef, tooltipItem, topSlideActiveIndex])

  useEffect(() => {
    const _backdrop = movieBackdrop(item.images.backdrops)
    setBackdrop(_backdrop)

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = ''; // Clear source
        videoRef.current.load();
      }
    };
  }, [])

  const handleVideoPreviewEnded = () => {
    dispatch(setTopSlideShowVideoPreview(false))
    dispatch(setTopSlideShowReplayBtn(true))
  }

  if (backdrop)
    return (
      <div className="slide-elements">
        <CustomLink href={movieDetailUrl(item)} className="slide-url"></CustomLink>
        <div className="background-fade" style={{backgroundImage: `url(${backdrop})`}}></div>
        <div className="cover-fade">
          <div className="cover-image">
            {topSlideShowVideoPreview &&
              <video ref={videoRef} muted={!enableVideoPreviewSound} className={`backdrop-video fade-in visible`}
                     onEnded={handleVideoPreviewEnded}>
                <source src={item.video_preview} type="video/mp4"/>
              </video>}
            <img className={`fade-in ${!topSlideShowVideoPreview ? 'visible' : ''}`}
                 src={backdrop} title={item.title} loading="lazy"/>
          </div>
        </div>
        <div className="safe-area">
          <div className="slide-content">
            <div className="media-item">
              {item.images.titles.length > 0 && <>
                <div className="media-title-image">
                  <CustomLink href={movieDetailUrl(item)} title={item.title}>
                    <img src={movieTitle(item.images.titles)} alt={item.title}/>
                  </CustomLink>
                </div>
                <h3 className="media-title" style={{display: "none"}}>
                  <CustomLink href={movieDetailUrl(item)} title={item.title} prefetch={false}>{item.title}</CustomLink>
                </h3>
              </>}
              {item.images.titles.length === 0 && <h3 className="media-title">
                <CustomLink href={movieDetailUrl(item)} title={item.title} prefetch={false}>{item.title}</CustomLink>
              </h3>}
              <h3 className="media-alias-title">
                <CustomLink href={movieDetailUrl(item)} title={item.english_title} prefetch={false}>{item.english_title}</CustomLink>
              </h3>
              <MovieInfoTags movie={item}/>
              <div className="hl-tags mb-4">
                <MovieGenreTags genres={item.genres} position={`m-${item._id}`}/>
              </div>
              <div className="description lim-3">
                {item.overview}
              </div>
              <div className="touch">
                <CustomLink href={movieWatchUrl(item)} className="button-play"><i className="fa-solid fa-play"></i></CustomLink>
                <div className="touch-group">
                  <MovieFavoriteButton position="swiper" movieId={item._id}/>
                  <CustomLink className="item" href={movieDetailUrl(item)} prefetch={false}>
                    <div className="inc-icon icon-20">
                      <InfoIcon/>
                    </div>
                  </CustomLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default memo(MovieItemTopSlide)