"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {Navigation} from "swiper/modules";
import CastApi from "@/api/cast.api";
import {memo, useEffect, useState} from "react";
import Link from "next/link";
import {castUrl} from "@/utils/url";
import {peopleAvatar} from "@/utils/image";

const HomeCasts = () => {
  const [casts, setCasts] = useState([])

  const getPopularCasts = async () => {
    const {result} = await CastApi.popular()
    setCasts(result)
  }

  useEffect(() => {
    getPopularCasts()
  }, []);

  return (
    <div className="cards-row cards-slide wide">
      <div className="row-header">
        <h3 className="category-name">Diễn viên được quan tâm</h3>
      </div>
      <div className="row-content">
        <div className="cards-slide-wrapper" id="home-casts">
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
                    nextEl: `#home-casts .sw-next`,
                    prevEl: `#home-casts .sw-prev`
                  }}
                  breakpoints={{
                    520: {slidesPerView: 4, spaceBetween: 12},
                    799: {slidesPerView: 5, spaceBetween: 16},
                    1121: {slidesPerView: 4, spaceBetween: 16},
                    1600: {slidesPerView: 5, spaceBetween: 24},
                  }}>
            {casts.map((item, index) => {
              return (
                <SwiperSlide key={`c-slide-${item._id}`}>
                  <div className="sw-actor">
                    <div className="item-duo">
                      <a href="detail.html" className="duo-thumb">
                        <img src="/images/thumbs/08.webp"/>
                      </a>
                      <a href="detail.html" className="duo-thumb">
                        <img src="/images/thumbs/09.webp"/>
                      </a>
                    </div>
                    <div className="h-item">
                      <Link href={castUrl(item)} className="v-actor">
                        <img src={peopleAvatar(item.profile_path)}/>
                      </Link>
                      <div className="info">
                        <h4 className="item-title lim-1"><a href={castUrl(item)} title={item.name}>{item.name}</a></h4>
                        <div className="info-line">
                          <div className="tag-small">Hàn Quốc</div>
                          <div className="tag-small">Nữ</div>
                          <div className="tag-small">35 tuổi</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default memo(HomeCasts)