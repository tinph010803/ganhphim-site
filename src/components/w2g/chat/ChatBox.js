"use client"

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import ChatSettings from "@/components/w2g/chat/Settings";
import ChatContent from "@/components/chat/Content";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const W2gChatBox = ({room = null}) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch({type: socketActions.join, payload: room._id});

        return () => {
            dispatch({type: socketActions.leave, payload: room._id});
        }
    }, []);

    return (
        <div className="l_sidebar">
            <div className="shoutbox">
                <ChatSettings/>
                <ChatContent roomId={room._id}/>
            </div>
        </div>
    )
}

export default memo(W2gChatBox)