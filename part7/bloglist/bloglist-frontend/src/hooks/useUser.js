import { useContext } from 'react'
import UserContext from '../contexts/UserContext'

export const useUserValue = () => {
  const { user } = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const { dispatch } = useContext(UserContext)
  return dispatch
}