import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    incrementVote (state,action) {
      return state.map(anecdote => anecdote.id === action.payload ? {...anecdote, votes: anecdote.votes + 1} : anecdote)
    },
    createAnectode (state,action) {
      state.push(action.payload)
    },
    appendAnecdote (state, action) {
      state.push(action.payload)
    },
    setAnecdotes (state, action) {
      return action.payload
    }
  },
})

export const { createAnectode, incrementVote, getAnectode, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer