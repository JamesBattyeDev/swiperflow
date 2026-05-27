import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/autoplay.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('starts on the first slide', async ({ page }) => {
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Auto 1');
});

test('auto-advances to the next slide after delay', async ({ page }) => {
  // Autoplay delay is 500ms, speed is 100ms — wait for one full cycle
  await page.waitForTimeout(800);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Auto 2');
});

test('continues auto-advancing through multiple slides', async ({ page }) => {
  // Wait for two full cycles
  await page.waitForTimeout(1500);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Auto 3');
});
