import { incrementVote } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const dispatch = useDispatch()

    const vote = (id) => {
        dispatch(incrementVote(id))
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
    
    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id} votes={anecdote.votes}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
                ).sort(compareVotes)
            }
        </div>
    )
}

export default AnecdoteList