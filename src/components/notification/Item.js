"use client"

import {movieDetailUrl} from "@/utils/url";
import MovieImagesPoster from "@/components/movie/images/Poster";
import {getTypeText} from "@/constants/episodeVersion";
import {timeAgo} from "@/utils/helpers";
import CustomLink from "@/components/shared/CustomLink";
import {memo} from "react";
import NotificationApi from "@/api/notification.api";
import dayjs from "@/utils/dayjs";
import {setCommentFocus} from "@/redux/features/commentSlice";
import {useAppDispatch} from "@/hooks/redux";

const NotificationItem = ({item}) => {
    const dispatch = useAppDispatch()
    const handleItemClick = async () => {
        dispatch(setCommentFocus(null))
        try {
            await NotificationApi.seen(item._id)
        } catch (e) {
        }
    }

    if (item.action === 1)
        return (
            <CustomLink
                href={`${movieDetailUrl(item.movie)}`}
                className={`h-item noti-film ${item.status === 0 ? 'new' : ''}`} onClick={handleItemClick}>
                <div className="v-thumbnail">
                    <MovieImagesPoster movie={item.movie} size="50-0"/>
                </div>
                <div className="content flex-grow-1">
                    <div className="text mb-2">
                        <strong className="text-white">&#x26A1;{item.movie.title} </strong>
                        vừa cập nhật
                        <strong> Tập {item.episode_number} ({getTypeText(item.version)})</strong>
                    </div>
                    <div className="time small">{timeAgo(item.created_at)}</div>
                </div>
            </CustomLink>
        )

    if (item.action === 2)
        return (
            <CustomLink href={`${movieDetailUrl(item.movie)}`}
                  className={`h-item noti-film ${item.status === 0 ? 'new' : ''}`} onClick={handleItemClick}>
                <div className="v-thumbnail">
                    <MovieImagesPoster movie={item.movie} size="50-0"/>
                </div>
                <div className="content flex-grow-1">
                    <div className="text mb-2">
                        <strong className="text-white">&#x26A1;{item.movie.title} </strong>
                        vừa ra mắt trên Rổ Phim.
                    </div>
                    <div className="time small">{timeAgo(item.created_at)}</div>
                </div>
            </CustomLink>
        )

    if (item.action === 3)
        return (
            <CustomLink href={`${movieDetailUrl(item.movie)}?cid=${item.parent_comment_id}&fcid=${item.comment_id}`}
                  className={`h-item noti-film ${item.status === 0 ? 'new' : ''}`} onClick={handleItemClick}>
                <div className="v-thumbnail">
                    <MovieImagesPoster movie={item.movie} size="50-0"/>
                </div>
                <div className="content flex-grow-1">
                    <div className="text mb-2">
            <span className="text-white"><i
                className="fa-solid fa-comment small text-primary me-2"></i>{item.sender.name}</span> đã trả lời bình
                        luận
                        của bạn trong <strong className="text-white">{item.movie.title}</strong>
                    </div>
                    <div className="time small">{timeAgo(item.created_at)}</div>
                </div>
            </CustomLink>
        )

    if (item.action === 5)
        return (
            <a className={`h-item noti-film ${item.status === 0 ? 'new' : ''}`} onClick={handleItemClick}>
                <div className="content flex-grow-1">
                    {item.until > 0 && <div className="text mb-2">
            <span className="text-white"><i
                className="fa-solid fa-ban small text-primary me-2"></i></span>Bạn đã bị cấm bình luận
                        đến <strong
                        className="text-white">{dayjs.unix(item.until).format("HH:mm:ss DD/MM/YYYY")}</strong> do vi
                        phạm tiêu chuẩn cộng đồng.
                    </div>}
                    {item.until === 0 && <div className="text mb-2">
            <span className="text-white"><i
                className="fa-solid fa-ban small text-primary me-2"></i></span>Bạn đã bị cấm bình luận
                        <strong className="text-white">vĩnh viễn</strong> do vi
                        phạm tiêu chuẩn cộng đồng.
                    </div>}
                    <div className="time small">{timeAgo(item.created_at)}</div>
                </div>
            </a>
        )

    if (item.action === 6)
        return (
            <CustomLink href={`${movieDetailUrl(item.movie)}`}
                  className={`h-item noti-film ${item.status === 0 ? 'new' : ''}`} onClick={handleItemClick}>
                <div className="v-thumbnail">
                    <MovieImagesPoster movie={item.movie} size="50-0"/>
                </div>
                <div className="content flex-grow-1">
                    <div className="text mb-2">
                        <strong className="text-white">&#x26A1;{item.movie.title} </strong>
                        vừa cập nhật chất lượng.
                    </div>
                    <div className="time small">{timeAgo(item.created_at)}</div>
                </div>
            </CustomLink>
        )
}

export default memo(NotificationItem)