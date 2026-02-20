import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import MovieApi from "@/api/movie.api";
import ContinueWatchingApi from "@/api/continueWatching.api";

const initialState = {
    curSeason: null,
    curEpisode: null,
    curVersion: null,
    clickedEpisode: false,
    videoEnded: false,
    curSeasonNumberPlayer: null,
    curEpisodeNumberPlayer: null,
    curVersionPlayer: null,
    cwInfo: null,
    cwInfoLoading: true,
    filterMovies: [],
    cwMoviesHome: [],
    cwMoviesList: [],
    cwMoviesListLoading: false,
    cwPageCount: false,
    filterPageCount: 0,
    filterIsLoading: true,
    hotMovies: [],
    showReportModal: false
}

export const fetchHotMovies = createAsyncThunk(
    'movie/fetchHotMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.hot()
        return result
    },
)

export const fetchFilterMovies = createAsyncThunk(
    'movie/fetchFilterMovies',
    async (filter = {}, thunkAPI) => {
        const result = await MovieApi.filter(filter)
        return result
    },
)

export const fetchCwMoviesHome = createAsyncThunk(
    'movie/fetchCwMoviesHome',
    async (filter = {}, thunkAPI) => {
        try {
            const {result} = await ContinueWatchingApi.list({limit: 20})
            return result
        } catch (err) {
        }

        return false
    },
)

export const fetchCwMoviesList = createAsyncThunk(
    'movie/fetchCwMoviesList',
    async (filter = {}, thunkAPI) => {
        try {
            const {result} = await ContinueWatchingApi.list(filter)
            return result
        } catch (err) {
        }

        return false
    },
)

export const movieSlice = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        setCurSeason: (state, action) => {
            state.curSeason = action.payload
        },
        setCurVersion: (state, action) => {
            state.curVersion = action.payload
        },
        setCurEpisode: (state, action) => {
            state.curEpisode = action.payload
        },
        setClickedEpisode: (state, action) => {
            state.clickedEpisode = action.payload
        },
        setVideoEnded: (state, action) => {
            state.videoEnded = action.payload
        },
        setCurSeasonNumberPlayer: (state, action) => {
            state.curSeasonNumberPlayer = action.payload
        },
        setCurVersionPlayer: (state, action) => {
            state.curVersionPlayer = action.payload
        },
        setCurEpisodeNumberPlayer: (state, action) => {
            state.curEpisodeNumberPlayer = action.payload
        },
        setFilterMovies: (state, action) => {
            state.filterMovies = action.payload
        },
        setFilterIsLoading: (state, action) => {
            state.filterIsLoading = action.payload
        },
        setCwInfoLoading: (state, action) => {
            state.cwInfoLoading = action.payload
        },
        setCwInfo: (state, action) => {
            state.cwInfo = action.payload
        },
        setCwMoviesHome: (state, action) => {
            state.cwMoviesHome = action.payload
        },
        setCwMoviesList: (state, action) => {
            state.cwMoviesList = action.payload
        },
        resetFilterData: (state, action) => {
            state.filterMovies = []
            state.filterPageCount = 0
            state.filterIsLoading = true
        },
        resetWatchData: (state, action) => {
            state.curSeason = null
            state.curEpisode = null
            state.curVersion = null
            state.curSeasonNumberPlayer = null
            state.curEpisodeNumberPlayer = null
            state.curVersionPlayer = null
            state.cwInfo = null
            state.videoEnded = false
        },
        toggleShowReportModal: (state, action) => {
            state.showReportModal = !state.showReportModal
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchFilterMovies.fulfilled, (state, action) => {
            state.filterMovies = action.payload.items
            state.filterPageCount = action.payload.page_count
            state.filterIsLoading = false
        })
        builder.addCase(fetchFilterMovies.pending, (state, action) => {
            state.filterMovies = []
            state.filterIsLoading = true
        })
        builder.addCase(fetchCwMoviesHome.fulfilled, (state, action) => {
            if (action.payload) {
                state.cwMoviesHome = action.payload.items
            }
            state.cwMoviesListLoading = false
        })
        builder.addCase(fetchCwMoviesHome.pending, (state, action) => {
            state.cwMoviesHome = []
            state.cwMoviesListLoading = true
        })
        builder.addCase(fetchCwMoviesList.fulfilled, (state, action) => {
            if (action.payload) {
                state.cwMoviesList = action.payload.items
                state.cwPageCount = action.payload.page_count
            }
            state.cwMoviesListLoading = false
        })
        builder.addCase(fetchCwMoviesList.pending, (state, action) => {
            state.cwMoviesList = []
            state.cwMoviesListLoading = true
        })
        builder.addCase(fetchHotMovies.fulfilled, (state, action) => {
            if (action.payload) {
                state.hotMovies = action.payload
            }
        })
    }
})

export const {
    setCurSeason,
    setCurVersion,
    setCurEpisode,
    setClickedEpisode,
    setVideoEnded,
    setFilterIsLoading,
    resetFilterData,
    setCurSeasonNumberPlayer,
    setCurEpisodeNumberPlayer,
    setCurVersionPlayer,
    setCwInfoLoading,
    setCwInfo,
    setCwMoviesHome,
    setCwMoviesList,
    resetWatchData,
    toggleShowReportModal
} = movieSlice.actions
export default movieSlice.reducer