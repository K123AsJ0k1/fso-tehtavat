import loginService from "../services/login";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  setUser,
  setMessage,
  setMessageType,
}) => {
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("wrong username or password");
      setMessageType(2);
      setTimeout(() => {
        setMessage("");
        setMessageType(0);
      }, 5000);
    }
  };

  return (
    <div>
      <h3>log in to application</h3>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="text"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

Login.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default Login;
