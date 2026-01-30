# AI Integration Instructions

## AI Provider Pattern

- Always use the unified factory from lib/ai/apis/ai-responses.mjs
- Never call OpenAI, Gemini, or Anthropic APIs directly
- Use submitToAIProvider() for all AI interactions
- Implement proper error handling and retries

## Provider Selection

- Default provider set in .env (DEFAULT_AI_PROVIDER)
- Can override provider per request
- Available providers: openai, gemini, anthropic
- Choose appropriate model for task complexity

## Prompt Engineering

- Write clear, specific prompts
- Include context and constraints
- Request structured output when needed
- Test prompts with different providers
- Version prompts for reproducibility

## Response Handling

- Parse JSON responses safely
- Validate AI outputs
- Handle malformed responses gracefully
- Log AI interactions for debugging
- Store responses with metadata

## Cost Management

- Choose appropriate models (gpt-4o vs gpt-4o-mini)
- Set reasonable token limits
- Cache responses when appropriate
- Monitor API usage
- Implement rate limiting

## Testing

- Test with multiple providers
- Verify response consistency
- Test error scenarios
- Validate data extraction
- Check edge cases

## Storage

- Store AI analysis with provider metadata
- Include model version
- Track confidence scores
- Log timestamps
- Enable response auditing

## Security

- Never expose API keys client-side
- Validate all AI outputs before use
- Sanitize inputs to AI
- Implement proper access controls
- Monitor for prompt injection
