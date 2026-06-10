const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const { userExtractor } = require('../utils/middleware')
// const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const saveblog = new Blog({
    ...blog,
    likes: blog.likes || 0,
    user: user._id,
  })

  const savedBlog = await saveblog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = request.body.title ?? blog.title
  blog.author = request.body.author ?? blog.author
  blog.url = request.body.url ?? blog.url
  blog.likes = request.body.likes ?? blog.likes

  const updatedBlog = await blog.save()
  const populatedBlog = await updatedBlog.populate('user', {
    username: 1,
    name: 1,
  })

  response.status(200).json(populatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body

  if (!content) {
    return response.status(400).json({ error: 'comment content missing' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  blog.comments = blog.comments || []
  
  blog.comments.push({ content })

  const updatedBlog = await blog.save()

  const populatedBlog = await updatedBlog.populate('user', {
    username: 1,
    name: 1,
  })

  response.status(200).json(populatedBlog)
})

module.exports = blogsRouter
