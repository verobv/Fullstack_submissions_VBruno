import { useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import LoginFormPage from './components/LoginFormPage'
import loginService from './services/login'
import Notification from './components/Notification'
import { useNotificationDispatch } from './hooks/useNotifications'
import { setNotification } from './services/notifications'
import CreateBlogPage from './components/CreateBlogPage'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useUserValue, useUserDispatch } from './hooks/useUser'
import { setUser, logoutUser } from './services/users'
import { getUser, saveUser, removeUser } from './services/persistentUser'
import UsersPage from './components/UsersPage'
import UserView from './components/UserView'

const App = () => {
  //const [user, setUser] = useState(null)
  //const [blogs, setBlogs] = useState([])
  //const [errorMessage, setErrorMessage] = useState(null)
  //const [successMessage, setSuccessMessage] = useState(null)
  const dispatch = useNotificationDispatch()
  const user = useUserValue()
  const dispatchUser = useUserDispatch()
  //const blogFormRef = useRef()

  const queryClient = useQueryClient()

  /*useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])*/

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    //enabled: !!user
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      setNotification(
        dispatch,
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      )
    },
    onError: () => {
      setNotification(
        dispatch,
        'failed to create blog',
        'error'
      )
    }
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'],
        blogs.map(blog =>
          blog.id === updatedBlog.id
            ? updatedBlog
            : blog
        )
      )
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (_, deletedBlogId) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'],
        blogs.filter(blog => blog.id !== deletedBlogId))
    }
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, content }) => blogService.addComment(id, content),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'],
        blogs.map(blog =>
          blog.id === updatedBlog.id
            ? updatedBlog
            : blog
        )
      )
    }
  })

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUser(dispatchUser, user)
      blogService.setToken(user.token)
    }
  }, [dispatchUser])

  if (result.isPending) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      saveUser(user)

      blogService.setToken(user.token)

      setUser(dispatchUser, user)

      setNotification(
        dispatch,
        'login successful!',
        'success'
      )
    } catch {
      setNotification(
        dispatch,
        'wrong credentials',
        'error'
      )
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    await likeBlogMutation.mutateAsync({
      id: blog.id,
      blog: updatedBlog
    })
  }

  const createBlog = async (blog) => {
    await newBlogMutation.mutateAsync(blog)
  }

  const handleRemove = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    )

    if (!confirmDelete) return

    try {
      await removeBlogMutation.mutateAsync(blog.id)

      setNotification(
        dispatch,
        `Deleted ${blog.title} by ${blog.author}`,
        'success'
      )
    } catch {
      setNotification(
        dispatch,
        'failed to delete blog',
        'error'
      )
    }
  }

  /*const padding = {
    padding: 5
  }*/

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const handleLogout = () => {
    removeUser()
    logoutUser(dispatchUser)
  }

  return (
    <Container>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Blog App</Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button color="inherit" component={Link} to="/" sx={style}>
                blogs
              </Button>
              <Button color="inherit" component={Link} to="/users" sx={style}>
                users
              </Button>
              {user && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/create"
                  sx={style}
                >
                  new blog
                </Button>
              )}
              {!user && (
                <Button color="inherit" component={Link} to="/login" sx={style}>
                  login
                </Button>
              )}
              {user && (
                <Button color="inherit" sx={style} onClick={handleLogout}>
                  logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Notification />

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList user={user} blogs={blogs} />} />
            <Route
              path="/login"
              element={<LoginFormPage handleLogin={handleLogin} />}
            />
            <Route
              path="/blogs/:id"
              element={
                <BlogView
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                  addComment={commentMutation.mutate}
                  user={user}
                />
              }
            />
            <Route
              path="/create"
              element={<CreateBlogPage user={user} createBlog={createBlog} />}
            />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </Container>
  )
}

export default App
