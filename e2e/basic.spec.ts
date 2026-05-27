import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/basic.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('slider initializes with first slide active', async ({ page }) => {
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Slide 1');
});

test('clicking next arrow advances to next slide', async ({ page }) => {
  await page.click('[data-swf-element="next-arrow"]');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Slide 2');
});

test('clicking prev arrow goes to previous slide', async ({ page }) => {
  // Go forward first
  await page.click('[data-swf-element="next-arrow"]');
  await page.waitForTimeout(200);
  // Then back
  await page.click('[data-swf-element="prev-arrow"]');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Slide 1');
});

test('pagination dots are rendered', async ({ page }) => {
  const dots = page.locator('.swiper-dot');
  await expect(dots).not.toHaveCount(0);
});

test('first pagination dot has is-active class', async ({ page }) => {
  const activeDot = page.locator('.swiper-dot.is-active');
  await expect(activeDot).toHaveCount(1);
});

test('clicking a pagination dot changes the active slide', async ({ page }) => {
  // Click the third dot (index 2)
  const dots = page.locator('.swiper-dot');
  await dots.nth(2).click();
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Slide 3');
});
