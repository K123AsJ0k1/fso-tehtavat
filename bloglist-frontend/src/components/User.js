import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

const User = ({ users }) => {
  const id = useParams().id;
  const user = users.find((data) => data.id === id);

  if (!user) {
    return null;
  }

  const blogs = user.blogs;

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <Table striped>
        <tbody>
          <tr>
            <td>Title:</td>
            <td>Author:</td>
            <td>Url:</td>
          </tr>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>{blog.url}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default User;
