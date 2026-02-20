"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {memo, useEffect, useState} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import MovieItemStyle4 from "@/components/movie/item/Style4";
import {shuffle} from "lodash";
import Link from "next/link";
import {collectionUrl} from "@/utils/url";

const CollectionStyle4 = ({collection}) => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    setMovies(collection.random_data ? shuffle(collection.movies) : collection.movies)
  }, [collection]);

  return (
    <div id={`collection-${collection._id}`}>
      <div className="cards-row cards-slide wide">
        <div className="row-header">
          <h2 className="category-name">{collection.name}</h2>
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
            <Swiper modules={[Navigation]}
                    pagination={false}
                    navigation={{
                      nextEl: `#collection-${collection._id} .sw-next`,
                      prevEl: `#collection-${collection._id} .sw-prev`
                    }}
                    breakpoints={{
                      420: {
                        slidesPerView: 2,
                        spaceBetween: 8,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                      },
                      1280: {
                        slidesPerView: 5,
                        spaceBetween: 16,
                      },
                      1600: {
                        slidesPerView: 6,
                        spaceBetween: 16,
                      }
                    }}>
              {movies.map((item, index) => (
                <SwiperSlide key={`m-slide-${item._id}`}>
                  <MovieItemStyle4 movie={item} index={index}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CollectionStyle4)