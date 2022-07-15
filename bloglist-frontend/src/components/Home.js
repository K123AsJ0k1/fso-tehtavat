import { useState } from "react";
import Blog from "./Blog";
import Login from "./Login";
import Notification from "./Notification";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const Home = ({ user, blogs }) => {
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
    return (
      <div>
        <Notification />
        <Login />
      </div>
    );
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
      {blogs
        .map((blog) => <Blog classname="blog" key={blog.id} blog={blog} />)
        .sort(compareBlog)}
    </div>
  );
};

export default Home;
