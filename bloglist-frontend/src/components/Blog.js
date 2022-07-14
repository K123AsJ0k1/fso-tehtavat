import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { likingBlog, deleteBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch();

  const [viewable, setViewable] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleViewable = () => {
    setViewable(!viewable);
  };

  const likeBlog = (event, blog) => {
    event.preventDefault();
    try {
      dispatch(likingBlog(blog));
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

  const removeBlog = (event, blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      event.preventDefault();
      try {
        dispatch(deleteBlog(blog));
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

  if (viewable && blog.user.username === user.username) {
    return (
      <div className="blog" style={blogStyle}>
        <div>
          {blog.title} {blog.author}{" "}
          <button onClick={toggleViewable}>hide</button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}{" "}
          <button onClick={(event) => likeBlog(event, blog)}>like</button>
          <br />
          {blog.user.name}
          <button onClick={(event) => removeBlog(event, blog)}>remove</button>
        </div>
      </div>
    );
  }

  if (viewable) {
    return (
      <div className="blog" style={blogStyle}>
        <div>
          {blog.title} {blog.author}{" "}
          <button onClick={toggleViewable}>hide</button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}{" "}
          <button onClick={(event) => likeBlog(event, blog)}>like</button>
          <br />
          {blog.user.name}
        </div>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}{" "}
        <button onClick={toggleViewable}>view</button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
