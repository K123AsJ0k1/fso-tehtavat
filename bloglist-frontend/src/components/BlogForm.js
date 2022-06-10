import { useState } from 'react'
import blogServices from '../services/blogs'

const BlogForm = (props) => {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()

        try {
            await blogServices.create({ 
                url: url,
                title: title, 
                author: author
            })
            setUrl('')
            setTitle('')
            setAuthor('')
            props.setMessage(`a new blog ${title} by ${author} added`)
            props.setMessageType(1)
            setTimeout(() => {
                props.setMessage(null)
                props.setMessageType(0)
            }, 5000)
        } catch (exception) {
            props.setMessage('a failure happend in the creation process')
            props.setMessageType(2)
            setTimeout(() => {
                props.setMessage(null)
                props.setMessageType(0)
            }, 5000)
        }
    }

    return(
        <div>
            <h2>create new</h2>
            <br/>
            <form onSubmit={addBlog}>
                <div>
                    title:
                        <input
                        type="text"
                        value={title}
                        name="title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                        <input
                        type="text"
                        value={author}
                        name="author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                        <input
                        type="text"
                        value={url}
                        name="url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm