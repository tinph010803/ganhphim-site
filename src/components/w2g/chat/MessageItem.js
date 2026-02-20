"use client"

import {memo} from "react";
import {userAvatar} from "@/utils/image";
import {chatProcessing, timeAgo} from "@/utils/helpers";
import {setReply} from "@/redux/features/chatSlice";
import {useAppDispatch} from "@/hooks/redux";
import ChatMessageActions from "@/components/w2g/chat/MessageActions";
import UserName from "@/components/user/Name";

const ChatMessageItem = ({item, socket, isOwner,room}) => {
    const dispatch = useAppDispatch()

    const user = item.message?.user

    const handleReply = async (chat) => {
        dispatch(setReply(chat))
    }

    return (
        <div className="chat-row d-flex gap-3"
             onDoubleClick={() => handleReply(item)}>
            <div className="user-avatar">
                <img src={userAvatar(user)} alt={user.name}/>
            </div>
            <div className="info">
                <div className="head w-100 line-center gap-3">
                    <UserName user={user}/>
                    <div className="time">{timeAgo(item.message.created_at)}</div>
                    <div className="flex-grow-1"></div>
                    <ChatMessageActions item={item} socket={socket} isOwner={isOwner} room={room}/>
                </div>
                {item.message.reply && <div className="reply">
                    <UserName user={item.message.reply.user}/>
                    <span className="rep-subject"
                          dangerouslySetInnerHTML={{__html: chatProcessing(item.message.reply.content)}}/>
                </div>}
                <div className="subject" dangerouslySetInnerHTML={{__html: chatProcessing(item.message.content)}}/>
            </div>
        </div>
    )
}

export default memo(ChatMessageItem)