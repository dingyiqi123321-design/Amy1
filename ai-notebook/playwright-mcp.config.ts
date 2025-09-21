import { defineConfig } from 'playwright-mcp';

export default defineConfig({
  name: 'AI Notebook MCP',
  version: '1.0.0',
  description: 'MCP for testing AI Notebook application',
  
  tools: [
    {
      name: 'navigate_to_notebook',
      description: 'Navigate to the AI Notebook homepage',
      handler: async ({ page }: { page: any }) => {
        await page.goto('http://localhost:3000');
        return { success: true, message: 'Successfully navigated to AI Notebook' };
      }
    },
    {
      name: 'create_new_note',
      description: 'Create a new note with the given content',
      parameters: {
        content: {
          type: 'string',
          description: 'The content for the new note',
          required: true
        }
      },
      handler: async ({ page }: { page: any }, { content }: { content: string }) => {
        await page.getByRole('button', { name: '新建笔记' }).click();
        await page.locator('textarea').fill(content);
        await page.waitForTimeout(3000); // Wait for auto-save
        return { success: true, message: 'New note created successfully' };
      }
    },
    {
      name: 'get_all_notes',
      description: 'Get all notes from the notebook',
      handler: async ({ page }: { page: any }) => {
        const notes = await page.locator('.note-item').allTextContents();
        return { success: true, notes };
      }
    }
  ],
  
  // Playwright configuration
  playwright: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  }
});