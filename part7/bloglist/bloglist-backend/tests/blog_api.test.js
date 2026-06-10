const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/users')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are initially some blogs save', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  beforeEach(async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'testuser',
      password: 'testpass',
      name: 'Test User',
    }
    await api.post('/api/users').send(newUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier is named id not _id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id !== undefined)
    assert.strictEqual(blog._id, undefined)
  })

  describe('When adding one new blog', () => {
    test('adding a blog fails with 401 if no token is provided', async () => {
      const newBlog = {
        title: 'Unauthorized blog',
        author: 'Bad',
        url: 'http://bad.com',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'New Author',
        url: 'http://example.com/new',
        likes: 7,
      }

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(titles.includes('New Blog Post'))
    })

    test('missing likes default to 0', async () => {
      const newBlog = {
        title: 'New Blog Post No Likes',
        author: 'New new Author',
        url: 'http://example.com/new',
      }

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(postResponse.body.likes, 0)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(
        (b) => b.title === 'New Blog Post No Likes',
      )

      assert.strictEqual(addedBlog.likes, 0)
    })
  })

  describe('Some possible errors', () => {
    test('a blog without title cannot be added ', async () => {
      const newBlog = {
        author: 'Missing title Author',
        url: 'http://example.com/new',
        likes: 7,
      }

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      assert.strictEqual(response.body.error, 'title or url missing')
    })

    test('a blog without url cannot be added ', async () => {
      const newBlog = {
        title: 'New Blog No URL',
        author: 'Missing url Author',
        likes: 7,
      }

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      assert.strictEqual(response.body.error, 'title or url missing')
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      const blog = {
        title: 'Blog to delete',
        author: 'Author',
        url: 'http://example.com',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(
        (b) => b.title === 'Blog to delete',
      )

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((b) => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with status code 200 if updates are done', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        likes: blogToUpdate.likes + 5,
      }

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })

      const token = loginResponse.body.token

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 5)
    })

    test('fails with status 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${validNonExistingId}`)
        .send({ likes: 10 })
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
