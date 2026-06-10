//import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import  { useField } from '../hooks/index'

const BlogForm = ({ createBlog }) => {
  /*const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')*/

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField
          label="title"
          value={title.value}
          onChange={title.onChange}
        />
      </div>
      <div>
        <TextField
          label="author"
          value={author.value}
          onChange={author.onChange}
        />
      </div>
      <div>
        <TextField
          label="url"
          value={url.value}
          onChange={url.onChange}
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
