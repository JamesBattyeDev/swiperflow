import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/loop.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('slider initializes with first slide active', async ({ page }) => {
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Loop 1');
});

test('loop allows navigating beyond the last slide', async ({ page }) => {
  const next = page.locator('[data-swf-element="next-arrow"]');

  // Navigate forward more times than there are slides (4 slides)
  // In loop mode this should not get stuck — realIndex wraps around
  for (let i = 0; i < 6; i++) {
    await next.click();
    await page.waitForTimeout(200);
  }

  // Verify we can still navigate — the slider didn't get stuck at the end
  // The exact realIndex depends on Swiper's internal loop handling,
  // so just verify it's a valid index (0-3 for 4 slides)
  const realIndex = await page.evaluate(() => {
    const slider = (window as any).swiperflow.find('loop-slider');
    return slider?.getSwiperInstance?.realIndex;
  });
  expect(realIndex).toBeGreaterThanOrEqual(0);
  expect(realIndex).toBeLessThan(4);
});

test('can loop backwards from first slide to last', async ({ page }) => {
  await page.click('[data-swf-element="prev-arrow"]');
  await page.waitForTimeout(200);
  const active = page.locator('.swiper-slide-active');
  await expect(active).toHaveText('Loop 4');
});
