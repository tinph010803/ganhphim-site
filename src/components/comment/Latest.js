"use client"

import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import CommentApi from "@/api/comment.api";
import {memo, useEffect, useState} from "react";
import {userAvatar} from "@/utils/image";
import {movieDetailUrl} from "@/utils/url";
import {commentProcessing} from "@/utils/helpers";
import UserName from "@/components/user/Name";

const LatestComments = () => {
    const [comments, setComments] = useState([])

    const getLatestComments = async () => {
        try {
            const {result} = await CommentApi.latestComments()
            setComments(result)
        } catch (error) {
        }
    }

    useEffect(() => {
        getLatestComments()
    }, []);

    if (comments.length > 0)
        return (
            <div className="it-col this-05">
                <div className="comm-title line-center">
                    <i className="fa-solid fa-bolt ct-icon"></i>
                    <span>Bình luận mới</span>
                </div>
                <div className="release-list">
                    <div id="latest-comment" className="comment-slide-wrapper">
                        <Swiper
                            modules={[Autoplay]}
                            className="sw-comment-slide"
                            slidesPerView={4}
                            spaceBetween={4}
                            direction={"vertical"}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                        >
                            {comments.map((item) => (
                                <SwiperSlide key={`c-slide-${item._id}`}>
                                    <div className="swiper-slide">
                                        <Link href={`${movieDetailUrl(item.movie)}?cid=${item._id}`}
                                              className="re-item">
                                            <div className="user-avatar">
                                                <img src={userAvatar(item.author)} alt={item.author.name}/>
                                            </div>
                                            <div className="user-comment d-flex align-items-center gap-2">
                                                <UserName user={item.author} customClass="flex-shrink-0"/>
                                                <div className="subject flex-grow-1">
                                                    <div className="lim-1">
                                                        {commentProcessing(item.content, false)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="for line-center gap-1">
                                                <small className="me-1"><i className="fa-solid fa-play"></i></small>
                                                <span className="lim-1">{item.movie.title}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        )
}

export default memo(LatestComments)