import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { commentingBlog } from "../reducers/blogReducer";
import { Form, Button } from "react-bootstrap";

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const commentBlog = (event) => {
    event.preventDefault();
    try {
      dispatch(commentingBlog(blog, comment));
      dispatch(
        setNotification(
          `A blog with a title ${blog.title} from an author ${blog.author} has been commented`,
          "success",
          5
        )
      );
      setComment("");
    } catch (exception) {
      dispatch(
        setNotification(
          "a failure happend in the comment process",
          "failure",
          5
        )
      );
    }
  };

  return (
    <div>
      <Form onSubmit={commentBlog}>
        <Form.Group>
          <Form.Control
            type="text"
            name="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button variant="primary" type="submit">
            add comment
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CommentForm;
