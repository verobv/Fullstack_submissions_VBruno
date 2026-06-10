const key = 'loggedBlogappUser'

export const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(key)
  if (!loggedUserJSON) return null
  return JSON.parse(loggedUserJSON)
}

export const saveUser = (user) => {
  window.localStorage.setItem(key, JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem(key)
  window.localStorage.clear()
}