"use client"

import {memo} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemStyle4 from "@/components/movie/item/Style4";
import {fetchHotSingles} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import LoadingElement from "@/components/loading/Element";
import Link from "next/link";

const HomeTop10Singles = () => {
    const dispatch = useAppDispatch()
    const {hotSingles} = useAppSelector(state => state.movie)

    useOnceWhen(true, () => {
        dispatch(fetchHotSingles())
    })

    if (hotSingles.length === 0) return <LoadingElement/>

    return (
        <div className="cards-row cards-slide wide effect-fade-in" id="top10-singles">
            <div className="row-header">
                <h2 className="category-name">Top 10 phim lẻ hôm nay</h2>
                <div className="cat-more">
                    <Link href="/phim-le" className="line-center">
                        <span>Xem thêm</span>
                        <i className="fa-solid fa-angle-right"></i>
                    </Link>
                </div>
            </div>
            <div className="row-content">
                <div className="cards-slide-wrapper top-up">
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
                            nextEl: `#top10-singles .sw-next`,
                            prevEl: `#top10-singles .sw-prev`,
                        }}
                        breakpoints={{
                            420: {slidesPerView: 2, spaceBetween: 8},
                            768: {slidesPerView: 3, spaceBetween: 16},
                            1024: {slidesPerView: 4, spaceBetween: 16},
                            1280: {slidesPerView: 5, spaceBetween: 16},
                            1600: {slidesPerView: 6, spaceBetween: 16},
                        }}
                    >
                        {hotSingles.map((item, index) => (
                            <SwiperSlide key={`t10s-${item._id}`}>
                                <MovieItemStyle4 movie={item} index={index}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeTop10Singles)
