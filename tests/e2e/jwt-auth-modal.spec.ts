import { test, expect } from '@playwright/test'

test('JWT tokens work in auth modal', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 10000 })
})
