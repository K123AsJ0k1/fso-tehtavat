import { createAnectode } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnectode(content))
        dispatch(setNotification(content))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote"/>
                </div>
            <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm