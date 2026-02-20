import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    cooldown: 0,
    reply: null
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        startCooldown(state) {
            state.cooldown = 5;
        },
        tickCooldown(state) {
            if (state.cooldown > 0) state.cooldown -= 1;
        },
        setReply: (state, action) => {
            state.reply = action.payload
        },
    },
});

export const {startCooldown, tickCooldown, setReply} = chatSlice.actions;

export default chatSlice.reducer;

// Thunk để khởi chạy countdown
export const startCooldownTimer = () => (dispatch, getState) => {
    dispatch(startCooldown());
    const intervalId = setInterval(() => {
        const {cooldown} = getState().chat;
        if (cooldown <= 1) {
            dispatch(tickCooldown());
            clearInterval(intervalId);
        } else {
            dispatch(tickCooldown());
        }
    }, 1000);
};