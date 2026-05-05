const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginFormV, loginWith, blogsPageV, getBlog, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Vero Bruno',
        username: 'vbruno',
        password: 'awesome'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await loginFormV(page)
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginFormV(page)
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginFormV(page)
      await loginWith(page, 'vero', 'salainen')
      
      const errorDiv = page.getByRole('alert')
      await expect(errorDiv).toContainText('wrong credentials')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
      await loginFormV(page)
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginFormV(page)
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await blogsPageV(page)
      
      await createBlog(page, ['Test blog', 'Playwright', 'test_playwright.com'])
      
      const blog = getBlog(page, 'Test blog', 'Playwright')
      await expect(blog).toBeVisible()
      await expect(blog).toContainText('Test blog')
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await blogsPageV(page)
        await expect(page.getByText('logged in')).toBeVisible()
        await createBlog(page, ['Test blog', 'Playwright', 'test_playwright.com'])
        await page.getByRole('button', { name: 'logout' }).click()
        await loginFormV(page)
        await loginWith(page, 'vbruno', 'awesome')
        await expect(page.getByText('logged in')).toBeVisible()
        await createBlog(page, ['Test blog 2', 'Playwright', 'test2_playwright.com'])
        await createBlog(page, ['Test blog 3', 'Playwright', 'test3_playwright.com'])
      })
      
      test('blog details can be opened', async ({ page }) => {
        const blog = getBlog(page, 'Test blog', 'Playwright')

        await blog.getByText('Test blog').click()

        await expect(page.getByText('test_playwright.com')).toBeVisible()
        await expect(page.getByText('likes 0')).toBeVisible()
      })

      test('user can like one of those', async ({ page }) => {
        await blogsPageV(page)

        const blog = getBlog(page, 'Test blog', 'Playwright')
        await blog.getByText('Test blog').click()

        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('one of those can be removed by the user that created it', async ({ page }) => {
        await blogsPageV(page)

        await expect(page.getByText('Vero Bruno logged in')).toBeVisible()
        
        const blog = getBlog(page, 'Test blog 3', 'Playwright') 
        await blog.getByText('Test blog 3').click()

        await expect(page.getByText('remove')).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(blog).not.toBeVisible()
      })

      test('only creator sees the delete button', async ({ page }) => {
        await expect(page.getByText('Vero Bruno logged in')).toBeVisible()
        
        const blog = getBlog(page, 'Test blog', 'Playwright') 
        await blog.getByText('Test blog').click()

        await expect(page.getByText('remove')).not.toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      })

      /*test('blogs are arranged by likes', async ({ page }) => {
        const blog3 = getBlog(page, 'Test blog 3', 'Playwright') 
        const blog2 = getBlog(page, 'Test blog 2', 'Playwright') 
        const blog1 = getBlog(page, 'Test blog', 'Playwright') 
        const blogs = page.locator('.blog')

        await blog3.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByRole('button', { name: 'like' }).click()

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog1.getByRole('button', { name: 'like' }).click()

        await expect(blogs.nth(0)).toContainText('Test blog 3')
        await expect(blogs.nth(1)).toContainText('Test blog')
        await expect(blogs.nth(2)).toContainText('Test blog 2')
      })*/
    })
  })
})
