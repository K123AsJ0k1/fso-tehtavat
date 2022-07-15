import { Button } from "react-bootstrap";

const Togglable = (props) => {
  const hideWhenVisible = { display: props.visible ? "none" : "" };
  const showWhenVisible = { display: props.visible ? "" : "none" };

  const toggleVisibility = () => {
    props.setVisible(!props.visible);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="primary" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  );
};

export default Togglable;
