"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import {EffectFade, Thumbs} from "swiper/modules";
import {moviePoster} from "@/utils/image";
import {memo, useEffect, useState} from "react";
import MovieItemStyle2 from "@/components/movie/item/Style2";
import {shuffle} from "lodash";
import MovieImagesPoster from "@/components/movie/images/Poster";
import Link from "next/link";
import {collectionUrl} from "@/utils/url";

const CollectionStyle2 = ({collection}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [movies, setMovies] = useState([])

    useEffect(() => {
        setMovies(collection.random_data ? shuffle(collection.movies) : collection.movies)
    }, [collection]);

    if (movies.length > 0)
        return (
            <div id={`collection-${collection._id}`}>
                <div className="cards-row big-slide wide">
                    <div className="row-header">
                        <h2 className="category-name">{collection.name}</h2>
                        {collection.type === 2 && <div className="cat-more">
                            <Link href={collectionUrl(collection)} className="line-center">
                                <span>Xem thêm</span>
                                <i className="fa-solid fa-angle-right"></i>
                            </Link>
                        </div>}
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
                                {movies.map((item, index) => (
                                    <SwiperSlide key={`m-slide-${item._id}`}>
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
                                slidesPerView={movies.length}
                            >
                                {movies.map((item, index) => (
                                    <SwiperSlide key={`mt-slide-${item._id}`}>
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

export default memo(CollectionStyle2)