import "../index.css";
//import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification.type === "success") {
    return <div className="success">{notification.content}</div>;
  }
  if (notification.type === "failure") {
    return <div className="failure">{notification.content}</div>;
  }
  return null;
};

export default Notification;
