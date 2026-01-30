# Node.js Stocks

Stock analysis application with AI-powered predictions using multiple AI providers (OpenAI, Gemini, Anthropic).

## Quick Reference

| Resource | Description |
|----------|-------------|
| Dev Server | `localhost:3000` |
| Database | `stocks` schema in MySQL |
| AI Factory | `lib/ai/apis/ai-responses.mjs` |
| UI | shadcn/ui components only |

---

## Agent Delegation

| Agent | Triggers On | Model |
|-------|-------------|-------|
| `debugging-pro` | Errors, test failures, stack traces | Opus |
| `backend-architect` | API design, architecture decisions | Opus |
| `code-reviewer` | Post-implementation review | Sonnet |

**Manual invocation**: "Use the {agent-name} agent to..."

---

## Commands

```bash
npm run dev           # Start dev server
npm run format        # Format code (tabs, width 3)
node test/[file].js   # Run individual test
node .claude/test-*/test-*.js  # Run Claude tests
```

---

## Core Standards

### Quality
- Zero errors, lint issues
- Use `runTest` wrapper for tests
- shadcn/ui components exclusively

### Workflow
1. **Research** - Review AI provider patterns
2. **Plan** - Consider provider fallbacks
3. **Implement** - Test with multiple providers

### AI Provider Pattern
```javascript
import { submitToAIProvider } from '@lib/ai/apis/ai-responses.mjs';

const response = await submitToAIProvider({
  provider: 'gemini',  // openai, gemini, anthropic
  messages: [{ role: 'user', content: 'Analyze AAPL' }],
  temperature: 0.7
});
```

### Database Pattern
```javascript
const db = getStocksDB();
const stocksTable = db.getTable('stocks');
const result = await stocksTable.selectOne({ symbol });
```

---

## Avoid Over-Engineering

- Simple analysis workflows
- Don't over-abstract AI calls
- Use existing provider patterns
- No speculative features

---

## Project Structure

```
/
├── .claude/              # Claude configuration
├── /lib/
│   ├── /ai/              # AI provider integrations
│   │   └── /apis/        # Provider factory and implementations
│   ├── /stocks/          # Stock business logic
│   ├── /mysql/           # Database layer
│   └── /common/          # Utilities
├── /app/                 # Next.js App Router
│   └── /api/             # API routes
├── /components/
│   └── /ui/              # shadcn/ui components ONLY
├── /database/            # SQL schema files
└── /test/                # Test files
```

---

## AI Providers

| Provider | Models |
|----------|--------|
| OpenAI | gpt-4o, gpt-4o-mini, o1, o3-mini |
| Gemini | gemini-2.0-flash-exp, gemini-1.5-pro |
| Anthropic | claude-3-5-sonnet, claude-3-5-haiku |

---

## UI Standards (shadcn/ui)

- ALWAYS use shadcn/ui components
- NEVER create custom styled divs
- Use exact patterns from shadcn docs
- Color tokens: `bg-background`, `text-foreground`, etc.

---

## Protected Items

- AI model names (intentional, don't change)
- API keys and credentials
- Database configurations
- Provider configurations

---

*Unified Architecture v2.0*
