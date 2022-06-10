import { useState } from 'react'
const Blog = ({blog}) => {
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

  if (viewable) {
    return (
      <div style={blogStyle}>
        <div>
        {blog.title} {blog.author} <button onClick={toggleViewable}>hide</button>
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes} <button>like</button>
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

export default Blog