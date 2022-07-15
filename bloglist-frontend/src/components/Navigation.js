import Notification from "./Notification";
import { useDispatch } from "react-redux";
import { clearUserSetup } from "../reducers/userReducer";

const Navigation = ({ user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUserSetup());
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>{user.username} logged in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
};

export default Navigation;
