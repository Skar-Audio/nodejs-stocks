# Stock Analysis Dashboard - AI-Powered

A Next.js application for tracking, analyzing, and predicting stock market movements using AI technology from multiple providers (OpenAI, Google Gemini, and Anthropic Claude).

## Features

- **Stock Watchlist**: Track your favorite stocks with real-time data
- **AI-Powered Analysis**: Get insights from multiple AI providers (OpenAI, Gemini, Anthropic)
- **Price Predictions**: AI-generated predictions with confidence scores
- **Beautiful UI**: Built with shadcn/ui and Tailwind CSS
- **Database Integration**: MySQL database for storing stocks, analyses, and predictions

## Tech Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL with custom ORM layer
- **AI Providers**: OpenAI GPT-4, Google Gemini, Anthropic Claude
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- MySQL database
- API keys for at least one AI provider (OpenAI, Gemini, or Anthropic)

### Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials
   - Add your AI provider API keys

4. Create the database schema:

```bash
# Connect to your MySQL database and run:
mysql -u your_username -p core_linux < database/stocks_schema.sql
```

### Running the Application

Development mode:

```bash
npm run dev
```

The app will be available at http://localhost:3000

Production build:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Homepage/Dashboard
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── ai/                # AI provider integrations
│   │   └── apis/          # OpenAI, Gemini, Anthropic providers
│   ├── mysql/             # Database handlers
│   └── stocks/            # Stock-specific database functions
├── database/              # SQL schema files
├── styles/                # Global styles
└── public/                # Static assets
```

## AI Provider Setup

### OpenAI

Get your API key from: https://platform.openai.com/api-keys

### Google Gemini

Get your API key from: https://makersuite.google.com/app/apikey

### Anthropic Claude

Get your API key from: https://console.anthropic.com/

## Database Schema

The application uses 6 main tables:

- `stocks` - Stock information
- `stock_prices` - Historical price data
- `stock_analysis` - AI-generated analyses
- `stock_predictions` - AI predictions
- `watchlist` - User watchlist
- `stock_news` - News and sentiment

## Development

Format code:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

## License

ISC

## Author

Kevin
