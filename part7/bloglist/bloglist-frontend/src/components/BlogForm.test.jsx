import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('event handler is called with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByLabelText('title')
  const author = screen.getByLabelText('author')
  const url = screen.getByLabelText('url')

  await user.type(title, 'Test Blog')
  await user.type(author, 'Vero')
  await user.type(url, 'http://test.com')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Vero')
  expect(createBlog.mock.calls[0][0].url).toBe('http://test.com')
})
