import { createSlice } from '@reduxjs/toolkit'

let initialState = ''

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotification (state, action) {
           state = action.payload
           return state
        },
        removeNotification (state) {
            state = ''
            return state
        }
    },
})

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer