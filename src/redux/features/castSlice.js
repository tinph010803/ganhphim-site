import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import CastApi from "@/api/cast.api";

const initialState = {
  filter: null,
  filterCasts: [],
  filterPageCount: 0,
  filterIsLoading: true
}

export const fetchFilterCasts = createAsyncThunk(
  'cast/fetchFilterCasts',
  async (filter = {}, thunkAPI) => {
    const result = await CastApi.list(filter)
    return result
  },
)

export const castSlice = createSlice({
  name: 'cast',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    castResetFilterData: (state, action) => {
      return initialState
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchFilterCasts.fulfilled, (state, action) => {
      state.filterCasts = action.payload.items
      state.filterPageCount = action.payload.page_count
      state.filterIsLoading = false
    })
    builder.addCase(fetchFilterCasts.pending, (state, action) => {
      state.filterCasts = []
      state.filterIsLoading = true
    })
  }
})

export const {setFilter, castResetFilterData} = castSlice.actions

export default castSlice.reducer