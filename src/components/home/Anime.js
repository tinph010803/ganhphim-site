"use client"

import {memo, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {EffectFade, Thumbs} from "swiper/modules";
import MovieItemStyle2 from "@/components/movie/item/Style2";
import MovieImagesPoster from "@/components/movie/images/Poster";
import {fetchAnimeMovies} from "@/redux/features/movieSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import LoadingElement from "@/components/loading/Element";
import Link from "next/link";

const HomeAnime = () => {
    const dispatch = useAppDispatch()
    const {animeMovies} = useAppSelector(state => state.movie)
    const [thumbsSwiper, setThumbsSwiper] = useState(null)

    useOnceWhen(true, () => {
        dispatch(fetchAnimeMovies())
    })

    if (animeMovies.length === 0) return <LoadingElement/>

    return (
        <div id="home-anime" className="effect-fade-in">
            <div className="cards-row big-slide wide">
                <div className="row-header">
                    <h2 className="category-name">Kho Tàng Hoạt Hình Mới Nhất</h2>
                    <div className="cat-more">
                        <Link href="/the-loai/hoat-hinh" className="line-center">
                            <span>Xem thêm</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </Link>
                    </div>
                </div>
                <div className="row-content">
                    <div className="slide-wrapper big-slide-wrapper">
                        <Swiper
                            modules={[Thumbs, EffectFade]}
                            thumbs={{swiper: thumbsSwiper}}
                            loop={true}
                            spaceBetween={0}
                            navigation={false}
                            className="top-slide-main"
                            effect="fade"
                        >
                            {animeMovies.map((item) => (
                                <SwiperSlide key={`an-slide-${item._id}`}>
                                    <MovieItemStyle2 movie={item}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            modules={[Thumbs]}
                            watchSlidesProgress
                            onSwiper={setThumbsSwiper}
                            className="top-slide-small"
                            loop={false}
                            spaceBetween={0}
                            slidesPerView={animeMovies.length}
                        >
                            {animeMovies.map((item) => (
                                <SwiperSlide key={`an-thumb-${item._id}`}>
                                    <div className="v-thumbnail">
                                        <MovieImagesPoster movie={item} size="100-0"/>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeAnime)
