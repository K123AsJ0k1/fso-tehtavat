import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import Navigation from "./components/Navigation";
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
    <Router>
      <Navigation user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} blogs={blogs} />} />
        <Route path="/users" element={<UserInfo users={users} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
