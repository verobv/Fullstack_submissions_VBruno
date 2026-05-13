import { createContext, useState } from 'react'

const NotificationsContext = createContext()

export default NotificationsContext


export const NotificationsContextProvider = (props) => {
  const [notification, setNotification] = useState(null)

  const notify = (message, type) => {
    setNotification({ message, type })

    setTimeout(() => { setNotification(null) }, 5000)
  }

  return (
    <NotificationsContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotificationsContext.Provider>
  )
}