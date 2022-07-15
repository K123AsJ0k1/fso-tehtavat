import Notification from "./Notification";
import { useDispatch } from "react-redux";
import { clearUserSetup } from "../reducers/userReducer";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = ({ user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUserSetup());
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link to="/">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user.name} logged in{" "}
              <button onClick={handleLogout}>logout</button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h2>blog app</h2>
      <Notification />
    </div>
  );
};

export default Navigation;
