import Notification from "./Notification";
import { useSelector, useDispatch } from "react-redux";
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
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
};

export default Navigation;
