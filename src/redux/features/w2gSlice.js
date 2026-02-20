import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import W2gApi from "@/api/w2g.api";

const initialState = {
    showModalCreateGuide: false,
    totalViewers: 0,
    roomId: null,
    roomStatus: null,
    roomStartTime: null,
    roomPlayerStartTime: null,
    remindRoomIds: null,
    roomSeason: null,
    roomEpisode: null,
    premiereRooms: [],
    normalRooms: [],
    myRooms: [],
    isLoading: true,
    hasMore: true,
}

export const fetchRemindRoomIds = createAsyncThunk(
    'w2g/fetchRemindRoomIds',
    async (thunkAPI) => {
        const {result} = await W2gApi.remindRoomIds()
        return result
    },
)

export const fetchLatestPremiereRooms = createAsyncThunk(
    'w2g/fetchLatestPremiereRooms',
    async (thunkAPI) => {
        const {result} = await W2gApi.latestPremiereRooms()
        return result
    },
)

export const fetchNormalRooms = createAsyncThunk(
    'w2g/fetchNormalRooms',
    async (filter) => {
        const {result} = await W2gApi.listNormalRooms(filter)
        return {page: filter.page, ...result}
    },
)

export const fetchMyRooms = createAsyncThunk(
    'w2g/fetchMyRooms',
    async (filter) => {
        const {result} = await W2gApi.myRooms(filter)
        return {page: filter.page, ...result}
    },
)

export const w2gSlice = createSlice({
    name: 'w2g',
    initialState,
    reducers: {
        toggleShowModalCreateGuide: (state, action) => {
            state.showModalCreateGuide = !state.showModalCreateGuide
        },
        setTotalViewers: (state, action) => {
            state.totalViewers = action.payload
        },
        setRoomStatus: (state, action) => {
            state.roomStatus = action.payload
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload
        },
        setRoomSeason: (state, action) => {
            state.roomSeason = action.payload
        },
        setRoomEpisode: (state, action) => {
            state.roomEpisode = action.payload
        },
        setRoomStartTime: (state, action) => {
            state.roomStartTime = action.payload
        },
        setRoomPlayerStartTime: (state, action) => {
            state.roomPlayerStartTime = action.payload
        },
        setRoomStartLive: (state, action) => {
            const {start_time, player_start_time} = action.payload
            state.roomStatus = 1
            state.roomStartTime = start_time
            state.roomPlayerStartTime = player_start_time
        },
        setRoomEndLive: (state, action) => {
            state.roomStatus = 2
        },
        addRemindRoomIds: (state, action) => {
            state.remindRoomIds = [...state.remindRoomIds, action.payload]
        },
        removeRemindRoomIds: (state, action) => {
            state.remindRoomIds = state.remindRoomIds.filter(id => id !== action.payload)
        },
        updatePremiereRoomById: (s, { payload: { roomId, data } }) => {
            const r = s.premiereRooms.find(x => x._id === roomId);
            if (r) Object.assign(r, data);
        },
        updateNormalRoomById: (s, { payload: { roomId, data } }) => {
            const r = s.normalRooms.find(x => x._id === roomId);
            if (r) Object.assign(r, data);
        },
        updateMyRoomById: (s, { payload: { roomId, data } }) => {
            const r = s.myRooms.find(x => x._id === roomId);
            if (r) Object.assign(r, data);
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchRemindRoomIds.fulfilled, (state, action) => {
            state.remindRoomIds = action.payload
        })
        builder.addCase(fetchLatestPremiereRooms.fulfilled, (state, action) => {
            state.premiereRooms = action.payload
        })
        builder.addCase(fetchNormalRooms.pending, (state, action) => {
            state.isLoading = true
            state.hasMore = false
        })
        builder.addCase(fetchMyRooms.pending, (state, action) => {
            state.isLoading = true
            state.hasMore = false
        })
        builder.addCase(fetchNormalRooms.fulfilled, (state, action) => {
            const {hasMore, rooms, page} = action.payload
            if (page > 1) {
                state.normalRooms = [...state.normalRooms, ...rooms]
            } else {
                state.normalRooms = rooms
            }
            state.hasMore = hasMore
            state.isLoading = false
        })
        builder.addCase(fetchMyRooms.fulfilled, (state, action) => {
            const {hasMore, rooms, page} = action.payload
            if (page > 1) {
                state.myRooms = [...state.myRooms, ...rooms]
            } else {
                state.myRooms = rooms
            }
            state.hasMore = hasMore
            state.isLoading = false
        })
    }
})

export const {
    toggleShowModalCreateGuide,
    setTotalViewers,
    setRoomStatus,
    setRoomStartTime,
    addRemindRoomIds,
    removeRemindRoomIds,
    setRoomStartLive,
    setRoomEndLive,
    setRoomPlayerStartTime,
    setRoomId,
    setRoomSeason,
    setRoomEpisode,
    updatePremiereRoomById,
    updateNormalRoomById,
    updateMyRoomById
} = w2gSlice.actions

export default w2gSlice.reducer