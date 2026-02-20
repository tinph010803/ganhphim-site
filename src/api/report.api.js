import {postAPI} from "@/utils/axios";

const API_PREFIX = '/report'

class ReportApi {
    submit = async (data) => {
        const result = await postAPI({path: `${API_PREFIX}/submit`, data});
        return result;
    }
}


export default new ReportApi