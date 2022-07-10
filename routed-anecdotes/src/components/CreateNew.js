import { useField } from '../hooks/index'

const CreateNew = ({ addNew }) => {
    const content = useField('content')
    const author = useField('author')
    const info = useField('info')
    
    const handleSubmit = (e) => {
      e.preventDefault()
      addNew({
        content: content.value,
        author: author.value,
        info: info.value,
        votes: 0
      })
    }

    const handleReset = (e) => {
      e.preventDefault()
      content.reset()
      author.reset()
      info.reset()
    }
    
    const spread_modification = (object) => {
      let newObject = {...object}
      delete newObject['reset']
      return newObject
    } 

    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input { ...spread_modification(content) } />
          </div>
          <div>
            author
            <input  { ...spread_modification(author)} />
          </div>
          <div>
            url for more info
            <input { ...spread_modification(info)} />
          </div>
          <button>create</button>
          <button onClick={handleReset}>reset</button>
        </form>
      </div>
    ) 
}

export default CreateNew