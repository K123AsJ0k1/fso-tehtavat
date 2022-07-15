import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";
import { Form, Button } from "react-bootstrap";

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
      <h3>create new blog</h3>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button variant="primary" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default BlogForm;
