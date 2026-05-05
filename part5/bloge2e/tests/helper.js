const { expect } = require('@playwright/test')

const loginFormV = async (page)  => {
  await page.goto('/login')

  await expect(page.getByLabel('username')).toBeVisible()
  await expect(page.getByLabel('password')).toBeVisible()
}

const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const blogsPageV = async (page)  => {
  await page.goto('/')
  const locator = page.getByRole('heading', { name: 'blogs' })
  await expect(locator).toBeVisible()
}

const getBlog = (page, title, author) => {
  return page.locator('.blog', { hasText: `${title} ${author}` })
}

const createBlog = async (page, content) => {
  
  await page.getByRole('link', { name: 'new blog' }).click()

  await page.getByLabel('title').fill(content[0])
  await page.getByLabel('author').fill(content[1])
  await page.getByLabel('url').fill(content[2])

  await page.getByRole('button', { name: 'create' }).click()

  await expect(getBlog(page, content[0], content[1])).toBeVisible()
}

export { loginFormV, loginWith, blogsPageV, getBlog, createBlog }