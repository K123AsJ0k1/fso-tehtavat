import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = (props) => {
    const handleLogin = async (event) => {
        event.preventDefault()
        
        try {
          const user = await loginService.login({ 
              username: props.username, 
              password: props.password 
          })
          window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
          blogService.setToken(user.token)
          props.setUser(user)
          props.setUsername('')
          props.setPassword('')
        } catch (exception) {
          props.setErrorMessage('wrong credentials')
          setTimeout(() => {
            props.setErrorMessage(null)
          }, 5000)
        }
    }

    return (
        <div>
            <h3>log in to application</h3>
            <form onSubmit={handleLogin}>
                <div>
                    username
                        <input
                        type="text"
                        value={props.username}
                        name="username"
                        onChange={({ target }) => props.setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                        <input
                        type="text"
                        value={props.password}
                        name="password"
                        onChange={({ target }) => props.setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login
