import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState(0)
  const [visible, setVisible] = useState(false)
  const [viewable, setViewable] = useState(false)

  const toggleViewable = () => {
    setViewable(!viewable)
  }

  const updateBlog = async (event,blog) => {
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

  const removeBlog = async (event,blog) => {
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

  useEffect(() => {
    setVisible(false)
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [message, setMessage])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const compareBlog = (a,b) => {
    if (a.props.blog.likes > b.props.blog.likes) {
      return -1
    }
    if (a.props.blog.likes < b.props.blog.likes) {
      return 1
    }
    return 0
  }

  if (user === null) {
    return(
      <div>
        <Notification message={message} setMessage = {setMessage} messageType={messageType} setMessageType = {setMessageType}/>
        <Login
          username = {username}
          setUsername = {setUsername}
          password = {password}
          setPassword = {setPassword}
          setUser = {setUser}
          setMessage = {setMessage}
          setMessageType = {setMessageType}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType}/>
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br/>
      <Togglable visible={visible} setVisible={setVisible} buttonLabel="create new blog">
        <BlogForm
          setMessage = {setMessage}
          setMessageType = {setMessageType}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          setMessage={setMessage}
          setMessageType={setMessageType}
          viewable={viewable}
          toggleViewable={toggleViewable}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ).sort(compareBlog)}
    </div>
  )
}

export default App
