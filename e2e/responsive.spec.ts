import { test, expect } from '@playwright/test';

test.describe('desktop viewport (1280px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/e2e/fixtures/responsive.html');
    await page.waitForFunction(() => (window as any).swiperflow);
  });

  test('desktop-only slider initializes', async ({ page }) => {
    const hasSwiper = await page.evaluate(() => {
      return (window as any).swiperflow.find('desktop-only') !== undefined;
    });
    expect(hasSwiper).toBe(true);
  });

  test('mobilePortrait-only slider does not initialize', async ({ page }) => {
    const hasSwiper = await page.evaluate(() => {
      return (window as any).swiperflow.find('mobilePortrait-only') !== undefined;
    });
    expect(hasSwiper).toBe(false);
  });

  test('always-init slider initializes', async ({ page }) => {
    const hasSwiper = await page.evaluate(() => {
      return (window as any).swiperflow.find('always') !== undefined;
    });
    expect(hasSwiper).toBe(true);
  });
});

test.describe('mobile viewport (400px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 720 });
    await page.goto('/e2e/fixtures/responsive.html');
    await page.waitForFunction(() => (window as any).swiperflow);
  });

  test('desktop-only slider does not initialize', async ({ page }) => {
    const hasSwiper = await page.evaluate(() => {
      return (window as any).swiperflow.find('desktop-only') !== undefined;
    });
    expect(hasSwiper).toBe(false);
  });

  test('mobilePortrait-only slider initializes', async ({ page }) => {
    const hasSwiper = await page.evaluate(() => {
      return (window as any).swiperflow.find('mobilePortrait-only') !== undefined;
    });
    expect(hasSwiper).toBe(true);
  });
});
