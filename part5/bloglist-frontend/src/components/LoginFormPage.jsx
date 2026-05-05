import LoginForm from './LoginForm'
import Notification from './Notification'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginFormPage = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    handleLogin(username, password)
    navigate('/')
  }

  return (
    <div>
      <LoginForm
        handleLogin={submit}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username}
        password={password}
      />
    </div>
  )
}

export default LoginFormPage