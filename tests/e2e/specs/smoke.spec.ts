import { test, expect } from '@playwright/test'

test.describe('主闭环冒烟', () => {
  test('榜单加载并显示景点卡片', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Top Spots|打卡排行/i }).click()
    await expect(page.locator('[data-testid="spot-card"]').first()).toBeVisible({ timeout: 10_000 })
  })

  test('点击景点卡片打开融合详情层', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Top Spots|打卡排行/i }).click()
    await page.locator('[data-testid="spot-card"]').first().click()
    await expect(page.locator('[data-testid="spot-detail"]')).toBeVisible({ timeout: 5_000 })
  })

  test('AI Concierge 模块可打开', async ({ page }) => {
    await page.goto('/')
    const conciergeBtn = page.getByRole('button', { name: /AI Concierge|AI 礼宾/i })
    if (await conciergeBtn.isVisible()) {
      await conciergeBtn.click()
      await expect(page.locator('textarea, input[type="text"]').first()).toBeVisible({ timeout: 5_000 })
    }
  })

  test('语言切换按钮存在', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Profile|个人/i }).click()
    await expect(page.getByText(/Language|语言/i).first()).toBeVisible()
  })
})
