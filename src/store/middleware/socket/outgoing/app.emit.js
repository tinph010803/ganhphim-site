export const appEmitters = {
    "app/refreshSession": (socket, action, store) => {
        return new Promise((resolve, reject) => {
            const { text, roomId } = action.payload;

            // Socket.io hỗ trợ callback ở tham số cuối cùng
            socket.emit("message:send", { text, roomId }, (response) => {
                if (response.status === "ok") {
                    resolve(response.data);
                } else {
                    reject(response.error);
                }
            });
        });
    }
};