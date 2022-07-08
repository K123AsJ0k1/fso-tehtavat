import { voteAnectode } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const vote = (id) => {
        const selectedAnectode = anecdotes.find(anecdotes => anecdotes.id === id)
        dispatch(voteAnectode(selectedAnectode))
        dispatch(setNotification(`you voted '${selectedAnectode.content}'`, 10))
    }

    const compareVotes = (a,b) => {
        if (a.props.votes > b.props.votes) {
          return -1
        }
        if (a.props.votes < b.props.votes) {
          return 1
        }
        return 0
    }

    const checkContent = (anecdote) => {
        return anecdote.props.content.includes(filter)
    }
    
    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id} votes={anecdote.votes} content={anecdote.content}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
                ).sort(compareVotes).filter(checkContent)
            }
        </div>
    )
}

export default AnecdoteList