import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/effects.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('fade effect slider initializes', async ({ page }) => {
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Fade 1');
});

test('fade effect applies swiper-fade class to container', async ({ page }) => {
  const wrapper = page.locator('[data-swf-element="wrapper"]');
  await expect(wrapper).toHaveClass(/swiper-fade/);
});

test('navigation works with fade effect', async ({ page }) => {
  await page.click('[data-swf-element="next-arrow"]');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Fade 2');
});
