export const setNotification = ( dispatch, message, type ) => {
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: {
      message,
      type
    }
  })

  setTimeout(() => { dispatch({ type: 'CLEAR_NOTIFICATION' }) }, 5000)
}