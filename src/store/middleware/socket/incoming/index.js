import { registerSystemHandlers } from "./app.handlers";

export const registerAllIncomingEvents = (socket, store) => {
    registerSystemHandlers(socket, store);

    // Bạn có thể thêm các logic quản lý lỗi kết nối chung ở đây
    socket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
    });
};