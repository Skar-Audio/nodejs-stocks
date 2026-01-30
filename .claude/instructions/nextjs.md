# Next.js Development Instructions

## App Router Patterns

- Use Server Components by default
- Add 'use client' only when necessary (for hooks, browser APIs)
- Leverage Server Actions for mutations
- Implement proper loading.tsx and error.tsx files

## Data Fetching

- Use async/await in Server Components
- Implement proper caching strategies
- Use React Query for client-side data fetching
- Handle loading and error states properly

## API Routes

- Keep API routes focused and single-purpose
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Implement proper error handling
- Return consistent response formats
- Validate inputs thoroughly

## Performance

- Optimize images with next/image
- Implement code splitting
- Use dynamic imports for heavy components
- Monitor bundle size
- Leverage static generation when possible

## Database Integration

- Use connection pooling
- Implement proper error handling
- Use parameterized queries
- Keep database logic in lib/ folder
- Use transactions for multi-step operations

## TypeScript

- Define proper types for all data structures
- Use type-safe API routes
- Avoid 'any' types
- Leverage type inference

## Testing

- Test API routes thoroughly
- Verify database operations
- Test error scenarios
- Validate data transformations

## Security

- Never expose API keys client-side
- Validate all user inputs
- Use environment variables properly
- Implement CORS correctly
- Sanitize database queries
