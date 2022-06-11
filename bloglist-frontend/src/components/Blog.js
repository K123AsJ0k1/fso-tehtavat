import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  user,
  setMessage,
  setMessageType
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [viewable, setViewable] = useState(false)

  const toggleViewable = () => {
    setViewable(!viewable)
  }

  const updateBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.update(blog.id,{
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
      })
      setMessage(`A blog with a title ${blog.title} from an author ${blog.author} has been liked`)
      setMessageType(1)
      setTimeout(() => {
        setMessage('')
        setMessageType(0)
      }, 5000)
    } catch (exception) {
      setMessage('a failure happend in the creation process')
      setMessageType(2)
      setTimeout(() => {
        setMessage('')
        setMessageType(0)
      }, 5000)
    }
  }

  const removeBlog = async (event) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      event.preventDefault()

      try {
        await blogService.remove(blog.id)
        setMessage(`A blog with a ${blog.title} from an author ${blog.author} was deleted`)
        setMessageType(1)
        setTimeout(() => {
          setMessage('')
          setMessageType(0)
        }, 5000)
      } catch (exception) {
        setMessage('a failure happend in the creation process')
        setMessageType(2)
        setTimeout(() => {
          setMessage('')
          setMessageType(0)
        }, 5000)
      }
    }
  }

  if (viewable && blog.user.username === user.username) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleViewable}>hide</button>
          <br/>
          {blog.url}
          <br/>
        likes {blog.likes} <button onClick={updateBlog}>like</button>
          <br/>
          {blog.user.name}
          <button onClick={removeBlog}>remove</button>
        </div>
      </div>
    )
  }

  if (viewable) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleViewable}>hide</button>
          <br/>
          {blog.url}
          <br/>
        likes {blog.likes} <button onClick={updateBlog}>like</button>
          <br/>
          {blog.user.name}
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleViewable}>view</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog