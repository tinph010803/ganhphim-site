import {getAPI, postAPI} from "@/utils/axios"

const API_PREFIX = '/payment'

class PaymentApi {
    getBillingInfo = async (id)=>{
        const result = await getAPI({path: `${API_PREFIX}/billingInfo/${id}`});
        return result;
    }

    getBillingList = async ()=>{
        const result = await getAPI({path: `${API_PREFIX}/billingList`});
        return result;
    }

    getListPackages = async () => {
        const result = await getAPI({path: `${API_PREFIX}/listPackages`});
        return result;
    }

    getPaymentMethodInfo = async (data) => {
        const result = await postAPI({path: `${API_PREFIX}/getPaymentMethodInfo`, data});
        return result;
    }

    submitCard = async (data)=>{
        const result = await postAPI({path: `${API_PREFIX}/submitCard`, data});
        return result;
    }
}

export default new PaymentApi