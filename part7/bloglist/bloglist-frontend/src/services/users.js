export const setUser = ( dispatch, user ) => {
  dispatch({
    type: 'SET_USER',
    payload: user
  })
}

export const logoutUser = ( dispatch ) => {
  dispatch({
    type: 'LOGOUT'
  })
}