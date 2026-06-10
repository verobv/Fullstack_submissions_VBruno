const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {
  blogs,
  listWithOneBlog,
  tieBlogs,
  tieAuthors,
} = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blogs', () => {
  test('of an empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })

  test('when multiple blogs have the same max likes, returns any of them', () => {
    const result = listHelper.favoriteBlog(tieBlogs)

    // we know max likes is 15
    const possibleResults = tieBlogs.filter((b) => b.likes === 15)

    // check that the result is one of the blogs with max likes
    assert.ok(
      possibleResults.some(
        (b) => b.title === result.title && b.author === result.author,
      ),
    )
  })
})

describe('most blogs', () => {
  test('of an empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the author of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('when multiple blogs have the same max likes, returns any of them', () => {
    const result = listHelper.mostBlogs(tieAuthors)

    const possibleResults = [
      { author: 'Author 1', blogs: 2 },
      { author: 'Author 2', blogs: 2 },
    ]

    assert.ok(
      possibleResults.some(
        (b) => b.author === result.author && b.blogs === result.blogs,
      ),
    )
  })
})

describe('most likes', () => {
  test('of an empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals the author of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('when multiple blogs have the same max likes, returns any of them', () => {
    const result = listHelper.mostLikes(tieAuthors)

    const possibleResults = [
      { author: 'Author 1', likes: 25 },
      { author: 'Author 2', likes: 25 },
    ]

    assert.ok(
      possibleResults.some(
        (b) => b.author === result.author && b.likes === result.likes,
      ),
    )
  })
})
