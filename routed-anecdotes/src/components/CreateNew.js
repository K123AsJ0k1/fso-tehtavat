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
    //type={content.type} value={content.value} onChange={content.onChange}
    //type={author.type} value={author.value} onChange={author.onChange}
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input  {...content} />
          </div>
          <div>
            author
            <input  {...author} />
          </div>
          <div>
            url for more info
            <input {...info} />
          </div>
          <button>create</button>
          <button onClick={handleReset}>reset</button>
        </form>
      </div>
    ) 
}

export default CreateNew