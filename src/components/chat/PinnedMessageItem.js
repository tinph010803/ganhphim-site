"use client"

import {memo, useCallback} from "react";
import {userAvatar} from "@/utils/image";
import UserName from "@/components/user/Name";
import {timeAgo} from "@/utils/helpers";
import {useAppDispatch} from "@/hooks/redux";
import {socketActions} from "@/redux/middlewares/socketMiddleware";
import {GLOBAL_ROOM_ID} from "@/constants/socket";

const PinnedMessageItem = ({item, roomId = GLOBAL_ROOM_ID}) => {
    const dispatch = useAppDispatch();
    const user = item.message?.user

    const handleUnpinMessage = useCallback((id) => {
        dispatch({type: socketActions.unpinMessage, payload: {roomId, messageId: id}})
    }, [roomId]);

    return (
        <div className="chat-row d-flex gap-3">
            <div className="user-avatar">
                <img src={userAvatar(user)} alt={user.name}/>
            </div>
            <div className="info">
                <div className="head w-100 line-center gap-3">
                    <UserName user={user}/>
                    <div className="pin line-center">
                        <i className="fa-solid fa-thumbtack"></i>
                        <span>Đã ghim</span>
                    </div>
                    <div className="time">{timeAgo(item.message.created_at)}</div>
                    <div className="flex-grow-1"></div>
                    <div className="opt-menu">
                        <div className="opt"
                             onClick={() => handleUnpinMessage(item.message.id)}><i
                            className="fa-solid fa-thumbtack-slash"></i></div>
                    </div>
                </div>
                <div className="subject">
                    {item.message.content}
                </div>
            </div>
        </div>
    )
}

export default memo(PinnedMessageItem)