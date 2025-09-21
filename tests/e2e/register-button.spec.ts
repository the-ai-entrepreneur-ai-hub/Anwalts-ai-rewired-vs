import { test, expect } from '@playwright/test'

test('Register button opens registration form', async ({ page }) => {
  await page.goto('/dashboard')
  await page.evaluate(() => (window as any).openAuthModal?.())
  await page.click('text=Jetzt registrieren')
  await expect(page.getByLabel('Vorname *')).toBeVisible()
  await expect(page.getByLabel('Nachname *')).toBeVisible()
})
