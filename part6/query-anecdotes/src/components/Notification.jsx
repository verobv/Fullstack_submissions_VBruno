import { useContext } from 'react'
import NotificationsContext from './NotificationsContext'

const Notification = () => {
  const { notification } = useContext(NotificationsContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!notification) return null

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification