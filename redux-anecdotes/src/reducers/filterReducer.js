import { createSlice } from '@reduxjs/toolkit'

let initialState = ''

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter (state, action) {
            state = action.payload
            return state
        },
        removeFilter (state) {
            state = ''
            return state
        }
    },
})

export const { setFilter, removeFilter } = filterSlice.actions
export default filterSlice.reducer