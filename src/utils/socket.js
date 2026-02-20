'use client';

import {io} from 'socket.io-client';
import {getAuthTokens} from "@/utils/auth";

let _socket;

export const getSocket = () => {
    if (typeof window === 'undefined') return null;
    if (_socket) return _socket;

    const {accessToken} = getAuthTokens()

    _socket = io(process.env.SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        reconnection: true,                 // bật auto-reconnect
        reconnectionAttempts: 10,     // thử vô hạn (hoặc đặt số cụ thể)
        reconnectionDelay: 500,             // backoff min
        reconnectionDelayMax: 5000,         // backoff max
        randomizationFactor: 0.5,
        timeout: 20000,
        auth: {
            token: accessToken
        }
    });
    return _socket;
}
