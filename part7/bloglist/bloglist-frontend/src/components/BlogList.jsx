import { useEffect } from 'react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import LoginForm from './LoginForm'
import Togglable from './Togglable'

const BlogsList = ({ user, blogs }) => {
  //throw new Error('test crash')

  function compareLikes(a, b) {
    return b.likes - a.likes
  }

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  return (
    <div>
      <div>
        <h2>blogs</h2>
        {user && <p>{user.name} logged in </p>}

        {[...blogs].sort(compareLikes).map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default BlogsList
