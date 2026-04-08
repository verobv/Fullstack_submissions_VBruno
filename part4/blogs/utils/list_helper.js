const _ = require('lodash')

// 4.3
const dummy = (blogs) => {
  return 1
}

// 4.4
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

// 4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (blog.likes > (fav.likes|| 0) ? blog : fav), blogs[0])
}

// 4.6 
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const mapped = _.map(grouped, (authorBlogs, author) => ({
    author,
    blogs: authorBlogs.length
  }))

  return _.maxBy(mapped, 'blogs')
}

// 4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const mapped = _.map(grouped, (authorBlogs, author) => ({
    author,
    likes: totalLikes(authorBlogs)
  }))

  return _.maxBy(mapped, 'likes')
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}