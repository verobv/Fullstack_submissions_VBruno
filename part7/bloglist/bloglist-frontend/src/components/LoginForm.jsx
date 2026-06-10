import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        <TextField
          label="username"
          value={username.value}
          onChange={username.onChange}
        />
      </div>
      <div>
        <TextField
          label="password"
          type="password"
          value={password.value}
          onChange={password.onChange}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm
