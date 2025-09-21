import { test, expect } from '@playwright/test'

test('Back button does not bypass auth', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 10000 })
  await page.goBack()
  await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 10000 })
})
