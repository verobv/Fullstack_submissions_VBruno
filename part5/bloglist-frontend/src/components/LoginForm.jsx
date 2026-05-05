import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleLogin,
  setUsername,
  setPassword,
  username,
  password
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm