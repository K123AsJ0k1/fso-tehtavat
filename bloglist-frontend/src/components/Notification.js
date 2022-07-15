import "../index.css";
import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification.type === "success") {
    return <Alert variant="success">{notification.content}</Alert>;
  }
  if (notification.type === "failure") {
    return <Alert variant="failure">{notification.content}</Alert>;
  }
  return null;
};

export default Notification;
