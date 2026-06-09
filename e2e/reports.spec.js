import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@imaemantenimiento.com')
    await page.fill('input[type="password"]', 'imae1234')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('renders reports page with charts', async ({ page }) => {
    await page.goto('/reportes')
    await expect(page.getByRole('heading', { name: 'Reportes' })).toBeVisible()
    await expect(page.locator('button:has-text("CSV")').first()).toBeVisible()
  })
})
