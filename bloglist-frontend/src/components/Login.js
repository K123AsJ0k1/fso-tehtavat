import loginService from "../services/login";
import { setupUser } from "../reducers/userReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      dispatch(setupUser(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong username or password", "failure", 5));
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

export default Login;
