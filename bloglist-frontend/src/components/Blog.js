import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  user,
  updateBlog,
  removeBlog
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

  if (viewable && blog.user.username === user.username) {
    return (
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleViewable}>hide</button>
          <br/>
          {blog.url}
          <br/>
          likes {blog.likes} <button onClick={event => updateBlog(event,blog)}>like</button>
          <br/>
          {blog.user.name}
          <button onClick={event => removeBlog(event,blog)}>remove</button>
        </div>
      </div>
    )
  }


  if (viewable) {
    return (
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleViewable}>hide</button>
          <br/>
          {blog.url}
          <br/>
          likes {blog.likes} <button onClick={event => updateBlog(event,blog)}>like</button>
          <br/>
          {blog.user.name}
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
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