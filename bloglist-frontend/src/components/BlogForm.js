import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = () => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    try {
      dispatch(
        createBlog({
          url: url,
          title: title,
          author: author,
        })
      );
      dispatch(
        setNotification(`a new blog ${title} by ${author} added`, "success", 5)
      );
      setUrl("");
      setTitle("");
      setAuthor("");
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

  return (
    <div>
      <h2>create new</h2>
      <br />
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url"
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
