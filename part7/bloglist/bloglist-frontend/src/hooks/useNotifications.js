import { useContext } from 'react'
import NotificationsContext from '../contexts/NotificationsContext'

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationsContext)
  return notification
}

export const useNotificationDispatch = () => {
  const { dispatch } = useContext(NotificationsContext)
  return dispatch
}