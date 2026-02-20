import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  dateSelected: null
}

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setDateSelected: (state, action) => {
      state.dateSelected = action.payload
    },
  },
  extraReducers(builder) {

  }
})

export const {setDateSelected} = scheduleSlice.actions

export default scheduleSlice.reducer