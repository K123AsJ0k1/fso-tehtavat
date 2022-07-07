import { createSlice } from '@reduxjs/toolkit'
//import { setNotification } from './notificationReducer'
//import { useDispatch } from 'react-redux'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

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
  },
})

export const { createAnectode, incrementVote, getAnectode } = anecdoteSlice.actions
export default anecdoteSlice.reducer