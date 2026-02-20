import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import PaymentApi from "@/api/payment.api";

const initialState = {
    status: "",
    billingInfo: null,
    billingId: null
}

export const fetchBillingInfo = createAsyncThunk(
    'payment/fetchBillingInfo',
    async (id, thunkAPI) => {
        const {result} = await PaymentApi.getBillingInfo(id)
        return result
    },
)

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setBillingId: (state, action) => {
            state.billingId = action.payload
        },
        setBillingInfo: (state, action) => {
            state.billingInfo = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchBillingInfo.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload) {
                state.billingInfo = payload
                state.status = payload.status === 1 ? "success" : (payload.status === 2 ? "error" : "processing")
            }
        })
    }
})

export const {
    setStatus,
    setBillingId,
    setBillingInfo
} = paymentSlice.actions
export default paymentSlice.reducer