import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
  await page.goto('/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AI Notebook/);
  
  // Check if the main elements are present
  await expect(page.locator('textarea')).toBeVisible();
  await expect(page.locator('button')).toContainText('新建笔记');
});

test('can create a new note', async ({ page }) => {
  await page.goto('/');
  
  // Click the new note button
  await page.getByRole('button', { name: '新建笔记' }).click();
  
  // Type some content
  await page.locator('textarea').fill('# Test Note\n\nThis is a test note created by Playwright.');
  
  // Wait for auto-save
  await page.waitForTimeout(3000);
  
  // Check if note appears in the list
  await expect(page.locator('text=Test Note')).toBeVisible();
});