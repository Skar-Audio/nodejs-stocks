# Test Suite

This folder contains backend tests for the nodejs-stocks application, following the same testing patterns used in the nextjs-tools repository.

## Structure

```
test/
├── bootstrap.mjs                    # Test helper with runTest function
├── template-test.mjs                # Template for creating new tests
├── test-bootstrap-verify.mjs        # Verify test setup is correct
├── README.md                        # This file
│
├── ai/                              # AI provider tests (3 tests)
│   ├── test-ai-initialize.mjs       # Quick setup check (no API calls)
│   ├── test-ai-provider-factory.mjs # Provider registration (no API calls)
│   └── test-ai-chat-completion.mjs  # Chat completion (makes API calls!)
│
├── mysql/                           # MySQL connector tests (2 tests)
│   ├── test-mysql-connector.mjs
│   └── test-mysql-table.mjs
│
├── query-builder/                   # SQL query builder tests (5 tests)
│   ├── test-get-select-query.mjs
│   ├── test-get-insert-query.mjs
│   ├── test-get-update-query.mjs
│   ├── test-get-insert-update-query.mjs
│   └── test-get-delete-query.mjs
│
├── stocks-db/                       # Stock database tests (6 tests)
│   ├── test-get-all-stocks.mjs
│   ├── test-get-stock-by-symbol.mjs
│   ├── test-add-stock.mjs
│   ├── test-update-stock.mjs
│   ├── test-get-watchlist.mjs
│   └── test-add-to-watchlist.mjs
│
└── utils/                           # Utility tests (1 test)
    └── test-color-logging.mjs
```

## Running Tests

### Prerequisites

1. Ensure your `.env` file is configured with the required database credentials:

   ```
   MYSQL_HOST=your_host
   MYSQL_DATABASE=your_database
   MYSQL_USERNAME=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_PORT=your_port
   ```

2. Ensure you have a MySQL database set up with the required tables (stocks, watchlist, etc.)

### Running Individual Tests

Run any test file directly with Node.js:

```bash
# Start here: Verify your setup
node test/test-bootstrap-verify.mjs

# Query builder tests (no database required - safe to run anytime)
node test/query-builder/test-get-select-query.mjs
node test/query-builder/test-get-insert-query.mjs
node test/query-builder/test-get-update-query.mjs
node test/query-builder/test-get-insert-update-query.mjs
node test/query-builder/test-get-delete-query.mjs

# MySQL connector tests (database required)
node test/mysql/test-mysql-connector.mjs
node test/mysql/test-mysql-table.mjs

# Stocks database tests (database required)
node test/stocks-db/test-get-all-stocks.mjs
node test/stocks-db/test-get-stock-by-symbol.mjs
node test/stocks-db/test-add-stock.mjs
node test/stocks-db/test-update-stock.mjs
node test/stocks-db/test-get-watchlist.mjs
node test/stocks-db/test-add-to-watchlist.mjs

# AI provider tests
node test/ai/test-ai-initialize.mjs         # Quick check (no API calls)
node test/ai/test-ai-provider-factory.mjs   # Provider setup (no API calls)
node test/ai/test-ai-chat-completion.mjs    # Real API test (costs money!)

# Utility tests
node test/utils/test-color-logging.mjs
```

## Writing New Tests

1. Copy `template-test.mjs` to create a new test file:

   ```bash
   cp test/template-test.mjs test/your-category/test-your-feature.mjs
   ```

2. Import the `runTest` helper:

   ```javascript
   import {runTest} from '../bootstrap.mjs';
   ```

3. Import the functions you want to test:

   ```javascript
   import {yourFunction} from '../../lib/your-module.mjs';
   ```

4. Write your test inside the `runTest` callback:
   ```javascript
   runTest(async () => {
   	console.log('Testing yourFunction...');
   	const result = await yourFunction();
   	console.log('Result:', result);
   	return {success: true};
   });
   ```

## Test Categories

### Query Builder Tests

These tests verify SQL query generation without requiring a database connection. They test:

- SELECT queries with various options
- INSERT queries
- UPDATE queries
- UPSERT (INSERT...ON DUPLICATE KEY UPDATE) queries
- DELETE queries

### MySQL Tests

These tests verify database connectivity and table operations:

- Database connection and configuration
- Table field inspection
- Basic query execution
- MysqlTable wrapper methods (select, insert, update, etc.)

### Stocks Database Tests

These tests verify the stocks-db API functions:

- Fetching stocks with various filters
- Adding new stocks
- Updating stock information
- Managing watchlists
- Stock analysis and predictions

### AI Provider Tests

These tests verify the AI provider factory and integrations:

- Provider registration and configuration
- Provider switching
- Chat completion requests (requires API keys and makes real API calls)
- Embeddings (when implemented)

**Note:** `test-ai-chat-completion.mjs` makes real API calls and will consume API credits. Use `test-ai-provider-factory.mjs` to test setup without making API calls.

### Utility Tests

Tests for utility functions like color logging.

## Notes

- Tests that modify the database (insert, update, delete) create test data with unique identifiers (e.g., `TEST123456`) to avoid conflicts
- The `runTest` helper automatically loads environment variables from `.env`
- All tests exit the process after completion
- Errors are caught and logged with colored output for easy identification

## Tips

- Use `console.table()` to display database results in a formatted table
- Return an object with `{success: boolean, ...}` from your test for structured results
- Group related tests in subdirectories
- Prefix test files with `test-` for easy identification
- Use descriptive names that explain what is being tested
