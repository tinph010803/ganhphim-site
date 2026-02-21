"use client"

import {memo} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import {fetchHongKongMovies} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import LoadingElement from "@/components/loading/Element";
import Link from "next/link";

const HomeHongKong = () => {
    const dispatch = useAppDispatch()
    const {hongKongMovies} = useAppSelector(state => state.movie)

    useOnceWhen(true, () => {
        dispatch(fetchHongKongMovies())
    })

    if (hongKongMovies.length === 0) return <LoadingElement/>

    return (
        <div className="cards-row cards-slide wide effect-fade-in" id="hong-kong-movies">
            <div className="row-header">
                <h2 className="category-name">Điện Ảnh Hồng Kông bên hông Chợ Lớn</h2>
                <div className="cat-more">
                    <Link href="/quoc-gia/hong-kong" className="line-center">
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
                            nextEl: `#hong-kong-movies .sw-next`,
                            prevEl: `#hong-kong-movies .sw-prev`,
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
                        {hongKongMovies.map((item) => (
                            <SwiperSlide key={`hk-${item._id}`}>
                                <MovieItemStyle1 movie={item}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeHongKong)
