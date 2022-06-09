import blogServices from '../services/blogs'

const CreateBlog = (props) => {
    const handleCreation = async (event) => {
        event.preventDefault()

        try {
            await blogServices.create({ 
                url: props.url,
                title: props.title, 
                author: props.author
            })
            props.setUrl('')
            props.setTitle('')
            props.setAuthor('')
        } catch (exception) {
            props.setErrorMessage('failure in the creation process')
            setTimeout(() => {
            props.setErrorMessage(null)
          }, 5000)
        }
    }

    return(
        <div>
            <h2>create new</h2>
            <br/>
            <form onSubmit={handleCreation}>
                <div>
                    title:
                        <input
                        type="text"
                        value={props.title}
                        name="title"
                        onChange={({ target }) => props.setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                        <input
                        type="text"
                        value={props.author}
                        name="author"
                        onChange={({ target }) => props.setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                        <input
                        type="text"
                        value={props.url}
                        name="url"
                        onChange={({ target }) => props.setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default CreateBlog