import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const [visible, setVisible] = useState(false)
  const notification = useSelector(state => state.notifications)
  
  useEffect(() => {
    if (notification !== '') {
      setVisible(true)
      setTimeout(() => {
        setVisible(false)
    }, 5000)
    }
  }, [notification])
  
  if (visible) {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
  return null
}

export default Notification