'use client';
import {getSocket} from '@/utils/socket';
import {
    socketConnected,
    socketDisconnected,
    setHistory, setPinned, addMessage, removeMessage, removeMessagesByUser, setOnline
} from '@/redux/features/socketSlice';
import {playerPostMessage, showToast} from "@/utils/helpers";
import {GLOBAL_ROOM_ID} from "@/constants/socket";
import {
    setRoomEpisode, setRoomPlayerStartTime,
    setRoomSeason,
    setRoomStartLive,
    setRoomStatus, updateMyRoomById, updateNormalRoomById, updatePremiereRoomById
} from "@/redux/features/w2gSlice";
import {getAuthTokens} from "@/utils/auth";

export const socketActions = {
    init: 'socket/init',
    join: 'socket/joinRoom',
    leave: 'socket/leaveRoom',
    sendMessage: 'socket/sendMessage',
    pinMessage: 'socket/pinMessage',
    unpinMessage: 'socket/unpinMessage',
    deleteMessage: 'socket/deleteMessage',
    startLive: 'socket/startLive',
    endLive: 'socket/endLive',
    changeEpisode: 'socket/changeEpisode',
    banUser: 'socket/banUser',
    tokenUpdated: 'auth/tokenUpdated',   // dispatch khi refresh xong
};

export function createSocketMiddleware() {
    let socket = null;
    let initialized = false;
    const joinedRooms = new Set();
    const syncedRooms = new Set();
    const pendingEmits = [];  // [{type, payload}]
    let reconnecting = false;
    let reconnectTimer = null;

    const enqueue = (payload) => pendingEmits.push(payload);
    const flushQueue = () => {
        while (pendingEmits.length) {
            const payload = pendingEmits.shift();
            socket?.emit('sendMessage', payload);
        }
    };

    const emitJoin = (roomId) => {
        if (!socket?.connected) return;
        if (syncedRooms.has(roomId)) return; // tránh double trong cùng phiên
        socket.emit('joinRoom', roomId, (ack) => {
            if (ack?.ok) {
                syncedRooms.add(roomId);
                if (ack.history) storeRef.dispatch(setHistory({roomId, history: ack.history}));
                if (ack.pinned) storeRef.dispatch(setPinned({roomId, pinned: ack.pinned}));
            } else {
                joinedRooms.delete(roomId);
                showToast({type: 'error', message: ack?.error || 'Join room failed'});
            }
        });
    };

    const rejoinRooms = () => {
        joinedRooms.forEach((id) => emitJoin(id));
    };

    // Thao tác reconnect an toàn (debounce + promise)
    const reconnectNow = () => {
        if (!socket) return;
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        if (reconnecting) return;
        reconnecting = true;
        try {
            if (socket.connected) socket.disconnect();
            const {accessToken} = getAuthTokens() || {};
            if (socket && accessToken) {
                socket.auth = {token: accessToken};
                if (socket.io?.opts) socket.io.opts.auth = {token: accessToken};
            }
            socket.connect(); // auth() ở lib/socket sẽ đọc token mới từ localStorage
        } finally {
            // Sau 1s cho phép lần reconnect tiếp theo (tránh storm)
            reconnectTimer = setTimeout(() => (reconnecting = false), 1000);
        }
    };

    let storeRef = null;

    return store => next => action => {
        if (!storeRef) storeRef = store;

        const result = next(action);

        switch (action.type) {
            case socketActions.init: {
                if (initialized) break;
                initialized = true;

                socket = getSocket();
                if (!socket) break;

                socket.on('connect', () => {
                    store.dispatch(socketConnected());
                    syncedRooms.clear();
                    rejoinRooms();
                    flushQueue();
                });
                socket.io.on('reconnect_attempt', () => {
                    const {accessToken} = getAuthTokens() || {};
                    if (accessToken) socket.auth = {token: accessToken};
                });
                socket.on('disconnect', () => store.dispatch(socketDisconnected()));

                socket.off('message')
                socket.on('message', ({roomId, payload}) => {
                    store.dispatch(addMessage({roomId, payload}));
                })

                socket.off('pinnedMessages')
                socket.on('pinnedMessages', ({roomId, pinned}) => {
                    store.dispatch(setPinned({roomId, pinned}));
                })

                socket.off('deletedMessage')
                socket.on('deletedMessage', ({roomId, messageId}) => {
                    store.dispatch(removeMessage({roomId, messageId}));
                })

                socket.off('bannedUser')
                socket.on('bannedUser', ({roomId, userId}) => {
                    store.dispatch(removeMessagesByUser({roomId, userId}));
                })

                socket.off('generalRoomTotalOnline')
                socket.on('generalRoomTotalOnline', ({total}) => {
                    store.dispatch(setOnline({roomId: GLOBAL_ROOM_ID, online: total}));
                })

                socket.off('startLive')
                socket.on('startLive', ({start_time, player_start_time}) => {
                    store.dispatch(setRoomStartLive({start_time, player_start_time}))
                })

                socket.off('endLive')
                socket.on('endLive', ({}) => {
                    store.dispatch(setRoomStatus(2))
                })

                socket.off('roomUpdate')
                socket.on('roomUpdate', ({roomId, online, status, season, episode}) => {
                    const state = storeRef.getState();

                    store.dispatch(setOnline({roomId: roomId, online: online}));
                    store.dispatch(updatePremiereRoomById({roomId, data: {online, status, season, episode}}));
                    store.dispatch(updateNormalRoomById({roomId, data: {online, status, season, episode}}));
                    store.dispatch(updateMyRoomById({roomId, data: {online, status, season, episode}}));

                    if (state.w2g.roomId === roomId) {
                        if (status) store.dispatch(setRoomStatus(status));
                        if (season) store.dispatch(setRoomSeason(season))
                        if (episode) store.dispatch(setRoomEpisode(episode))
                    }
                })

                socket.off('changeEpisode')
                socket.on('changeEpisode', ({season, episode, player_start_time, roomId}) => {
                    const state = storeRef.getState();

                    if (state.w2g.roomId === roomId) {
                        if (season) store.dispatch(setRoomSeason(season))
                        if (episode) store.dispatch(setRoomEpisode(episode))
                        if (player_start_time) store.dispatch(setRoomPlayerStartTime(player_start_time))

                        playerPostMessage({
                            event: "web_change_episode",
                            param: {
                                episode: episode,
                                season: season,
                                start_time: player_start_time
                            }
                        })
                    }
                })

                socket.on('connect_error', (err) => {
                    // Nếu server báo unauthorized (ví dụ Error('Unauthorized'))
                    if (String(err?.message || '').toLowerCase().includes('unauthorized')) {
                        // Tùy bạn: trigger luồng refresh token tại đây nếu cần
                    }
                });

                if (!socket.connected) socket.connect();
                break;
            }

            case socketActions.join: {
                const roomId = action.payload;
                joinedRooms.add(roomId);
                if (socket?.connected) emitJoin(roomId);
                break;
            }

            case socketActions.leave: {
                const roomId = action.payload;
                joinedRooms.delete(roomId);
                syncedRooms.delete(roomId)
                if (socket?.connected) socket.emit('leaveRoom', roomId)
                break;
            }

            case socketActions.sendMessage: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('sendMessage', payload, (ack) => {
                    if (!ack.ok) {
                        showToast({type: "error", message: ack.message});
                    }
                });
                else enqueue(payload);
                break;
            }

            case socketActions.pinMessage: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('pinMessage', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.unpinMessage: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('unpinMessage', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.deleteMessage: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('deleteMessage', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.startLive: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('startLive', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.endLive: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('endLive', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.banUser: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('banUser', payload);
                else enqueue(payload);
                break;
            }

            case socketActions.changeEpisode: {
                const payload = action.payload;

                if (socket?.connected) socket.emit('changeEpisode', payload);
                else enqueue(payload);
                break;
            }

            // >>> Quan trọng: khi token đổi, chủ động reconnect
            case socketActions.tokenUpdated: {
                // Bạn đã lưu token mới vào localStorage trước khi dispatch action này
                reconnectNow();
                break;
            }
        }

        return result;
    };
}
