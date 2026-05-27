import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/disabled.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('normal slider initializes and has active slide', async ({ page }) => {
  const active = page.locator('#normal .swiper-slide-active');
  await expect(active).toHaveCount(1);
});

test('disabled slider does not have an active slide', async ({ page }) => {
  // A disabled slider still gets a Swiper instance created,
  // but with init: false — so Swiper won't add active classes
  const active = page.locator('#disabled .swiper-slide-active');
  await expect(active).toHaveCount(0);
});
