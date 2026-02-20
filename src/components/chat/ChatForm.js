"use client"

import {memo, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setReply, startCooldownTimer} from "@/redux/features/socketSlice";
import ChatEmoji from "@/components/chat/Emoji";
import {socketActions} from "@/redux/middlewares/socketMiddleware";
import {showToast} from "@/utils/helpers";

const ChatForm = ({roomId}) => {
    const dispatch = useAppDispatch();
    const cooldown = useAppSelector((s) => s.socket.cooldown);
    const reply = useAppSelector(s => s.socket.rooms?.[roomId]?.reply);
    const {loggedUser} = useAppSelector((s) => s.auth);

    const MAX_LENGTH = 200
    const [message, setMessage] = useState("");
    const inputRef = useRef(null)

    useEffect(() => {
        if (reply) inputRef.current.focus();
    }, [reply]);

    const handleChange = (e) => {
        let val = e.target.value;
        // Giới hạn tối đa MAX_LENGTH ký tự
        if (val.length > MAX_LENGTH) {
            val = val.slice(0, MAX_LENGTH);
        }
        setMessage(val);
    };

    const handleSend = (customMessage = null) => {
        const text = customMessage ? customMessage.trim() : message.trim();
        if (!text || cooldown > 0) return;
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }

        const data = {
            content: text,
            roomId: roomId
        }
        if (reply) {
            data.replyId = reply.message.id
        }

        if (!customMessage) {
            setMessage("")
        }
        dispatch(setReply({roomId: roomId, reply: null}))

        dispatch({type: socketActions.sendMessage, payload: data});

        if (loggedUser.role !== "admin" && !loggedUser.is_vip) {
            dispatch(startCooldownTimer());
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onGifClick = (gif) => {
        console.log(gif)
        const image = gif.media_formats.tinygif_transparent || gif.media_formats.tinywebp_transparent || gif.media_formats.webp
        const gifMessage = `[img width="${image?.dims[0]}" height="${image?.dims[1]}"]${image?.url}[/img]`;
        handleSend(gifMessage);
    }

    const onEmojiClick = (data) => {
        setMessage(prev => prev + data.emoji)
        inputRef.current.focus()
    }

    return (
        <div className="is_top">
            <div className="is_top-input">
                <ChatEmoji onGifClick={onGifClick} onEmojiClick={onEmojiClick}/>
                <input ref={inputRef} className="form-control chat-input" type="text" placeholder="Chat gì đó"
                       value={message}
                       onChange={handleChange} onKeyDown={onKeyDown} maxLength={MAX_LENGTH}/>
                <div className="text-left">{message.length}/{MAX_LENGTH}</div>
            </div>
            <div className="is_top-button">
                <button type="button" className="btn btn-block btn-primary" onClick={() => handleSend()}
                        disabled={cooldown > 0 || !message.trim()}>Gửi
                </button>
            </div>
        </div>
    )
}

export default memo(ChatForm)