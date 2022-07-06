import { createSlice } from '@reduxjs/toolkit'
//import { getAnectode } from './anecdoteReducer'
//import { useDispatch } from 'react-redux'

//const dispatch = useDispatch()
let initialState = 'testi' 

const notificationSlice = createSlice({
    name: 'notifications',
    initialState
})

export default notificationSlice.reducer