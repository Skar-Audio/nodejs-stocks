# Test Suite Quick Start Guide

## ✅ All Issues Fixed!

### Problems Solved

1. ✅ **Import errors** - AI config imports now use correct exports
2. ✅ **`.env` loading** - Bootstrap now searches directory tree for `.env` file
3. ✅ **AI response content** - Properly extracts content from all provider formats
4. ✅ **Provider patterns** - Uses your established AI provider factory pattern

## Quick Test Commands

### 1. First Time Setup

```bash
# Verify your test environment is configured correctly
node test/test-bootstrap-verify.mjs
```

### 2. Test Without Database (Fastest)

```bash
# Query builder tests - no DB connection needed
node test/query-builder/test-get-select-query.mjs
node test/utils/test-color-logging.mjs
```

### 3. Test With Database

```bash
# Make sure your MySQL database is running first!
node test/mysql/test-mysql-connector.mjs
node test/stocks-db/test-get-all-stocks.mjs
```

### 4. Test AI Setup (No API Calls)

```bash
# Check if your AI providers are configured correctly
node test/ai/test-ai-initialize.mjs
node test/ai/test-ai-provider-factory.mjs
```

### 5. Test AI Chat (Makes Real API Calls - Costs Money!)

```bash
# Only run this when you want to test actual AI functionality
node test/ai/test-ai-chat-completion.mjs
```

## What Was Fixed

### Error 1: Module Import Error

```
SyntaxError: The requested module does not provide an export named 'anthropicConfig'
```

**Fixed:** Updated imports to use actual exports (`anthropicModel`, `openAiModel`, `geminiModel`)

### Error 2: .env Not Loaded

```
Error: .env not loaded. Make sure .env file exists in project root.
```

**Fixed:** Bootstrap now uses Node.js built-in modules (`path`, `fs`) to search up the directory tree for `.env` file, just like `find-up` package but without the dependency.

### Improvement: AI Response Content

**Fixed:** Added proper content extraction that handles different provider response formats:

- OpenAI: `response.choices[0].message.content`
- Anthropic: `response.content[0].text`
- Gemini: Various formats

## Test Organization

**20 Test Files Total:**

- 🔧 **Query Builder** (5 tests) - No database needed
- 💾 **MySQL** (2 tests) - Database required
- 📊 **Stocks DB** (6 tests) - Database required
- 🤖 **AI Providers** (3 tests) - API keys required
- 🛠️ **Utilities** (1 test) - No requirements
- ✅ **Setup** (3 files) - Bootstrap, template, verify

## Example: Successful Test Run

```bash
$ node test/ai/test-ai-chat-completion.mjs

✓ Loaded environment from: /mnt/c/Users/Admin/IdeaProjects/nodejs-stocks/.env
runTest 1.933711

=== Testing AI Chat Completion ===

Initializing AI providers...
🚀 AI providers initialized. Available: openai, gemini, anthropic

Test 1: Simple chat completion (using current provider)
✓ Response received:
Content: The stock market is a platform where individuals and institutions
         can buy and sell shares of publicly traded companies...
Model used: gpt-4o-2024-08-06
Tokens: { prompt_tokens: 18, completion_tokens: 28, total_tokens: 46 }

Test 2: Testing with different provider
✓ Response from gemini:
Content: The P/E ratio, or price-to-earnings ratio, compares a company's
         stock price to its earnings per share...

Test 3: Testing provider switching
✓ Switched to gemini
✓ Switched back to openai

Done in 4.412592179
```

## Common Issues & Solutions

### Issue: "MYSQL_HOST is undefined"

**Solution:** Create a `.env` file in project root:

```env
MYSQL_HOST=localhost
MYSQL_DATABASE=your_db
MYSQL_USERNAME=your_user
MYSQL_PASSWORD=your_password
MYSQL_PORT=3306
```

### Issue: "AI provider not available"

**Solution:** Add API keys to `.env`:

```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
```

### Issue: Test runs but content shows "undefined"

**Solution:** This was fixed! Update your test files to use the corrected content extraction.

## Running Tests from Windows

From your Windows command prompt or PowerShell:

```cmd
cd C:\Users\Admin\IdeaProjects\nodejs-stocks
node test\test-bootstrap-verify.mjs
node test\ai\test-ai-chat-completion.mjs
```

## Best Practice Testing Order

1. **Verify Setup**

   ```bash
   node test/test-bootstrap-verify.mjs
   ```

2. **Test Query Builders** (no DB needed)

   ```bash
   node test/query-builder/test-get-select-query.mjs
   ```

3. **Test Database Connection**

   ```bash
   node test/mysql/test-mysql-connector.mjs
   ```

4. **Test Stocks Database Functions**

   ```bash
   node test/stocks-db/test-get-all-stocks.mjs
   ```

5. **Test AI Setup** (no API calls)

   ```bash
   node test/ai/test-ai-initialize.mjs
   ```

6. **Test AI Chat** (only when needed, costs money)
   ```bash
   node test/ai/test-ai-chat-completion.mjs
   ```

## Technical Details

### Bootstrap.mjs Changes

The bootstrap now:

- Uses `fileURLToPath` and `dirname` to locate itself
- Implements `findEnvFile()` function to search directory tree
- Provides clear error messages if `.env` not found
- Logs the `.env` file path when loaded

### AI Test Improvements

- Uses `initializeProviders()` from `ai-responses.mjs`
- Properly handles multiple provider formats
- Extracts content with fallbacks for different response structures
- Tests provider switching functionality

## Need Help?

- See `test/README.md` for complete documentation
- Use `test/template-test.mjs` as a starting point for new tests
- All tests follow the same pattern from your nextjs-tools repository
- Tests now work exactly like your other repository!
