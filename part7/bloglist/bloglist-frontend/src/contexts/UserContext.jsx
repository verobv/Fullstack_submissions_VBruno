import { createContext, useReducer } from 'react'

const UserContext = createContext()

export default UserContext

const UserReducer = (state, action) => {
  switch(action.type){
  case 'SET_USER':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(UserReducer, null)

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}