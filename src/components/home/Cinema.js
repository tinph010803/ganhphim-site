"use client"

import {memo} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemStyle3 from "@/components/movie/item/Style3";
import {fetchCinemaMovies} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import LoadingElement from "@/components/loading/Element";
import Link from "next/link";

const HomeCinema = () => {
    const dispatch = useAppDispatch()
    const {cinemaMovies} = useAppSelector(state => state.movie)

    useOnceWhen(true, () => {
        dispatch(fetchCinemaMovies())
    })

    if (cinemaMovies.length === 0) return <LoadingElement/>

    return (
        <div className="cards-row cards-slide wide effect-fade-in" id="cinema-movies">
            <div className="row-header">
                <h2 className="category-name">Mãn Nhãn với Phim Chiếu Rạp</h2>
                <div className="cat-more">
                    <Link href="/phim-chieu-rap" className="line-center">
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
                            nextEl: `#cinema-movies .sw-next`,
                            prevEl: `#cinema-movies .sw-prev`,
                        }}
                        slidesPerView={2}
                        spaceBetween={8}
                        breakpoints={{
                            1024: {slidesPerView: 3, spaceBetween: 16},
                            1600: {slidesPerView: 4, spaceBetween: 16},
                        }}
                    >
                        {cinemaMovies.map((item) => (
                            <SwiperSlide key={`cm-${item._id}`}>
                                <MovieItemStyle3 movie={item}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeCinema)
