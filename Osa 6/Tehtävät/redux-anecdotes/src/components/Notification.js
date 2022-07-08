//import { useSelector } from 'react-redux'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { set } from '../reducers/notificationReducer'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const [visible, setVisible] = useState(false)
  //const notification = useSelector(state => state.notifications)
  
  useEffect(() => {
    if (props.notification !== '') {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [props.notification])
  
  if (visible) {
    return (
      <div style={style}>
        {props.notification}
      </div>
    )
  }
  return null
}

const mapStateToProps = (state) => {
  return { notification: state.notification }
}

export default connect(mapStateToProps)(Notification)