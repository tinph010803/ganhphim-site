"use client"

import {memo} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import {fetchHorrorMovies} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import LoadingElement from "@/components/loading/Element";
import Link from "next/link";

const HomeHorror = () => {
    const dispatch = useAppDispatch()
    const {horrorMovies} = useAppSelector(state => state.movie)

    useOnceWhen(true, () => {
        dispatch(fetchHorrorMovies())
    })

    if (horrorMovies.length === 0) return <LoadingElement/>

    return (
        <div className="cards-row cards-slide wide effect-fade-in" id="horror-movies">
            <div className="row-header">
                <h2 className="category-name">Sợ xanh mặt nhưng vẫn phải coi, vì đời là trải nghiệm</h2>
                <div className="cat-more">
                    <Link href="/the-loai/kinh-di" className="line-center">
                        <span>Xem thêm</span>
                        <i className="fa-solid fa-angle-right"></i>
                    </Link>
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
                    <Swiper
                        modules={[Navigation]}
                        pagination={false}
                        navigation={{
                            nextEl: `#horror-movies .sw-next`,
                            prevEl: `#horror-movies .sw-prev`,
                        }}
                        slidesPerView={3}
                        spaceBetween={8}
                        breakpoints={{
                            520: {slidesPerView: 3, spaceBetween: 8},
                            768: {slidesPerView: 4, spaceBetween: 16},
                            1024: {slidesPerView: 5, spaceBetween: 16},
                            1280: {slidesPerView: 6, spaceBetween: 16},
                            1400: {slidesPerView: 7, spaceBetween: 16},
                            1600: {slidesPerView: 8, spaceBetween: 16},
                        }}
                    >
                        {horrorMovies.map((item) => (
                            <SwiperSlide key={`hr-${item._id}`}>
                                <MovieItemStyle1 movie={item}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeHorror)
