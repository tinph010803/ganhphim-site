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
    hotSeries: [],
    hotSingles: [],
    cinemaMovies: [],
    animeMovies: [],
    hongKongMovies: [],
    koreanMovies: [],
    chineseMovies: [],
    usUkMovies: [],
    horrorMovies: [],
    showReportModal: false,
    curGtavnServer: 'server_1',
    reduceLag: false
}

export const fetchHotMovies = createAsyncThunk(
    'movie/fetchHotMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.hot()
        return result
    },
)

export const fetchHotSeries = createAsyncThunk(
    'movie/fetchHotSeries',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({type: '2', page: 1})
        return result?.items || []
    },
)

export const fetchHotSingles = createAsyncThunk(
    'movie/fetchHotSingles',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({type: '1', page: 1})
        return (result?.items || []).slice(0, 10)
    },
)

export const fetchCinemaMovies = createAsyncThunk(
    'movie/fetchCinemaMovies',
    async (_, thunkAPI) => {
        return await MovieApi.cinema()
    },
)

export const fetchAnimeMovies = createAsyncThunk(
    'movie/fetchAnimeMovies',
    async (_, thunkAPI) => {
        const items = await MovieApi.bySlug('hoat-hinh')
        return (items || []).slice(0, 20)
    },
)

export const fetchHongKongMovies = createAsyncThunk(
    'movie/fetchHongKongMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({countries: ['hong-kong'], page: 1})
        return (result?.items || []).slice(0, 20)
    },
)

export const fetchKoreanMovies = createAsyncThunk(
    'movie/fetchKoreanMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({countries: ['han-quoc'], page: 1, sort: 'release_date'})
        return (result?.items || []).slice(0, 20).sort((a, b) => (b.year || 0) - (a.year || 0))
    },
)

export const fetchChineseMovies = createAsyncThunk(
    'movie/fetchChineseMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({countries: ['trung-quoc'], page: 1, sort: 'release_date'})
        return (result?.items || []).slice(0, 20).sort((a, b) => (b.year || 0) - (a.year || 0))
    },
)

export const fetchUsUkMovies = createAsyncThunk(
    'movie/fetchUsUkMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({countries: ['au-my'], page: 1, sort: 'release_date'})
        return (result?.items || []).slice(0, 20).sort((a, b) => (b.year || 0) - (a.year || 0))
    },
)

export const fetchHorrorMovies = createAsyncThunk(
    'movie/fetchHorrorMovies',
    async (_, thunkAPI) => {
        const result = await MovieApi.filter({genres: ['kinh-di'], page: 1})
        return (result?.items || []).slice(0, 20)
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
            state.curGtavnServer = 'server_1'
        },
        toggleShowReportModal: (state, action) => {
            state.showReportModal = !state.showReportModal
        },
        setCurGtavnServer: (state, action) => {
            state.curGtavnServer = action.payload
        },
        setReduceLag: (state, action) => {
            state.reduceLag = action.payload
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
        builder.addCase(fetchHotSeries.fulfilled, (state, action) => {
            if (action.payload) {
                state.hotSeries = action.payload
            }
        })
        builder.addCase(fetchHotSingles.fulfilled, (state, action) => {
            if (action.payload) {
                state.hotSingles = action.payload
            }
        })
        builder.addCase(fetchCinemaMovies.fulfilled, (state, action) => {
            if (action.payload) {
                state.cinemaMovies = action.payload
            }
        })
        builder.addCase(fetchAnimeMovies.fulfilled, (state, action) => {
            if (action.payload) {
                state.animeMovies = action.payload
            }
        })
        builder.addCase(fetchHongKongMovies.fulfilled, (state, action) => {
            if (action.payload) {
                state.hongKongMovies = action.payload
            }
        })
        builder.addCase(fetchKoreanMovies.fulfilled, (state, action) => {
            if (action.payload) state.koreanMovies = action.payload
        })
        builder.addCase(fetchChineseMovies.fulfilled, (state, action) => {
            if (action.payload) state.chineseMovies = action.payload
        })
        builder.addCase(fetchUsUkMovies.fulfilled, (state, action) => {
            if (action.payload) state.usUkMovies = action.payload
        })
        builder.addCase(fetchHorrorMovies.fulfilled, (state, action) => {
            if (action.payload) {
                state.horrorMovies = action.payload
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
    toggleShowReportModal,
    setCurGtavnServer,
    setReduceLag
} = movieSlice.actions
export default movieSlice.reducer