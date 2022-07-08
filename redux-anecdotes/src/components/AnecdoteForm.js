//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux' 
import { createAnectode } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    //const dispatch = useDispatch()
    
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnectode(content)
        props.setNotification(`you created anecdote '${content}'`, 10)
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

const mapStateToProps = (state) => {
    return state
}
  
const mapDispatchToProps = {
    createAnectode,
    setNotification
}

export default connect(mapStateToProps,mapDispatchToProps)(AnecdoteForm)