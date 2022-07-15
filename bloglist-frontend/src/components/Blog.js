import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { likingBlog, deleteBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
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

  return (
    <div className="blog" style={blogStyle}>
      <a href={`/blogs/${blog.id}`}>{blog.title}</a>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
