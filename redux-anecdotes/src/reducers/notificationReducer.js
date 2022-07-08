import { createSlice } from '@reduxjs/toolkit'

let initialState = ''
let timer = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        set (state, action) {
            state = action.payload
            return state
        },
        clear (state,action) {
            state = ''
            return state
        }
    },
})

export const { set, clear } = notificationSlice.actions

export const setNotification = (text, time) => {
    return dispatch => {
        dispatch(set(text))
        if (timer !== null) {
            clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
            dispatch(clear())
        }, 1000*time);
    }
}

export default notificationSlice.reducer