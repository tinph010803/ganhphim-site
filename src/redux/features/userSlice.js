import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import NotificationApi from "@/api/notification.api";
import UserApi from "@/api/user.api";

const initialState = {
    showModalChangeAvatar: false,
    showModalUploadAvatar: false,
    showModalChangePassword: false,
    showModalSetPassword: false,
    showDropdownUserMenu: false,
    showDropdownNotification: false,
    latestMovieNotifications: [],
    latestCommunityNotifications: [],
    totalNewMovie: 0,
    totalNewCommunity: 0,
    totalNew: 0
}

export const fetchLatestNotifications = createAsyncThunk(
    'user/fetchLatestNotifications',
    async (thunkAPI) => {
        try {
            const {result} = await NotificationApi.latest()
            return result
        } catch (e) {
        }

        return false
    },
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setShowModalChangeAvatar: (state, action) => {
            state.showModalChangeAvatar = action.payload
        },
        setShowModalUploadAvatar: (state, action) => {
            state.showModalUploadAvatar = action.payload
        },
        setShowModalChangePassword: (state, action) => {
            state.showModalChangePassword = action.payload
        },
        setShowModalSetPassword: (state, action) => {
            state.showModalSetPassword = action.payload
        },
        setShowDropdownUserMenu: (state, action) => {
            state.showDropdownUserMenu = action.payload
        },
        setShowDropdownNotification: (state, action) => {
            state.showDropdownNotification = action.payload
        },
        setLatestMovieNotifications: (state, action) => {
            state.latestMovieNotifications = action.payload
        },
        setLatestCommunityNotifications: (state, action) => {
            state.latestCommunityNotifications = action.payload
        },
        seenAll: (state, action) => {
            state.totalNew = 0
            state.totalNewMovie = 0
            state.totalNewCommunity = 0
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchLatestNotifications.fulfilled, (state, action) => {
            if (action.payload) {
                state.latestMovieNotifications = action.payload.movieNotifications
                state.latestCommunityNotifications = action.payload.communityNotifications
                const {movie, community} = action.payload.totalNew
                state.totalNewMovie = movie
                state.totalNewCommunity = community
                state.totalNew = movie + community
            }
        })
    }
})

export const {
    setShowModalChangeAvatar,
    setShowModalUploadAvatar,
    setShowModalChangePassword,
    setShowModalSetPassword,
    setShowDropdownUserMenu,
    setShowDropdownNotification,
    setLatestMovieNotifications,
    setLatestCommunityNotifications,
    seenAll
} = userSlice.actions
export default userSlice.reducer