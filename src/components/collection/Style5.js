"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {memo, useEffect, useState} from "react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import MovieItemStyle5 from "@/components/movie/item/Style5";
import {shuffle} from "lodash";
import Link from "next/link";
import {collectionUrl} from "@/utils/url";

const CollectionStyle5 = ({collection}) => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    setMovies(collection.random_data ? shuffle(collection.movies) : collection.movies)
  }, [collection]);

  return (
    <div id={`collection-${collection._id}`}>
      <div className="cards-row cards-slide wide">
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
                    slidesPerView={2}
                    spaceBetween={8}
                    pagination={false}
                    navigation={{
                      nextEl: `#collection-${collection._id} .sw-next`,
                      prevEl: `#collection-${collection._id} .sw-prev`
                    }}
                    breakpoints={{
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                      1600: {
                        slidesPerView: 5,
                        spaceBetween: 16,
                      }
                    }}>
              {movies.map((item, index) => (
                <SwiperSlide key={`m-slide-${item._id}`}>
                  <MovieItemStyle5 movie={item}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CollectionStyle5)