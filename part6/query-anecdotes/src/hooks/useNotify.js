import { useContext } from 'react'
import NotificationsContext from '../components/NotificationsContext'

const useNotify = () => {
  const { notify } = useContext(NotificationsContext)
  return notify
}

export default useNotify