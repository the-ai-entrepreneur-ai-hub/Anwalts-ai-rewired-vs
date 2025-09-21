import { test, expect } from '@playwright/test'

const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3001'

test('Landing shows CTA and opens centered modal', async ({ page }) => {
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })

  const hero = page.locator('text=ANWALTS.AI').first()
  await expect(hero).toBeVisible()

  const cta = page.locator('button:has-text("Registrieren")').first()
  await expect(cta).toBeVisible()
  await cta.click()

  const overlay = page.locator('.auth-modal-overlay')
  const modal = page.locator('.auth-modal')
  await expect(overlay).toBeVisible()
  await expect(modal).toBeVisible()

  const viewport = page.viewportSize()
  const box = await modal.boundingBox()

  expect(viewport).not.toBeNull()
  expect(box).not.toBeNull()

  if (viewport && box) {
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2
    expect(centerX).toBeGreaterThan(viewport.width * 0.3)
    expect(centerX).toBeLessThan(viewport.width * 0.7)
    expect(centerY).toBeGreaterThan(viewport.height * 0.2)
    expect(centerY).toBeLessThan(viewport.height * 0.8)
  }
})
