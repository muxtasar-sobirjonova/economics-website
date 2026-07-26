import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test('should redirect unauthenticated users from /roadmap to /login', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test('homepage should load and display core marketing elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/That's So Econ/);
  });
});
