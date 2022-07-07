import Filter from './components/Filter'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import anectodeService from './services/anectodes'
import { useEffect } from 'react'
import { setAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
//import anectodes from './services/anectodes'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anectodeService.getAll().then(anectodes => dispatch(setAnecdotes(anectodes)))
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification/>
      <Filter/>
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App