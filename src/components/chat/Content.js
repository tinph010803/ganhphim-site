"use client";

import {memo, useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo, Fragment} from "react";
import ChatMessageItem from "@/components/chat/MessageItem";
import ChatForm from "@/components/chat/ChatForm";
import ChatCountDown from "@/components/chat/ChatCountDown";
import {chatProcessing} from "@/utils/helpers";
import {setReply} from "@/redux/features/socketSlice";
import PinnedMessageItem from "@/components/chat/PinnedMessageItem";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import AdsW2gChat from "@/components/ads/W2gChat";
import {useLoginUrl} from "@/hooks/useLoginUrl";

const FREEZE_MS = 500;
const DEBOUNCE_MS = 120;
const UI_READY_FALLBACK_MS = 300;
const BOTTOM_THRESHOLD = 72;

const ChatContent = ({roomId}) => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(s => s.socket.rooms?.[roomId]?.messages) || [];
    const pinnedMessages = useAppSelector(s => s.socket.rooms?.[roomId]?.pinned) || [];
    const reply = useAppSelector(s => s.socket.rooms?.[roomId]?.reply);
    const loggedUser = useAppSelector(s => s.auth.loggedUser);
    const loginUrl = useLoginUrl()

    const [unseenCount, setUnseenCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [uiReady, setUiReady] = useState(false);

    const listRef = useRef(null);
    const atBottomRef = useRef(true);
    const lastSeenIdxRef = useRef(-1);
    const didInitialJumpRef = useRef(false);
    const freezeUntilRef = useRef(0);
    const uiReadyTimerRef = useRef(null);
    const scrollRafRef = useRef(null);
    const debounceTimerRef = useRef(null);

    useEffect(() => {
        atBottomRef.current = isAtBottom;
    }, [isAtBottom]);

    const isNearBottom = useCallback((el) => {
        if (!el) return true;
        const {scrollTop, scrollHeight, clientHeight} = el;
        return scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD;
    }, []);

    const computeUnread = useCallback(() => {
        const start = Math.max(lastSeenIdxRef.current + 1, 0);
        let cnt = 0;
        for (let i = start; i < messages.length; i++) {
            if (messages[i]?.type === "message") cnt++;
        }
        return cnt;
    }, [messages]);

    const scrollToBottom = useCallback((behavior = "smooth") => {
        const el = listRef.current;
        if (!el) return;
        if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = requestAnimationFrame(() => {
            el.scrollTo({top: el.scrollHeight, behavior});
        });
    }, []);

    // Initial jump sau khi có history
    useLayoutEffect(() => {
        if (!didInitialJumpRef.current && messages.length > 0) {
            didInitialJumpRef.current = true;
            scrollToBottom("smooth");
            lastSeenIdxRef.current = messages.length - 1;
            freezeUntilRef.current = Date.now() + FREEZE_MS;
            setIsAtBottom(true);
            setUnseenCount(0);

            if (uiReadyTimerRef.current) clearTimeout(uiReadyTimerRef.current);
            uiReadyTimerRef.current = setTimeout(() => setUiReady(true), UI_READY_FALLBACK_MS);
        }
        return () => {
            if (uiReadyTimerRef.current) {
                clearTimeout(uiReadyTimerRef.current);
                uiReadyTimerRef.current = null;
            }
        };
    }, [messages.length, scrollToBottom]);

    // Khi messages thay đổi
    useLayoutEffect(() => {
        if (!listRef.current) return;
        if (messages.length === 0) {
            lastSeenIdxRef.current = -1;
            setUnseenCount(0);
            return;
        }
        if (atBottomRef.current) {
            freezeUntilRef.current = Date.now() + FREEZE_MS;
            scrollToBottom("auto");
            lastSeenIdxRef.current = messages.length - 1;
            if (unseenCount !== 0) setUnseenCount(0);
        } else {
            setUnseenCount(computeUnread());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length]);

    // onScroll: cập nhật isAtBottom (debounce) + unseen
    const onScroll = useCallback(() => {
        const el = listRef.current;
        if (!el) return;
        if (Date.now() < freezeUntilRef.current) return;

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            const atBottom = isNearBottom(el);
            if (atBottom) {
                setIsAtBottom(true);
                lastSeenIdxRef.current = messages.length - 1;
                setUnseenCount(0);
            } else {
                setIsAtBottom(false);
                setUnseenCount(computeUnread());
            }
        }, DEBOUNCE_MS);
    }, [computeUnread, isNearBottom, messages.length]);

    useEffect(() => () => {
        if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (uiReadyTimerRef.current) clearTimeout(uiReadyTimerRef.current);
    }, []);

    const newBtnLabel = useMemo(
        () => (unseenCount > 0 ? `${unseenCount} tin nhắn mới` : "Xuống cuối"),
        [unseenCount]
    );

    return (
        <>
            <div className="sb_body">
                {pinnedMessages.length > 0 && (
                    <div className="chat-pin-area">
                        {pinnedMessages.map((item) => (
                            <PinnedMessageItem item={item} key={`p-m-${item.message.id}`}/>
                        ))}
                    </div>
                )}

                <div id="chat-area" ref={listRef} className="chat-list" onScroll={onScroll}>
                    {messages.map((item, i) => {
                        const key = item?.message?.id ?? item?.id ?? `m-${i}`;

                        let core = null;
                        if (item.type === "start") {
                            core = (
                                <div className="chat-notice item-start">
                                    <div>
                                        <p className="text-primary mb-1"><strong>Buổi xem chung bắt đầu.</strong></p>
                                        <p className="small">Chúc các bạn xem phim vui vẻ không quạu.</p>
                                    </div>
                                </div>
                            );
                        } else if (item.type === "end") {
                            core = (
                                <div className="chat-notice item-end">
                                    <div>
                                        <p className="text-primary mb-1"><strong>Buổi xem chung đã kết thúc.</strong>
                                        </p>
                                        <p className="small">Cảm ơn các bạn đã tham gia buổi xem chung. Hẹn gặp lại!</p>
                                    </div>
                                </div>
                            );
                        } else if (item.type === "join" || item.type === "leave") {
                            core = (
                                <div className="chat-notice item-join">
                                    <div><p dangerouslySetInnerHTML={{__html: item.message.content}}/></div>
                                </div>
                            );
                        } else if (item.type === "message") {
                            core = <ChatMessageItem item={item} roomId={roomId}/>;
                        } else if (item.type === "ads") {
                            core = <AdsW2gChat/>
                        }

                        return (
                            <Fragment key={key}>
                                {core}
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="sb_bottom">
                {uiReady && !isAtBottom && (
                    <div className="row-new" onClick={() => scrollToBottom("smooth")}>
                        <button className="btn btn-sm btn-light btn-rounded">
                            <i className="fa-solid fa-angle-down icon-new"/>
                            <span>{newBtnLabel}</span>
                        </button>
                    </div>
                )}

                {reply && (
                    <div className="row-reply text-cut active">
            <span className="rep-user">
              <i className="fa-solid fa-reply small me-2"/>
                {reply.message.user.name}
            </span>
                        <span
                            className="rep-subject ms-2"
                            dangerouslySetInnerHTML={{__html: chatProcessing(reply.message.content)}}
                        />
                        <a className="rep-close" onClick={() => dispatch(setReply({roomId, reply: null}))}>
                            <i className="fa-solid fa-times"/>
                        </a>
                    </div>
                )}

                <ChatForm roomId={roomId}/>

                <div className="is_bottom">
                    <ChatCountDown/>
                    {loggedUser ? (
                        <div className="is_bottom-user line-center text-light">
                            <i className="fa-solid fa-user text-primary"/>
                            <span>{loggedUser.name}</span>
                        </div>
                    ) : (
                        <div className="is_bottom-login line-center">
                            <i className="fa-solid fa-user"/>
                            <span>Bạn cần{" "}<a href={loginUrl}>đăng nhập</a>{" "}để chat</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(ChatContent);