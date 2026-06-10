import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BlogView from './BlogView'

const blog = {
  title: 'Test Blog',
  author: 'Vero',
  url: 'http://test.com',
  likes: 5,
  user: { username: 'Vero', name: 'Vero' },
}

test('renders blog information to null users but no buttons', () => {
  render(
    <MemoryRouter>
      <BlogView
        blogs={[blog]}
        user={null}
        handleLike={() => {}}
        handleRemove={() => {}}
      />
    </MemoryRouter>,
  )

  const element = screen.getByText('Vero: Test Blog')
  expect(element).toBeDefined()

  const element2 = screen.getByText('http://test.com')
  expect(element2).toBeDefined()

  const element3 = screen.getByText('likes 5')
  expect(element3).toBeDefined()

  const element4 = screen.queryByText('like')
  expect(element4).toBeNull()

  const element5 = screen.queryByText('remove')
  expect(element5).toBeNull()
})

test('Authenticated non-owner users are shown only the like button', async () => {
  const user = { username: 'Not Vero' }

  render(
    <MemoryRouter>
      <BlogView
        blogs={[blog]}
        user={user}
        handleLike={() => {}}
        handleRemove={() => {}}
      />
    </MemoryRouter>,
  )

  const element = screen.getByText('like')
  expect(element).toBeDefined()

  const element2 = screen.queryByText('remove')
  expect(element2).toBeNull()
})

test('the blog’s creator is also shown the delete button', async () => {
  const user = { username: 'Vero' }

  render(
    <MemoryRouter>
      <BlogView
        blogs={[blog]}
        user={user}
        handleLike={() => {}}
        handleRemove={() => {}}
      />
    </MemoryRouter>,
  )

  const element = screen.getByText('like')
  expect(element).toBeDefined()

  const element2 = screen.getByText('remove')
  expect(element2).toBeDefined()
})

test('if like button is clicked twice, the event handler is called twice', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogView
        blogs={[blog]}
        user={user}
        handleLike={mockHandler}
        handleRemove={() => {}}
      />
    </MemoryRouter>,
  )

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
