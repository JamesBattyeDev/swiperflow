import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/keyboard.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('starts on the first slide', async ({ page }) => {
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('KB 1');
});

test('right arrow key advances to next slide', async ({ page }) => {
  // Focus the swiper container so keyboard events reach it
  await page.locator('[data-swf-element="wrapper"]').click();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('KB 2');
});

test('left arrow key goes to previous slide', async ({ page }) => {
  await page.locator('[data-swf-element="wrapper"]').click();
  // Go forward then back
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('KB 1');
});
