import { useState } from "react";
import Blog from "./Blog";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = ({ user, blogs }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const compareBlog = (a, b) => {
    if (a.props.blog.likes > b.props.blog.likes) {
      return -1;
    }
    if (a.props.blog.likes < b.props.blog.likes) {
      return 1;
    }
    return 0;
  };

  if (user.name === "") {
    navigate("/login");
  }

  return (
    <div>
      <Togglable
        visible={visible}
        setVisible={setVisible}
        buttonLabel="create new blog"
      >
        <BlogForm />
      </Togglable>
      <Table striped>
        <tbody>
          {blogs
            .map((blog) => <Blog classname="blog" key={blog.id} blog={blog} />)
            .sort(compareBlog)}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
