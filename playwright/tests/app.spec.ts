import { test, expect } from '@playwright/test';

test('should load the app', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/wwtbam/i);
  await expect(page.locator('app-root')).toBeVisible();
});
