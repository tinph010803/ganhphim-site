"use client"

// Import Swiper React components
import {memo, useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Thumbs, EffectFade} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade'
import MovieItemTopSlide from "@/components/movie/item/TopSlide";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  setTopSlideActiveIndex,
  setTopSlideShowReplayBtn,
  setTopSlideShowVideoPreview,
  toggleEnableVideoPreviewSound
} from "@/redux/features/appSlice";
import {isMobile} from 'react-device-detect';
import {fetchHotMovies} from "@/redux/features/movieSlice";
import MovieBackdrop from "@/components/movie/images/Backdrop";

const VideoControls = memo(() => {
  const dispatch = useAppDispatch()
  const {enableVideoPreviewSound, topSlideShowReplayBtn, topSlideShowVideoPreview} = useAppSelector(state => state.app)

  const handleReplayClick = () => {
    dispatch(setTopSlideShowVideoPreview(true))
    dispatch(setTopSlideShowReplayBtn(false))
  }

  return (
    <>
      {(topSlideShowVideoPreview && !topSlideShowReplayBtn) &&
        <div className={`btn btn-lg btn-circle btn-outline sound-mute ${!enableVideoPreviewSound ? 'muted' : ''}`}
             onClick={() => dispatch(toggleEnableVideoPreviewSound())}>
          <i className="fa-solid fa-volume-high"></i>
        </div>}
      {(!topSlideShowVideoPreview && topSlideShowReplayBtn) &&
        <div className={`btn btn-lg btn-circle btn-outline sound-mute`}
             onClick={handleReplayClick}>
          <i className="fa-solid fa-rotate-right"></i>
        </div>}
    </>
  )
})

const TopSlide = () => {
  const dispatch = useAppDispatch()
  const {hotMovies} = useAppSelector(state => state.movie)
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    if (hotMovies.length === 0) {
      dispatch(fetchHotMovies())
    }
  }, [])

  const handleSlideChange = (swiper) => {
    dispatch(setTopSlideShowReplayBtn(false))
    dispatch(setTopSlideActiveIndex(swiper.realIndex))
    const activeItem = hotMovies[swiper.realIndex]
    if (activeItem.video_preview && !isMobile) {
      // setTimeout(() => {
      dispatch(setTopSlideShowVideoPreview(true))
      // }, 1500)
    } else {
      dispatch(setTopSlideShowVideoPreview(false))
    }
  }

  if (hotMovies.length > 0)
    return (
      <div id="top_slide">
        <div className="slide-wrapper top-slide-wrap">
          <Swiper
            modules={[Thumbs, EffectFade]}
            thumbs={{swiper: thumbsSwiper}}
            loop={true}
            spaceBetween={0}
            navigation={false}
            onRealIndexChange={handleSlideChange}
            className="top-slide-main"
            keyboard={{enabled: true}}
            effect={`fade`}
            lazy={"true"}
          >
            {hotMovies.map((item, index) => (
              <SwiperSlide key={`top-slide-${item._id}`}>
                <MovieItemTopSlide item={item} index={index}/>
              </SwiperSlide>
            ))}
          </Swiper>
          <VideoControls/>
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            watchSlidesProgress={true}
            className="top-slide-small"
            // loop={true}
            spaceBetween={5}
            slidesPerView={6}
          >
            {hotMovies.map((item, index) => (
              <SwiperSlide key={`thumb-top-slide-${item._id}`}>
                  <MovieBackdrop movie={item} size="150-0"/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    )
}

export default memo(TopSlide);