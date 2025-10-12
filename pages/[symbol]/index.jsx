import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import PriceChart from '@/components/price-chart';
import TickerLayout from '@/components/layouts/ticker-layout';
import {TrendingUp, TrendingDown, RefreshCw} from 'lucide-react';

export default function TickerOverviewPage() {
	const router = useRouter();
	const {symbol} = router.query;
	const symbolUpper = symbol?.toUpperCase();

	const [stockData, setStockData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchStockData = async (forceRefresh = false) => {
		if (!symbolUpper) return;

		try {
			setLoading(!forceRefresh);
			setRefreshing(forceRefresh);
			setError(null);

			const url = `/api/stocks/${symbolUpper}${forceRefresh ? '?refresh=true' : ''}`;
			const response = await fetch(url);
			const result = await response.json();

			if (result.success) {
				setStockData(result.data);
			} else {
				setError(result.error || 'Failed to fetch stock data');
			}
		} catch (err) {
			console.error('Error fetching stock data:', err);
			setError('Failed to load stock data. Please try again.');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (symbolUpper) {
			fetchStockData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [symbolUpper]);

	if (loading) {
		return (
			<TickerLayout symbol={symbolUpper || '...'} activeTab="overview">
				<Skeleton className="mb-8 h-12 w-64" />
				<div className="mb-6 grid gap-4 md:grid-cols-4">
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
				</div>
				<Skeleton className="h-96" />
			</TickerLayout>
		);
	}

	if (error) {
		return (
			<TickerLayout symbol={symbolUpper || '...'} activeTab="overview">
				<Card className="border-destructive">
					<CardHeader>
						<CardTitle className="text-destructive">Error Loading Stock Data</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => fetchStockData()} variant="outline">
							Try Again
						</Button>
					</CardContent>
				</Card>
			</TickerLayout>
		);
	}

	if (!stockData) {
		return null;
	}

	const {quote, timeSeries, fromCache} = stockData;
	const isPositive = quote.change >= 0;

	return (
		<TickerLayout symbol={symbolUpper} activeTab="overview">
			{/* Price Header */}
			<div className="mb-6 flex items-baseline justify-between">
				<div>
					<div className="flex items-baseline gap-4">
						<span className="text-3xl font-semibold">${quote.price?.toFixed(2)}</span>
						<div
							className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
						>
							{isPositive ? (
								<TrendingUp className="h-5 w-5" />
							) : (
								<TrendingDown className="h-5 w-5" />
							)}
							<span className="text-lg font-medium">
								{isPositive ? '+' : ''}
								{quote.change?.toFixed(2)} ({quote.changePercent})
							</span>
						</div>
					</div>
					<p className="text-sm text-muted-foreground">
						Last updated: {quote.latestTradingDay} • Market Close
					</p>
				</div>
				<div className="flex gap-2">
					{fromCache && <Badge variant="outline">Cached</Badge>}
					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchStockData(true)}
						disabled={refreshing}
					>
						<RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
						{refreshing ? 'Refreshing...' : 'Refresh'}
					</Button>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="mb-6 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">${quote.open?.toFixed(2)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">High</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">${quote.high?.toFixed(2)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Low</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">${quote.low?.toFixed(2)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{(quote.volume / 1000000).toFixed(2)}M</p>
					</CardContent>
				</Card>
			</div>

			{/* Chart */}
			<div className="mb-6">
				<PriceChart data={timeSeries} symbol={symbolUpper} />
			</div>

			{/* Analysis & Stats */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>AI Analysis</CardTitle>
						<CardDescription>Get AI-powered insights for this stock</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className="w-full">Generate AI Analysis</Button>
						<p className="mt-4 text-sm text-muted-foreground">
							Click to analyze {symbolUpper} using AI providers (OpenAI, Gemini, or Anthropic)
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Stats</CardTitle>
						<CardDescription>Key metrics and information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Previous Close</span>
							<span className="font-medium">${quote.previousClose?.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Day Range</span>
							<span className="font-medium">
								${quote.low?.toFixed(2)} - ${quote.high?.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Volume</span>
							<span className="font-medium">{quote.volume?.toLocaleString()}</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</TickerLayout>
	);
}
