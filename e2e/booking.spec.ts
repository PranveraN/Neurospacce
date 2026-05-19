import { test, expect } from '@playwright/test'

// All booking tests run as an unauthenticated (free) user.
// canUse('bookAppointment') → false for free plan → PsychPromoLanding is shown.

test.describe('Booking page — unauthenticated / free user', () => {
  test('shows promo landing instead of booking wizard', async ({ page }) => {
    await page.goto('/book/elsa-krasniqi')
    await page.waitForLoadState('domcontentloaded')
    // PsychPromoLanding headline
    await expect(
      page.getByText(/shëndeti mendor meriton/i)
    ).toBeVisible({ timeout: 10_000 })
  })

  test('promo landing has a "Zbulo planin Pro" CTA', async ({ page }) => {
    await page.goto('/book/elsa-krasniqi')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByText(/zbulo planin pro/i)).toBeVisible({ timeout: 10_000 })
  })

  test('"Zbulo planin Pro" CTA links to /pricing', async ({ page }) => {
    await page.goto('/book/elsa-krasniqi')
    await page.waitForLoadState('domcontentloaded')
    const cta = page.getByRole('link', { name: /zbulo planin pro/i }).first()
    await expect(cta).toHaveAttribute('href', '/pricing')
  })

  test('promo landing shows expert cards grid', async ({ page }) => {
    await page.goto('/book/elsa-krasniqi')
    await page.waitForLoadState('domcontentloaded')
    // Expert section heading
    await expect(page.getByText(/njohuni me psikologët tanë/i)).toBeVisible({ timeout: 10_000 })
  })

  test('/book redirects to /psikologu', async ({ page }) => {
    await page.goto('/book')
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveURL(/\/psikologu/, { timeout: 5_000 })
  })
})
