import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/api.html');
  await page.waitForFunction(() => (window as any).swiperflow);
});

test('window.swiperflow is defined', async ({ page }) => {
  const exists = await page.evaluate(() => typeof (window as any).swiperflow === 'object');
  expect(exists).toBe(true);
});

test('sliders array contains all initialized sliders', async ({ page }) => {
  const count = await page.evaluate(() => (window as any).swiperflow.sliders.length);
  expect(count).toBe(2);
});

test('find() returns the correct slider by component name', async ({ page }) => {
  const found = await page.evaluate(() => {
    const slider = (window as any).swiperflow.find('slider-a');
    return slider?.component?.dataset?.swfComponent;
  });
  expect(found).toBe('slider-a');
});

test('find() returns undefined for non-existent slider', async ({ page }) => {
  const found = await page.evaluate(() => {
    return (window as any).swiperflow.find('does-not-exist');
  });
  expect(found).toBeUndefined();
});

test('breakpoint property returns current breakpoint', async ({ page }) => {
  const bp = await page.evaluate(() => (window as any).swiperflow.breakpoint);
  expect(bp).toBe('desktop');
});

test('on() registers event listener that fires on init', async ({ page }) => {
  // swiperflow.on() registers on the internal EventBus
  // Re-calling init() fires 'swfLoaded', which we can listen for
  const received = await page.evaluate(() => {
    return new Promise<boolean>((resolve) => {
      (window as any).swiperflow.on('swfLoaded', () => resolve(true));
      (window as any).swiperflow.init();
    });
  });
  expect(received).toBe(true);
});
