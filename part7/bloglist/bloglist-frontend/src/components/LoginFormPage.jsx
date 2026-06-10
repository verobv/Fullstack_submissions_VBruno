import LoginForm from './LoginForm'
import Notification from './Notification'
import { useField } from '../hooks/index'
import { useNavigate } from 'react-router-dom'

const LoginFormPage = ({ handleLogin }) => {

  const username = useField('text')
  const password = useField('text')

  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    handleLogin(username.value, password.value)
    username.reset()
    password.reset()
    navigate('/')
  }

  return (
    <div>
      <LoginForm
        handleLogin={submit}
        username={username}
        password={password}
      />
    </div>
  )
}

export default LoginFormPage
