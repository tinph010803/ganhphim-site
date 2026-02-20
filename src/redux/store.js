import {configureStore} from '@reduxjs/toolkit'
import authReducer from '@/redux/features/authSlice'
import appReducer from '@/redux/features/appSlice'
import commentReducer from '@/redux/features/commentSlice'
import movieReducer from '@/redux/features/movieSlice'
import castReducer from '@/redux/features/castSlice'
import playlistReducer from '@/redux/features/playlistSlice'
import paginationReducer from '@/redux/features/paginationSlice'
import reviewsReducer from '@/redux/features/reviewsSlice'
import userReducer from '@/redux/features/userSlice'
import scheduleReducer from '@/redux/features/scheduleSlice'
import collectionReducer from '@/redux/features/collectionSlice'
import w2gReducer from '@/redux/features/w2gSlice'
import chatReducer from '@/redux/features/chatSlice'
import paymentReducer from '@/redux/features/paymentSlice'
import socketReducer from '@/redux/features/socketSlice'
import {createSocketMiddleware} from '@/redux/middlewares/socketMiddleware';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer,
        comment: commentReducer,
        movie: movieReducer,
        cast: castReducer,
        playlist: playlistReducer,
        pagination: paginationReducer,
        reviews: reviewsReducer,
        user: userReducer,
        schedule: scheduleReducer,
        collection: collectionReducer,
        w2g: w2gReducer,
        chat: chatReducer,
        payment: paymentReducer,
        socket: socketReducer,
    },
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: {
                // Bỏ qua các action không serializable liên quan socket
                ignoredActions: ['socket/init', 'socket/joinRoom', 'socket/leaveRoom', 'socket/sendGlobal', 'socket/sendRoom', 'auth/tokenUpdated'],
            }
        }).concat(createSocketMiddleware())
})