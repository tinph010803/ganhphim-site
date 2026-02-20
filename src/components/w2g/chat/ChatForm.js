"use client"

import {memo, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setReply, startCooldownTimer} from "@/redux/features/chatSlice";
import ChatEmoji from "@/components/w2g/chat/Emoji";
import {showToast} from "@/utils/helpers";

const ChatForm = ({socket}) => {
    const dispatch = useAppDispatch();
    const cooldown = useAppSelector((s) => s.chat.cooldown);
    const reply = useAppSelector(s => s.chat.reply)
    const {loggedUser} = useAppSelector((s) => s.auth);

    const MAX_LENGTH = 200
    const [message, setMessage] = useState("");
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
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
            content: text
        }
        if (reply) {
            data.reply = {
                user: reply.message.user,
                content: reply.message.content,
            }
        }

        if (!customMessage) {
            setMessage("")
        }
        dispatch(setReply(null))

        socket.emit("sendMessage", data, (response) => {
            if (!response.success) {
                alert(response.message);
            } else {
                if (loggedUser.role !== "admin" && !loggedUser.is_vip) {
                    dispatch(startCooldownTimer());
                }
            }
        });
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onGifClick = (gif) => {
        const gifMessage = `[img]${gif.media_formats.webp_transparent?.url || gif.media_formats.webp?.url}[/img]`;
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