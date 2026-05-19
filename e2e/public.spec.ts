import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows hero CTA', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    // Hero heading is an h1
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible({ timeout: 10_000 })
    // Primary CTA button
    await expect(page.getByText('Fillo falas sot')).toBeVisible()
  })

  test('has a working "Regjistrohu" link that leads to /auth', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const link = page.getByRole('link', { name: /regjistrohu/i }).first()
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/auth/)
  })

  test('page title contains NeuroSpace', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/NeuroSpace/i)
  })
})

test.describe('Pricing page', () => {
  test('loads and shows plan cards', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('domcontentloaded')
    // Each plan has its name in a heading or prominent text
    await expect(page.getByText(/pro/i).first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/premium/i).first()).toBeVisible()
  })
})

test.describe('Psikologu page', () => {
  test('loads without crashing', async ({ page }) => {
    await page.goto('/psikologu')
    await page.waitForLoadState('domcontentloaded')
    // Page renders — no JS error overlay
    await expect(page.locator('body')).toBeVisible({ timeout: 10_000 })
    // Should not show Vite's error overlay
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)
  })
})

test.describe('Navigation', () => {
  test('unknown route redirects to /home', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveURL(/\/home/, { timeout: 5_000 })
  })

  test('/about loads without crashing', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)
  })
})
