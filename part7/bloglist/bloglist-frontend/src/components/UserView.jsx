import { useParams } from 'react-router-dom'
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

const UserView = () => {
  const { id } = useParams()

  const queryClient = useQueryClient()

  const users = queryClient.getQueryData(['users'])
  const user = users?.find(u => u.id === id)

  if (!user) {
    return <div>user not found</div>
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>

        <Typography variant="h6" gutterBottom>
          added blogs
        </Typography>

        <List sx={{ listStyleType: 'disc', pl: 4, py: 0 }}>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} sx={{ display: 'list-item', py: 0, minHeight: 0 }}>
              {blog.title}
            </ListItem>
          ))}
        </List>

      </CardContent>
    </Card>
  )
}

export default UserView
