"use client"

import {memo, useEffect, useState} from "react";
import CommentApi from "@/api/comment.api";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";
import {movieDetailUrl} from "@/utils/url";
import {userAvatar} from "@/utils/image";
import {commentProcessing} from "@/utils/helpers";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import MovieImagesPoster from "@/components/movie/images/Poster";
import Link from "next/link";
import UserName from "@/components/user/Name";

const TopComments = () => {
  const [comments, setComments] = useState([])

  const getTopComments = async () => {
    try {
      const {result} = await CommentApi.topComments()
      setComments(result)
    } catch (error) {
    }
  }

  useEffect(() => {
    getTopComments()
  }, []);

  if (comments.length > 0)
    return (
      <div className="top-discuss">
        <div className="comm-title line-center">
          <i className="fa-solid fa-medal ct-icon"></i>
          <span>Top bình luận</span>
        </div>
        <div className="td-list">
          <div id="id-top-discuss" className="top-discuss-wrapper">
            <div className="sw-navigation">
              <button type="button" className="sw-button sw-next">
                <SwiperNextIcon/>
              </button>
              <button type="button" className="sw-button sw-prev">
                <SwiperPrevIcon/>
              </button>
            </div>
            <Swiper modules={[Navigation,Autoplay]}
                    pagination={false}
                    navigation={{
                      nextEl: `#id-top-discuss .sw-next`,
                      prevEl: `#id-top-discuss .sw-prev`
                    }}
                    loop={true}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                    }}
                    slidesPerView={3}
                    spaceBetween={8}
                    breakpoints={{
                      520: {slidesPerView: 3, spaceBetween: 8},
                      // 768: {slidesPerView: 4, spaceBetween: 16},
                      // 1024: {slidesPerView: 5, spaceBetween: 16},
                      1280: {slidesPerView: 4, spaceBetween: 16},
                      1400: {slidesPerView: 5, spaceBetween: 16},
                      1600: {slidesPerView: 6, spaceBetween: 16},
                    }}>
              {comments.map((item, index) => (
                <SwiperSlide key={`ct-slide-${item._id}`}>
                  <div className="d-item td-d-item">
                    <div className="di-poster">
                      <MovieImagesPoster movie={item.movie}/>
                    </div>
                    <div className="di-v">
                      <div className="user-avatar">
                        <img src={userAvatar(item.author)} alt={item.author.name}/>
                      </div>
                      <div className="info">
                        <div className="comment-header">
                          <UserName user={item.author}/>
                        </div>
                        <div className="text lim-2">
                          {commentProcessing(item.content, false)}
                        </div>
                        <div className="comment-bottom line-center gap-3 d-flex">
                          <div className="item item-up line-center">
                            <i className="fa-solid fa-circle-up"></i>
                            <span>{item.total_like}</span>
                          </div>
                          <div className="item item-down line-center">
                            <i className="fa-solid fa-circle-down"></i>
                            <span>{item.total_dislike}</span>
                          </div>
                          <div className="item item-rep line-center">
                            <i className="fa-solid fa-message"></i>
                            <span>{item.total_children}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-thumb">
                      <Link href={`${movieDetailUrl(item.movie)}?cid=${item._id}`} className="v-thumbnail" title={item.movie.title}>
                        <MovieImagesPoster movie={item.movie}/>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    )
}

export default memo(TopComments)