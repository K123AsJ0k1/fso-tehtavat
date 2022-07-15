import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import BlogInfo from "./components/BlogInfo";
import Navigation from "./components/Navigation";
import User from "./components/User";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { setupUser } from "./reducers/userReducer";
import { initializeUsers } from "./reducers/usersReducer";

const App = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user_data = JSON.parse(loggedUserJSON);
      dispatch(setupUser(user_data));
    }
  }, [dispatch]);

  return (
    <div className="container">
      <Router>
        <Navigation user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} blogs={blogs} />} />
          <Route path="/users" element={<UserInfo users={users} />} />
          <Route path="/users/:id" element={<User users={users} />} />
          <Route
            path="/blogs/:id"
            element={<BlogInfo user={user} blogs={blogs} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
