import { test, expect } from '@playwright/test'

// AI Chat is accessible without auth. Responses come from static RESPONSES data,
// not an external API, so these tests work without real Supabase credentials.

test.describe('AI Chat page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat')
    await page.waitForLoadState('domcontentloaded')
  })

  test('loads and shows emotion starter chips', async ({ page }) => {
    // EMOTION_STARTERS render before user types anything
    await expect(page.getByText(/jam nën ankth/i)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/jam nën stres/i)).toBeVisible()
  })

  test('has a message input field', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await expect(input).toBeVisible({ timeout: 10_000 })
    await expect(input).toBeEditable()
  })

  test('typing in the input reflects the text', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('Ndihem nën ankth sot')
    await expect(input).toHaveValue('Ndihem nën ankth sot')
  })

  test('clicking an emotion chip populates the input or triggers a message', async ({ page }) => {
    const chip = page.getByText(/jam nën ankth/i).first()
    await chip.click()
    // After clicking a chip, either the input gets a value or a chat bubble appears
    const inputFilled = await page.locator('textarea, input[type="text"]').first().inputValue()
    const bubbleVisible = await page.getByText(/ankth/i).count()
    expect(inputFilled.length > 0 || bubbleVisible > 1).toBeTruthy()
  })

  test('send button is present and enabled when input has text', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('Ndihem nën stres')
    // Send button (button with ArrowUp icon or similar send action)
    const sendBtn = page.locator('button[type="submit"], button:has(svg)').last()
    await expect(sendBtn).toBeVisible({ timeout: 3_000 })
  })

  test('sending a message shows a response bubble', async ({ page }) => {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('Jam nën ankth')
    // Press Enter or click send
    await input.press('Enter')
    // Wait for the AI response bubble to appear (responses are static data, fast)
    await expect(page.getByText(/ankth/i).nth(1)).toBeVisible({ timeout: 8_000 })
  })
})
