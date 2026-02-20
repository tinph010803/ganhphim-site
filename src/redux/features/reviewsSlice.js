import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  showModal: false
}

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setShowModal: (state, action) => {
      state.showModal = action.payload
    },
  },
  extraReducers(builder) {

  }
})

export const {setShowModal} = reviewsSlice.actions

export default reviewsSlice.reducer