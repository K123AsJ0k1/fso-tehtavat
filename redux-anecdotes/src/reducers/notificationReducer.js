import { createSlice } from '@reduxjs/toolkit'

let initialState = ''

const notificationSlice = createSlice({
    name: 'notifications',
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
        setTimeout(() => {
            dispatch(clear())
        }, 1000*time);
    }
}

export default notificationSlice.reducer