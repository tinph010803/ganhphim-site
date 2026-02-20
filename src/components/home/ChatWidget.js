"use client";

import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {socketActions} from "@/redux/middlewares/socketMiddleware";
import {GLOBAL_ROOM_ID} from "@/constants/socket";
import ChatContent from "@/components/chat/Content";

const OFFSET_RIGHT_SCROLL = "72px";
const OFFSET_RIGHT_DEFAULT = "1rem";

const ChatWidget = () => {
    const dispatch = useAppDispatch();

    const totalOnline = useAppSelector(s => s.socket.rooms?.[GLOBAL_ROOM_ID]?.online);

    const [show, setShow] = useState(false);
    const [rightOffset, setRightOffset] = useState(OFFSET_RIGHT_DEFAULT);

    // Dịch nút theo scroll trang
    useEffect(() => {
        const onScroll = () => {
            setRightOffset(window.pageYOffset > 200 ? OFFSET_RIGHT_SCROLL : OFFSET_RIGHT_DEFAULT);
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        onScroll(); // set ngay lần đầu
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toggleShow = () => setShow(v => !v);

    // Join/leave room khi mở/đóng widget
    useEffect(() => {
        if (show) {
            dispatch({type: socketActions.join, payload: GLOBAL_ROOM_ID});
        } else {
            dispatch({type: socketActions.leave, payload: GLOBAL_ROOM_ID});
        }
        return () => {
            if (show) dispatch({type: socketActions.leave, payload: GLOBAL_ROOM_ID});
        };
    }, [show, dispatch]);

    return (
        <div className={`shoutbox-fixed ${show ? "show" : ""}`} style={{right: rightOffset}}>
            <div id="home-toggle-chat" className="btn btn-toggle" onClick={toggleShow}>
                <div className="flex-grow-1 line-center gap-1">
                    <div className="inc-icon icon-24">
                        <img src="/images/chat.gif" alt="chat"/>
                    </div>
                    <span>Phòng chat</span>
                </div>
                {totalOnline > 0 && <strong className="s-hide">{totalOnline.toLocaleString()} Online</strong>}
                <i className={`fa-solid fa-minus toggle-icon ${!show ? "d-none" : ""}`}/>
            </div>

            <div className={`shoutbox shoutbox-home ${!show ? "d-none" : ""}`}>
                <ChatContent roomId={GLOBAL_ROOM_ID}/>
            </div>
        </div>
    );
};

export default memo(ChatWidget);
