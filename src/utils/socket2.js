import { io } from "socket.io-client";

// Lấy URL từ biến môi trường để dễ dàng thay đổi giữa các môi trường dev/prod
const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:4000";

/**
 * Cấu hình Socket.io Client chuẩn Production
 */
export const socket = io(SOCKET_URL, {
    // 1. Tắt tự động kết nối để kiểm soát luồng trong Redux Middleware
    autoConnect: false,

    // 2. Cấu hình vận chuyển: Ưu tiên WebSocket
    // Việc chỉ định ['websocket'] giúp tránh lỗi CORS và Sticky Session của Nginx
    // nếu server backend đã hỗ trợ tốt WebSocket.
    transports: ["websocket", "polling"],

    // 3. Cấu hình Reconnection (Kết nối lại khi mất mạng)
    reconnection: true,             // Cho phép kết nối lại
    reconnectionAttempts: Infinity, // Thử lại vô hạn lần (hoặc đặt số cụ thể như 10)
    reconnectionDelay: 1000,        // Đợi 1s trước khi thử lại lần đầu
    reconnectionDelayMax: 5000,     // Đợi tối đa 5s giữa các lần thử
    randomizationFactor: 0.5,       // Độ lệch thời gian thử lại để tránh "thủy triều" request lên server

    // 4. Timeout
    timeout: 20000,                 // Đợi 20s nếu không kết nối được thì báo lỗi

    // 5. Bảo mật & Cookie
    withCredentials: true,          // Gửi kèm cookie nếu backend cần (thường dùng cho CORS)

    // 6. Auth Placeholder
    // Sẽ được cập nhật động trong Middleware khi có Token
    auth: {
        token: null
    }
});

/**
 * Các sự kiện debug cơ bản (Chỉ nên bật ở môi trường Development)
 */
if (process.env.NODE_ENV === "development") {
    socket.on("connect", () => {
        console.log(`%c[Socket] Connected: ${socket.id}`, "color: #00ff00; font-weight: bold;");
    });

    socket.on("disconnect", (reason) => {
        console.log(`%c[Socket] Disconnected: ${reason}`, "color: #ff0000; font-weight: bold;");
    });

    socket.on("connect_error", (error) => {
        console.log(`%c[Socket] Connection Error: ${error.message}`, "color: #ffaa00; font-weight: bold;");
    });
}