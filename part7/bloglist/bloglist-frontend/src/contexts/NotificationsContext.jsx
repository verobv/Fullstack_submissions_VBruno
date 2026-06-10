import { createContext, useReducer } from 'react'

const NotificationsContext = createContext()

export default NotificationsContext

const NotificationsReducer = (state, action) => {
  switch(action.type){
  case 'SET_NOTIFICATION':
    return action.payload
  case 'CLEAR_NOTIFICATION':
    return null
  default:
    return state
  }
}

export const NotificationsContextProvider = (props) => {
  const [notification, dispatch] = useReducer(NotificationsReducer, null)

  return (
    <NotificationsContext.Provider value={{ notification, dispatch }}>
      {props.children}
    </NotificationsContext.Provider>
  )
}