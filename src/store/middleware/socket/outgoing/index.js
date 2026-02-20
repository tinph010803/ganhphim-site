import {appEmitters} from "./app.emit";

const allEmitters = {
    ...appEmitters,
};

export const handleOutgoingAction = async (socket, action, store) => {
    const handler = allEmitters[action.type];

    if (handler) {
        // Thêm await và return ở đây
        return await handler(socket, action, store);
    }
};