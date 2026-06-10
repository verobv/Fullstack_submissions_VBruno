const Blog = require('../models/blogs')
const User = require('../models/users')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

const tieBlogs = [
  {
    title: 'Blog A',
    author: 'Author 1',
    likes: 10,
  },
  {
    title: 'Blog B',
    author: 'Author 2',
    likes: 15,
  },
  {
    title: 'Blog C',
    author: 'Author 3',
    likes: 15,
  },
]

const tieAuthors = [
  {
    title: 'Blog A',
    author: 'Author 1',
    likes: 10,
  },
  {
    title: 'Blog D',
    author: 'Author 2',
    likes: 10,
  },
  {
    title: 'Blog B',
    author: 'Author 1',
    likes: 15,
  },
  {
    title: 'Blog C',
    author: 'Author 2',
    likes: 15,
  },
]

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Alice',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Bob',
    url: 'http://example.com/2',
    likes: 10,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  blogs,
  listWithOneBlog,
  tieBlogs,
  tieAuthors,
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
