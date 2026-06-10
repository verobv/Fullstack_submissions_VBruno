const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/users')

const api = supertest(app)

describe('when creating users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('username must be at least 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert(response.body.error.includes('username'))
  })

  test('password must be at least 3 characters', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'ab',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert(response.body.error.includes('password'))
  })

  test('username must be unique', async () => {
    const user = {
      username: 'duplicate',
      name: 'User One',
      password: 'secret123',
    }

    await api.post('/api/users').send(user)

    const response = await api.post('/api/users').send(user).expect(400)

    assert(response.body.error.includes('unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
