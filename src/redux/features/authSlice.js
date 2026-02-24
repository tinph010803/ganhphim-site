import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import AuthApi from "@/api/auth.api";

const initialState = {
    isLogged: false,
    loggedUser: null,
    isLoadingUserInfo: true,
    error: null,
    showModalLogin: false,
    showModalRegister: false,
    showModalForgotPassword: false,
    accessToken: null,
}

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (thunkAPI) => {
        try {
            const res = await AuthApi.getProfile()
            return res?.data || res?.result || false
        } catch (e) {
        }

        return false
    },
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
        toggleShowModalLogin: (state, action) => {
            state.showModalLogin = !state.showModalLogin
            state.showModalRegister = false
            state.showModalForgotPassword = false
        },
        toggleShowModalRegister: (state, action) => {
            state.showModalRegister = !state.showModalRegister
            state.showModalLogin = false
            state.showModalForgotPassword = false
        },
        toggleShowModalForgotPassword: (state, action) => {
            state.showModalForgotPassword = !state.showModalForgotPassword
            state.showModalLogin = false
            state.showModalRegister = false
        },
        setLoggedUser: (state, action) => {
            state.loggedUser = action.payload
        },
        setIsLoadingUserInfo: (state, action) => {
            state.isLoadingUserInfo = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.isLoadingUserInfo = true;
        })
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            if (action.payload) {
                state.loggedUser = action.payload
            }
            state.isLoadingUserInfo = false;
        })
    }
})

export const {
    toggleShowModalLogin,
    toggleShowModalRegister,
    toggleShowModalForgotPassword,
    setLoggedUser,
    setIsLoadingUserInfo,
    setAccessToken
} = authSlice.actions
export default authSlice.reducer