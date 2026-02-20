import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  currentPage: 1
}

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = Number(action.payload)
    },
  },
  extraReducers(builder) {

  }
})

export const {
  setCurrentPage
} = paginationSlice.actions
export default paginationSlice.reducer