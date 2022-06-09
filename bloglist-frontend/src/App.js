import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import blogService from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [url,setUrl])

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
      <CreateBlog
        url = {url}
        title = {title}
        author = {author}
        setUrl = {setUrl}
        setTitle = {setTitle}
        setAuthor = {setAuthor}  
        setMessage = {setMessage}
        setMessageType = {setMessageType}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
