import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import LoginFormPage from './components/LoginFormPage'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogPage from './components/CreateBlogPage'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  //const blogFormRef = useRef()

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)

      setSuccessMessage('login successful!')
      setTimeout(() => setSuccessMessage(null), 5000)

    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(prev =>
      prev.map(b =>
        b.id !== blog.id ? b : returnedBlog
      )
    )
  }

  const createBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog)
      setBlogs(prev => prev.concat(returnedBlog))
      //blogFormRef.current.toggleVisibility()
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (blog) => {

    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)

      setBlogs(prev => prev.filter(b => b.id !== blog.id))

      setSuccessMessage(`Deleted ${blog.title} by ${blog.author}`)
      setTimeout(() => { setSuccessMessage(null) }, 5000)

    } catch {

      setErrorMessage('Failed to delete blog')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  /*const padding = {
    padding: 5
  }*/

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <Container>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Blog App
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button color="inherit" component={Link} to="/" sx={style}>
                blogs
              </Button>
              {user && (
                <Button color="inherit" component={Link} to="/create" sx={style}>
                  new blog
                </Button>
              )}
              {!user && (
                <Button color="inherit" component={Link} to="/login" sx={style}>
                  login
                </Button>
              )}
              {user && (
                <Button color="inherit" sx={style} onClick={handleLogout} >
                  logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Notification message={errorMessage} type={'error'} />
        <Notification message={successMessage} type={'success'} />

        <Routes>
          <Route path="/" element={
            <BlogList user={user} blogs={blogs} />
          } />
          <Route path="/login" element={
            <LoginFormPage handleLogin={handleLogin} />
          } />
          <Route path="/blogs/:id" element={
            <BlogView blogs={blogs} handleLike={handleLike} handleRemove={handleRemove} user={user} />
          } />
          <Route path="/create" element={
            <CreateBlogPage user={user} createBlog={createBlog} />
          } />
        </Routes>
      </Router>
    </Container>
  )
}

export default App