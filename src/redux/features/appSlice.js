import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import CountryApi from "@/api/country.api";
import GenreApi from "@/api/genre.api";
import ConfigApi from "@/api/config.api";
import {isQuocKhanhActiveNow} from "@/utils/helpers";
import RobongApi from "@/api/robong.api";

const initialState = {
    showSearchMobile: false,
    tooltipItem: null,
    hoverItemRect: null,
    tooltipOffsetLeft: 0,
    tooltipOffsetTop: 0,
    favoriteIds: [],
    enableVideoPreviewSound: false,
    topSlideActiveIndex: 0,
    topSlideShowReplayBtn: false,
    topSlideShowVideoPreview: false,
    isPageLoading: true,
    // search
    showSearchResult: false,
    showModalShare: false,
    countries: [],
    genres: [],
    configAds: null,
    tier: "free",
    isQuocKhanhActive: isQuocKhanhActiveNow(),
    hotMatches: [],
}

export const fetchHotMatches = createAsyncThunk(
    'app/fetchHotMatches',
    async (thunkAPI) => {
        const {result} = await RobongApi.hotMatches()
        return result
    },
)

export const fetchCountries = createAsyncThunk(
    'app/fetchCountries',
    async (thunkAPI) => {
        const {result} = await CountryApi.list()
        return result
    },
)

export const fetchGenres = createAsyncThunk(
    'app/fetchGenres',
    async (thunkAPI) => {
        const {result} = await GenreApi.list()
        return result
    },
)

export const fetchConfigList = createAsyncThunk(
    'app/fetchConfigList',
    async (thunkAPI) => {
        const {result} = await ConfigApi.list()
        return result
    },
)

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        showMovieTooltipInfo: (state, action) => {
            state.tooltipItem = action.payload.tooltipItem
            state.hoverItemRect = action.payload.hoverItemRect
            state.tooltipOffsetLeft = action.payload.tooltipOffsetLeft
            state.tooltipOffsetTop = action.payload.tooltipOffsetTop
        },
        addFavoriteIds: (state, action) => {
            state.favoriteIds = [...state.favoriteIds, ...action.payload]
        },
        removeFavoriteIds: (state, action) => {
            state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload)
        },
        toggleEnableVideoPreviewSound: (state, action) => {
            state.enableVideoPreviewSound = !state.enableVideoPreviewSound
        },
        setTopSlideActiveIndex: (state, action) => {
            state.topSlideActiveIndex = action.payload
        },
        setTopSlideShowReplayBtn: (state, action) => {
            state.topSlideShowReplayBtn = action.payload
        },
        setTopSlideShowVideoPreview: (state, action) => {
            state.topSlideShowVideoPreview = action.payload
        },
        setShowSearchResult: (state, action) => {
            state.showSearchResult = action.payload
        },
        setIsPageLoading: (state, action) => {
            state.isPageLoading = action.payload
        },
        setShowModalShare: (state, action) => {
            state.showModalShare = action.payload
        },
        setTier(state, action) {
            state.tier = action.payload; // "vip" | "free"
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchCountries.fulfilled, (state, action) => {
            state.countries = action.payload
        })

        builder.addCase(fetchGenres.fulfilled, (state, action) => {
            state.genres = action.payload
        })

        builder.addCase(fetchHotMatches.fulfilled, (state, action) => {
            if (action.payload) {
                state.hotMatches = action.payload
            }
        })

        builder.addCase(fetchConfigList.fulfilled, (state, action) => {
            if (action.payload?.ads && !state.isQuocKhanhActive) {
                state.configAds = action.payload.ads
            }
        })
    }
})

export const {
    showMovieTooltipInfo,
    addFavoriteIds,
    removeFavoriteIds,
    toggleEnableVideoPreviewSound,
    setTopSlideActiveIndex,
    setTopSlideShowReplayBtn,
    setTopSlideShowVideoPreview,
    setShowSearchResult,
    setIsPageLoading,
    setShowModalShare,
    setTier
} = appSlice.actions
export default appSlice.reducer