import { useParams, useNavigate  } from 'react-router-dom'
import { Card, CardContent, Typography, Button } from '@mui/material'

const BlogView = ({ blogs, handleLike, handleRemove, user }) => {

  const { id } = useParams()
  const blog = blogs?.find(b => b.id === id)

  const navigate = useNavigate()

  if (!blog) {
    return <div>blog not found</div>
  }

  const checkOwner = user && blog.user?.username === user.username

  const handleDelete = async (b) => {
    await handleRemove(b)
    navigate('/')
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {blog.author}: {blog.title}
        </Typography>

        <Typography variant="body2">
          <a href={blog.url}>{blog.url}</a>
        </Typography>

        <Typography variant="body2">
          likes {blog.likes}
        </Typography>

        <Typography variant="body2">
          Added by {blog.user?.name}
        </Typography>

        {user && (
          <Button size="small" onClick={() => handleLike(blog)}>
            like
          </Button>
        )}

        {checkOwner && (
          <Button size="small" onClick={() => handleDelete(blog)}>
            remove
          </Button>
        )}
      </CardContent>
    </Card>
  )

}

export default BlogView