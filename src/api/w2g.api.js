import {getAPI, postAPI} from "@/utils/axios";

const API_PREFIX = '/w2g'

class W2gApi {
    info = async (id) => {
        const res = await getAPI({path: `${API_PREFIX}/detail/${id}`})

        return res
    }

    homeData = async () => {
        const res = await getAPI({path: `${API_PREFIX}/homeData`})

        return res
    }

    latestPremiereRooms = async () => {
        const res = await getAPI({path: `${API_PREFIX}/latestPremiereRooms`})

        return res
    }

    listNormalRooms = async ({page = 1, sort_by = 'latest', status = ''}) => {
        const res = await getAPI({path: `${API_PREFIX}/normalRooms?page=${page}&sort_by=${sort_by}&status=${status}`})

        return res
    }

    myRooms = async ({status = ""}) => {
        const res = await getAPI({path: `${API_PREFIX}/myRooms?status=${status}`})

        return res
    }

    remindRoomIds = async () => {
        const res = await getAPI({path: `${API_PREFIX}/remind/roomIds`})

        return res
    }

    createRoom = async (data) => {
        const res = await postAPI({path: `${API_PREFIX}/createRoom`, data})

        return res
    }

    deleteRoom = async (id) => {
        const res = await postAPI({path: `${API_PREFIX}/deleteRoom`, data: {id}})

        return res
    }

    remind = async (roomId) => {
        const res = await postAPI({path: `${API_PREFIX}/remind`, data: {room_id: roomId}})

        return res
    }

    logView = async (id) => {
        const result = await postAPI({path: `${API_PREFIX}/logView/${id}`});
        return result;
    }
}


export default new W2gApi