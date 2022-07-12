import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import { useDispatch } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [viewable, setViewable] = useState(false);

  const toggleViewable = () => {
    setViewable(!viewable);
  };

  const createBlog = async (blog) => {
    try {
      await blogService.create(blog);
      dispatch(
        setNotification(
          `a new blog ${blog.title} by ${blog.author} added`,
          "success",
          5
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          "a failure happend in the creation process",
          "failure",
          5
        )
      );
    }
  };

  const updateBlog = async (event, blog) => {
    event.preventDefault();
    try {
      await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
      });
      dispatch(
        setNotification(
          `A blog with a title ${blog.title} from an author ${blog.author} has been liked`,
          "success",
          5
        )
      );
    } catch (exception) {
      dispatch(
        setNotification("a failure happend in the update process", "failure", 5)
      );
    }
  };

  const removeBlog = async (event, blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      event.preventDefault();

      try {
        await blogService.remove(blog.id);
        dispatch(
          setNotification(
            `A blog with a ${blog.title} from an author ${blog.author} was deleted`,
            "success",
            5
          )
        );
      } catch (exception) {
        dispatch(
          setNotification(
            "A failure happend in the deletion process",
            "failure",
            5
          )
        );
      }
    }
  };

  useEffect(() => {
    setVisible(false);
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const compareBlog = (a, b) => {
    if (a.props.blog.likes > b.props.blog.likes) {
      return -1;
    }
    if (a.props.blog.likes < b.props.blog.likes) {
      return 1;
    }
    return 0;
  };

  if (user === null) {
    return (
      <div>
        <Notification />
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setUser={setUser}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Togglable
        visible={visible}
        setVisible={setVisible}
        buttonLabel="create new blog"
      >
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .map((blog) => (
          <Blog
            classname="blog"
            key={blog.id}
            blog={blog}
            user={user}
            viewable={viewable}
            toggleViewable={toggleViewable}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
          />
        ))
        .sort(compareBlog)}
    </div>
  );
};

export default App;
