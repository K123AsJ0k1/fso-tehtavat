import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { commentingBlog } from "../reducers/blogReducer";

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
      <form onSubmit={commentBlog}>
        <div>
          <input
            id="comment"
            type="text"
            value={comment}
            name="comment"
            onChange={({ target }) => setComment(target.value)}
            placeholder="comment"
          />
          <button id="comment-button" type="submit">
            add comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
