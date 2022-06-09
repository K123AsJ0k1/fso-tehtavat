import '../index.css'

const Notification = (props) => {
    if (props.messageType == 1) {
      return (
        <div className="success">
          {props.message}
        </div>
      )
    }
    if (props.messageType == 2) {
      return (
        <div className="failure">
          {props.message}
        </div>
      )
    }
    return null
}

export default Notification