import { test, expect } from '@playwright/test'

test('Login error feedback shows', async ({ page }) => {
  await page.goto('/dashboard')
  await page.evaluate(() => (window as any).openAuthModal?.())
  await page.fill('#authEmail', 'test@example.com')
  await page.fill('#authPassword', 'wrong')
  await page.click('button[type="submit"]')
  await expect(page.locator('.auth-error')).toBeVisible()
})
