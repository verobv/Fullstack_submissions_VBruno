import { useNavigate } from 'react-router-dom'
import BlogForm from './BlogForm'


const CreateBlogPage = ({ user, createBlog }) => {

  const navigate = useNavigate()

  if (!user) {
    return <div>login required</div>
  }

  const handleCreate = async (b) => {
    await createBlog(b)
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <BlogForm createBlog={handleCreate}/>
    </div>
  )
}

export default CreateBlogPage
