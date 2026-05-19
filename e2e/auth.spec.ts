import { test, expect } from '@playwright/test'

test.describe('Auth page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('domcontentloaded')
  })

  test('renders login and signup tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /hyr/i })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('button', { name: /regjistrohu/i })).toBeVisible()
  })

  test('login tab is active by default — shows email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('switching to signup tab reveals username field', async ({ page }) => {
    await page.getByRole('button', { name: /regjistrohu/i }).click()
    await expect(page.locator('input[placeholder="username_yt"]')).toBeVisible({ timeout: 5_000 })
  })
})

test.describe('Login form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 })
  })

  test('shows error when submitted with empty fields', async ({ page }) => {
    // Click the submit button without filling any fields
    await page.getByRole('button', { name: /hyr/i }).first().click()
    await expect(page.getByText('Email është i detyrueshëm')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('Fjalëkalimi është i detyrueshëm')).toBeVisible()
  })

  test('shows error for malformed email', async ({ page }) => {
    await page.locator('input[type="email"]').fill('notanemail')
    await page.locator('input[type="password"]').first().fill('SomePass1')
    await page.getByRole('button', { name: /hyr/i }).first().click()
    await expect(page.getByText(/email i pavlefshëm/i)).toBeVisible({ timeout: 5_000 })
  })

  test('submit button is a button element (keyboard accessible)', async ({ page }) => {
    const btn = page.getByRole('button', { name: /hyr/i }).first()
    await expect(btn).toBeEnabled()
  })
})

test.describe('Signup form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('domcontentloaded')
    await page.getByRole('button', { name: /regjistrohu/i }).click()
    await expect(page.locator('input[placeholder="username_yt"]')).toBeVisible({ timeout: 5_000 })
  })

  test('shows error when passwords do not match', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@test.com')
    await page.locator('input[type="password"]').first().fill('Password1')
    await page.locator('input[type="password"]').nth(1).fill('Different1')
    await page.getByRole('button', { name: /regjistrohu/i }).last().click()
    await expect(page.getByText(/nuk përputhen/i)).toBeVisible({ timeout: 5_000 })
  })

  test('shows password strength indicator when typing', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('abc')
    // Strength bar renders only when password field has content
    // The strength label for a weak password
    await expect(page.getByText(/shumë i dobët|i dobët/i)).toBeVisible({ timeout: 3_000 })
  })
})

test.describe('Protected route redirect', () => {
  test('/journal redirects unauthenticated user to /auth', async ({ page }) => {
    await page.goto('/journal')
    await page.waitForLoadState('domcontentloaded')
    // ProtectedRoute redirects to /auth when no session
    await expect(page).toHaveURL(/\/auth/, { timeout: 8_000 })
  })
})
