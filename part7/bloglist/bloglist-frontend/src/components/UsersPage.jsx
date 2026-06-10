import { useQuery } from '@tanstack/react-query'
import usersService from '../services/usersApi'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'

const UsersPage = () => {

  const result = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  if (result.isPending) {
    return <div>loading users...</div>
  }

  if (result.isError) {
    return <div>failed loading users...</div>
  }

  const users = result.data

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Blogs created</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersPage
