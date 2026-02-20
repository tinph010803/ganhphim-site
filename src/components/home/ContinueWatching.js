"use client"

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemContinueWatching from "@/components/movie/item/ContinueWatching";
import {fetchCwMoviesHome} from "@/redux/features/movieSlice";
import {userContinueWatchingUrl} from "@/utils/url";
import LoadingElement from "@/components/loading/Element";
import useOnceWhen from "@/hooks/useOnceWhen";
import CustomLink from "@/components/shared/CustomLink";

const HomeContinueWatching = () => {
  const dispatch = useAppDispatch()
  const {loggedUser} = useAppSelector(state => state.auth)
  const {cwMoviesHome, cwMoviesListLoading} = useAppSelector(state => state.movie)

  useOnceWhen(loggedUser,()=>{
    dispatch(fetchCwMoviesHome({}))
  })

  if (cwMoviesListLoading) return <LoadingElement/>

  if (cwMoviesHome.length > 0) {
    return (
      <div className="cards-row cards-slide wide effect-fade-in" id="cw">
        <div className="row-header">
          <h3 className="category-name">Xem tiếp của bạn</h3>
          <div className="cat-more">
            <CustomLink href={userContinueWatchingUrl()} className="line-center">
              <span>Xem thêm</span>
              <i className="fa-solid fa-angle-right"></i>
            </CustomLink>
          </div>
        </div>
        <div className="row-content">
          <div className="cards-slide-wrapper">
            <div className="sw-navigation">
              <button type="button" className="sw-button sw-next">
                <SwiperNextIcon/>
              </button>
              <button type="button" className="sw-button sw-prev">
                <SwiperPrevIcon/>
              </button>
            </div>
            <Swiper modules={[Navigation]}
                    pagination={false}
                    navigation={{
                      nextEl: `#cw .sw-next`,
                      prevEl: `#cw .sw-prev`
                    }}
                    slidesPerView={2}
                    spaceBetween={8}
                    breakpoints={{
                      520: {slidesPerView: 3, spaceBetween: 8},
                      768: {slidesPerView: 4, spaceBetween: 16},
                      1280: {slidesPerView: 6, spaceBetween: 16},
                      1400: {slidesPerView: 7, spaceBetween: 16},
                    }}>
              {cwMoviesHome.map((item, index) => (
                <SwiperSlide key={`m-cw-${item._id}`}>
                  <MovieItemContinueWatching movie={item}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    )
  }
}

export default memo(HomeContinueWatching)