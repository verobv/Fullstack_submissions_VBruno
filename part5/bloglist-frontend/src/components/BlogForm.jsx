import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField
          label="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <TextField
          label="author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <TextField
          label="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>
      <p>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </p>
    </form>
  )
}

export default BlogForm