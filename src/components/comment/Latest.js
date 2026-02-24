"use client"

import Link from "next/link";
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
            setComments(result || [])
        } catch (error) {
        }
    }

    useEffect(() => {
        getLatestComments()
    }, []);

    return (
        <div className="it-col this-05">
            <div className="comm-title line-center">
                <i className="fa-solid fa-bolt ct-icon"></i>
                <span>Bình luận mới</span>
            </div>
            <div className="chart-list lc-list">
                {comments.length === 0 && (
                    <div className="no-comments">Chưa có bình luận</div>
                )}
                {comments.slice(0, 5).map((item) => (
                    <Link href={`${movieDetailUrl(item.movie)}?cid=${item._id}`}
                          key={`lc-${item._id}`}
                          className="re-item">
                        <div className="user-avatar">
                            <img src={userAvatar(item.author)} alt={item.author.name}/>
                        </div>
                        <div className="user-comment">
                            <UserName user={item.author} customClass="flex-shrink-0"/>
                            <div className="lim-1">{commentProcessing(item.content, false)}</div>
                        </div>
                        <div className="for line-center gap-1">
                            <small className="me-1"><i className="fa-solid fa-play"></i></small>
                            <span className="lim-1">{item.movie.title}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default memo(LatestComments)