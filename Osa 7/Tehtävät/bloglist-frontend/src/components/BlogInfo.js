import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { likingBlog, deleteBlog } from "../reducers/blogReducer";
import CommentForm from "./CommentForm";
import { Table, Button } from "react-bootstrap";

const BlogInfo = ({ user, blogs }) => {
  const navigate = useNavigate();
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
        navigate("/");
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

  /*
    <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <br />
        {blog.likes} likes{" "}
        <button onClick={(event) => likeBlog(event, blog)}>like</button>
        <br />
        added by {blog.user.name}
        <button onClick={(event) => removeBlog(event, blog)}>remove</button>
        <br />
        <br />
        <h5>comments</h5>
        <br />
        <CommentForm blog={blog} />
        <br />
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
  */
  if (blog.user.username === user.username) {
    return (
      <div>
        <h2>{blog.title}</h2>
        <Table striped>
          <tbody>
            <tr>
              <td>
                <Link to={blog.url}>{blog.url}</Link>
              </td>
            </tr>
            <tr>
              <td>
                {blog.likes} likes
                <Button
                  variant="primary"
                  onClick={(event) => likeBlog(event, blog)}
                >
                  like
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                added by {blog.user.name}
                <Button
                  variant="primary"
                  onClick={(event) => removeBlog(event, blog)}
                >
                  remove
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <h5>comments</h5>
        <CommentForm blog={blog} />
        <Table striped>
          <tbody>
            {blog.comments.map((comment, index) => (
              <tr key={index}>
                <td>{comment}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <Table striped>
        <tbody>
          <tr>
            <td>
              <Link to={blog.url}>{blog.url}</Link>
            </td>
          </tr>
          <tr>
            <td>
              {blog.likes} likes
              <Button
                variant="primary"
                onClick={(event) => likeBlog(event, blog)}
              >
                like
              </Button>
            </td>
          </tr>
          <tr>
            <td>added by {blog.user.name}</td>
          </tr>
        </tbody>
      </Table>
      <h5>comments</h5>
      <CommentForm blog={blog} />
      <Table striped>
        <tbody>
          {blog.comments.map((comment, index) => (
            <tr key={index}>
              <td>{comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BlogInfo;
