import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, List, ListItem, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import  { useField } from '../hooks/index'

const BlogView = ({ handleLike, handleRemove, addComment, user }) => {
  const { id } = useParams()
  const comment = useField('text')

  const queryClient = useQueryClient()

  const blogs = queryClient.getQueryData(['blogs'])
  const blog = blogs?.find((b) => b.id === id)

  const navigate = useNavigate()

  const submitComment = () => {

    addComment({
      id: blog.id,
      content: comment.value
    })

    comment.reset()
  }

  if (!blog) {
    return <div>blog not found</div>
  }

  const checkOwner = user && blog.user?.username === user.username

  const handleDelete = async (b) => {
    await handleRemove(b)
    queryClient.invalidateQueries(['blogs'])
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

        <Typography variant="body2">likes {blog.likes}</Typography>

        <Typography variant="body2">Added by {blog.user?.name}</Typography>

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

        <Typography variant="h6" sx={{ mt: 1 }}>
          comments
        </Typography>

        <TextField
          size="small"
          label="add comment"
          value={comment.value}
          onChange={comment.onChange}
        />

        <Button type="submit" onClick={submitComment} variant="contained" style={{ marginTop: 2 }}>
          add comment
        </Button>

        {blog.comments?.length === 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            no comments yet
          </Typography>
        )}

        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          {blog.comments?.map((c) => (
            <ListItem key={c._id} sx={{ display: 'list-item', py: 0, minHeight: 1 }}>
              {c.content}
            </ListItem>
          ))}
        </List>

      </CardContent>
    </Card>
  )
}

export default BlogView
