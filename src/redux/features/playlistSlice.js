import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import PlaylistApi from "@/api/playlist.api";

const initialState = {
  showModalUpdate: false,
  showModalAdd: false,
  updatePlaylist: null,
  playlist: [],
}

export const fetchPlaylist = createAsyncThunk(
  'playlist/fetchPlaylist',
  async (userId, thunkAPI) => {
    try {
      const {result} = await PlaylistApi.list()
      return result
    } catch (error) {
    }

    return false
  },
)

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    toggleShowModalAdd: (state, action) => {
      state.showModalAdd = !state.showModalAdd
    },
    toggleShowModalUpdate: (state, action) => {
      state.showModalUpdate = !state.showModalUpdate
    },
    setUpdatePlaylist: (state, action) => {
      state.updatePlaylist = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchPlaylist.fulfilled, (state, action) => {
      if (action.payload) {
        state.playlist = action.payload
      }
    })
  }
})

export const {
  toggleShowModalAdd,
  toggleShowModalUpdate,
  setUpdatePlaylist
} = playlistSlice.actions
export default playlistSlice.reducer