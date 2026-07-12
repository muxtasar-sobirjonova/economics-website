import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads and visually matches', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    // Visual regression test
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    // Expect error toast or message
    await expect(page.locator('text=Invalid email or password').first()).toBeVisible({ timeout: 5000 });
  });
});
