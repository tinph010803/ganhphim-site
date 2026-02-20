import { configureStore } from "@reduxjs/toolkit";
import socketMiddleware from "./middleware/socket";

// Import các reducers (Slices)
import appReducer from "./slices/appSlice";

/**
 * Cấu hình Redux Store
 */
export const store = configureStore({
    reducer: {
        app: appReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Tắt kiểm tra serializable cho các action socket đặc biệt nếu cần
            // Thường thì socket middleware của mình không lưu socket instance vào store nên không lo lỗi này
            serializableCheck: {
                ignoredActions: ["socket/emit"],
            },
        }).concat(socketMiddleware), // Gắn Socket Middleware vào chuỗi xử lý

    // Bật DevTools trong môi trường phát triển
    devTools: process.env.NODE_ENV !== "production",
});

// Nếu bạn sử dụng TypeScript, hãy export các Type này
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;