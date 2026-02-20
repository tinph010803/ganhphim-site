import { socket } from "@/utils/socket2";
import { registerAllIncomingEvents } from "./incoming";
import { handleOutgoingAction } from "./outgoing";

/**
 * Socket Middleware
 * Quản lý luồng dữ liệu realtime giữa Redux và Socket.io Server
 */
const socketMiddleware = (store) => {
    // --- 1. ĐĂNG KÝ LISTENERS (SERVER -> CLIENT) ---
    // Chỉ đăng ký một lần duy nhất khi Store khởi tạo
    registerAllIncomingEvents(socket, store);

    // --- 2. KHỞI TẠO KẾT NỐI BAN ĐẦU (GUEST) ---
    // Nếu đã có token trong state (ví dụ từ LocalStorage load vào), nạp vào auth
    const token = store.getState().auth?.token;
    if (token) {
        socket.auth = { token };
    }
    socket.connect();

    return (next) => async (action) => {
        // Luôn cho action đi tiếp vào Redux để cập nhật state trước
        const result = next(action);

        // --- 3. XỬ LÝ AUTHENTICATION (UPGRADE/DOWNGRADE) ---
        // Khi user đăng nhập thành công
        if (action.type === "auth/loginSuccess") {
            socket.auth = { token: action.payload.token };
            socket.disconnect().connect(); // Reconnect để nâng cấp lên Authenticated role
        }

        // Khi user đăng xuất
        if (action.type === "auth/logout") {
            socket.auth = null;
            socket.disconnect().connect(); // Reconnect để quay về Guest role
        }

        // --- 4. XỬ LÝ OUTGOING EVENTS (CLIENT -> SERVER) ---
        // Hàm này sẽ kiểm tra xem action.type có khớp với emitter nào không
        // Nếu có, nó sẽ thực hiện socket.emit và trả về Promise (nếu có callback)
        const socketResult = await handleOutgoingAction(socket, action, store);

        // Trả về socketResult nếu có (giúp UI có thể await dispatch)
        // Nếu không có socketResult, trả về kết quả mặc định của Redux action
        return socketResult !== undefined ? socketResult : result;
    };
};

export default socketMiddleware;