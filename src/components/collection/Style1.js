"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import MovieItemStyle5 from "@/components/movie/item/Style5";
import {memo, useEffect, useState} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {shuffle} from "lodash";
import {collectionUrl} from "@/utils/url";
import AdsBannerPoster from "@/components/ads/BannerPoster";
import {useAppSelector} from "@/hooks/redux";
import CustomLink from "@/components/shared/CustomLink";

const CollectionStyle1 = ({collection, index}) => {
    const [movies, setMovies] = useState([])
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const {configAds} = useAppSelector(s => s.app)

    useEffect(() => {
        setMovies(collection.random_data ? shuffle(collection.movies) : collection.movies)
    }, [collection]);

    return (
        <div id={`collection-${collection._id}`}>
            <div className="row-topic">
                <div className="intro">
                    <div className="heading-md text-gradient mb-0"
                         style={{background: `linear-gradient(235deg, rgb(255,255,255) 30%, ${collection.color || '#aaa'} 130%)`}}>
                        {collection.name}
                    </div>
                    <div className="info">
                        <CustomLink href={collection.path || collectionUrl(collection)} className="line-center">
                            <span>Xem toàn bộ</span>
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
                                    nextEl: `#collection-${collection._id} .sw-next`,
                                    prevEl: `#collection-${collection._id} .sw-prev`
                                }}
                                slidesPerView={2}
                                spaceBetween={8}
                                breakpoints={{
                                    768:  {slidesPerView: 2, spaceBetween: 12},
                                    1024: {slidesPerView: 3, spaceBetween: 16},
                                    1400: {slidesPerView: 4, spaceBetween: 16},
                                    1600: {slidesPerView: 5, spaceBetween: 16},
                                }}>
                            {movies.flatMap((item, mIndex) => {
                                const slides = [
                                    <SwiperSlide key={`m-slide-${item._id}`}>
                                        <MovieItemStyle5 movie={item}/>
                                    </SwiperSlide>
                                ];

                                if (index < 4 && mIndex === 2 && !isLoadingUserInfo && !loggedUser?.is_vip && configAds) {
                                    slides.push(
                                        <SwiperSlide key={`ad-${collection._id}`}>
                                            <AdsBannerPoster page="home" position={`poster_${index}`}/>
                                        </SwiperSlide>
                                    );
                                }

                                return slides;
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(CollectionStyle1)