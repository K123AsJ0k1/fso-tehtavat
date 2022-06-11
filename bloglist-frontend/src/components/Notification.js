import '../index.css'
import PropTypes from 'prop-types'

const Notification = ({ message, messageType }) => {
    if (messageType == 1) {
      return (
        <div className="success">
          {message}
        </div>
      )
    }
    if (messageType == 2) {
      return (
        <div className="failure">
          {message}
        </div>
      )
    }
    return null
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  messageType: PropTypes.number.isRequired
}

export default Notification