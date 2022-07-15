import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { likingBlog } from "../reducers/blogReducer";

const BlogInfo = ({ blogs }) => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const blog = blogs.find((data) => data.id === id);

  if (!blog) {
    return null;
  }

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

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <br />
      {blog.likes} likes{" "}
      <button onClick={(event) => likeBlog(event, blog)}>like</button>
      <br />
      added by {blog.user.name}
    </div>
  );
};

export default BlogInfo;
