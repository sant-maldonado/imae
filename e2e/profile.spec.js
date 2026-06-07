import { test, expect } from '@playwright/test'

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@imaemantenimiento.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('visits profile page', async ({ page }) => {
    await page.goto('/perfil')
    await expect(page.locator('text=Perfil')).toBeVisible()
  })
})
