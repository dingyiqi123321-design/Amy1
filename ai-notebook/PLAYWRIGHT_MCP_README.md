# Playwright MCP Integration for AI Notebook

This project now includes Playwright MCP (Model Context Protocol) integration for automated testing and interaction with your AI Notebook application.

## Installation

Playwright and MCP packages have been installed:
- `playwright` - Browser automation framework
- `@playwright/test` - Testing framework
- `playwright-mcp` - MCP integration for Playwright

## Usage

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Start MCP server
npm run mcp
```

### Available MCP Tools

The MCP configuration includes the following tools:

1. **navigate_to_notebook** - Navigate to the AI Notebook homepage
2. **create_new_note** - Create a new note with specified content
3. **get_all_notes** - Retrieve all notes from the notebook

### Example Test

A basic test file has been created in `tests/example.spec.ts` that demonstrates:
- Navigation to the homepage
- Creating a new note
- Verifying note creation

### Configuration Files

- `playwright.config.ts` - Main Playwright configuration
- `playwright-mcp.config.ts` - MCP-specific configuration

### Running the Application

Before running tests, make sure your development server is running:

```bash
npm run dev
```

Then in another terminal, you can run the tests or start the MCP server.

## Notes

- The tests expect the application to be running on `http://localhost:3000`
- Auto-save functionality is taken into account with appropriate wait times
- The MCP tools are designed to work with your specific AI Notebook UI elements