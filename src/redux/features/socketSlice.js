'use client';
import {createSlice} from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        connected: false,
        globalMessages: [],
        roomMessages: {}, // { [roomId]: [] }
        currentRoom: null,
        rooms: {},
        cooldown: 0,
    },
    reducers: {
        socketConnected: (s) => {
            s.connected = true;
        },
        socketDisconnected: (s) => {
            s.connected = false;
        },
        receiveRoom: (s, {payload}) => {
            const {roomId, msg} = payload;
            if (!s.roomMessages[roomId]) s.roomMessages[roomId] = [];
            s.roomMessages[roomId].push(msg);
        },
        setCurrentRoom: (s, {payload}) => {
            s.currentRoom = payload;
        },
        resetRoom: (s, {payload: roomId}) => {
            s.roomMessages[roomId] = [];
        },
        setHistory: (s, {payload: {roomId, history}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].messages = history || [];
            if (roomId !== "general") {
                s.rooms[roomId].messages.push({type: "ads"})
            }
        },
        addMessage: (s, {payload: {roomId, payload}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].messages.push(payload);
        },
        setPinned: (s, {payload: {roomId, pinned}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].pinned = pinned
        },
        setReply: (s, {payload: {roomId, reply}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].reply = reply;
        },
        setOnline: (s, {payload: {roomId, online}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].online = online;
        },
        setRoomStatus: (s, {payload: {roomId, status}}) => {
            if (!s.rooms[roomId]) s.rooms[roomId] = {messages: [], pinned: [], online: 0};
            s.rooms[roomId].status = status;
        },
        removeMessage(s, {payload: {roomId, messageId}}) {
            const room = s.rooms?.[roomId];
            if (!room) return;
            room.messages = room.messages.filter(
                (it) => (it?.message?.id ?? it?.id) !== messageId
            );
            // nếu đang reply vào tin này -> clear
            if (room.reply?.message?.id === messageId) {
                room.reply = null;
            }
        },
        removeMessagesByUser(state, {payload: {roomId, userId}}) {
            const room = state.rooms?.[roomId];
            if (!room) return;
            const uid = String(userId);

            // messages
            room.messages = (room.messages || []).filter(it => {
                const m = it?.message || it;
                return String(m?.user?._id) !== uid;
            });

            // pinned (nếu bạn giữ pinned ở client)
            room.pinned = (room.pinned || []).filter(it => {
                const m = it?.message || it;
                return String(m?.user?._id) !== uid;
            });

            // reply đang mở từ user bị ban -> clear
            if (room.reply && String(room.reply?.message?.user?._id) === uid) {
                room.reply = null;
            }
        },

        startCooldown(state) {
            state.cooldown = 5;
        },
        tickCooldown(state) {
            if (state.cooldown > 0) state.cooldown -= 1;
        },
    }
});

// Thunk để khởi chạy countdown
export const startCooldownTimer = () => (dispatch, getState) => {
    dispatch(startCooldown());
    const intervalId = setInterval(() => {
        const {cooldown} = getState().socket;
        if (cooldown <= 1) {
            dispatch(tickCooldown());
            clearInterval(intervalId);
        } else {
            dispatch(tickCooldown());
        }
    }, 1000);
};

export const {
    socketConnected, socketDisconnected, receiveGlobal,
    receiveRoom,
    setCurrentRoom,
    resetRoom,
    setHistory,
    setPinned,
    addMessage,
    setReply,
    removeMessage,
    removeMessagesByUser,
    setOnline,
    startCooldown,
    tickCooldown,
    setRoomStatus
} = socketSlice.actions;

export default socketSlice.reducer;
