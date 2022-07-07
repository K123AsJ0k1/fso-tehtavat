import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    incrementVote (state,action) {
      return state.map(anecdote => anecdote.id === action.payload ? {...anecdote, votes: anecdote.votes + 1} : anecdote)
    },
    createAnectode (state,action) {
      return state.concat(asObject(action.payload))
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