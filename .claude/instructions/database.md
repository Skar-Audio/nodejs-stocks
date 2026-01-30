# Database Development Instructions

## MySQL Best Practices

- Always use parameterized queries
- Implement connection pooling
- Handle connection errors gracefully
- Close connections properly
- Use transactions for multi-step operations

## Query Patterns

- Write clear, readable SQL
- Use proper JOIN types
- Index frequently queried columns
- Avoid N+1 query problems
- Use EXPLAIN to optimize slow queries

## Schema Design

- Use appropriate data types
- Implement foreign key constraints
- Create indexes strategically
- Normalize data appropriately
- Document schema changes

## Data Access Layer

- Centralize database access in lib/mysql
- Use MysqlTable class for CRUD operations
- Implement proper error handling
- Log database errors
- Return consistent data structures

## Migrations

- Version all schema changes
- Test migrations thoroughly
- Keep migrations reversible when possible
- Document breaking changes
- Backup before major migrations

## Testing

- Test database operations in isolation
- Use test data fixtures
- Clean up test data after tests
- Verify constraints and triggers
- Test error scenarios

## Performance

- Monitor slow queries
- Use appropriate indexes
- Implement query caching when appropriate
- Batch operations when possible
- Profile database performance regularly

## Security

- Never log sensitive data
- Use encrypted connections
- Implement proper access controls
- Validate all inputs
- Sanitize user-provided data
