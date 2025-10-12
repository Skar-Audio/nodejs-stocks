import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../components/ui/card';
import {Button} from '../components/ui/button';
import {Activity, Brain, LineChart, Plus, TrendingDown, TrendingUp} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

export default function HomePage() {
	const router = useRouter();
	const [watchlist, setWatchlist] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch watchlist data
		// For now, using mock data
		setTimeout(() => {
			setWatchlist([
				{
					id: 1,
					symbol: 'AAPL',
					name: 'Apple Inc.',
					price: 178.45,
					change: 2.34,
					changePercent: 1.33,
					status: 'watching'
				},
				{
					id: 2,
					symbol: 'TSLA',
					name: 'Tesla Inc.',
					price: 238.72,
					change: -5.12,
					changePercent: -2.1,
					status: 'analyzing'
				},
				{
					id: 3,
					symbol: 'NVDA',
					name: 'NVIDIA Corporation',
					price: 495.23,
					change: 8.45,
					changePercent: 1.74,
					status: 'recommended'
				}
			]);
			setLoading(false);
		}, 500);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			{/* Header */}
			<header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Activity className="h-8 w-8 text-primary" />
						<h1 className="text-2xl font-bold">Stock Analysis AI</h1>
					</div>
					<div className="flex items-center space-x-4">
						<Button variant="outline" size="sm">
							<Brain className="mr-2 h-4 w-4" />
							AI Analysis
						</Button>
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Add Stock
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Watching</CardTitle>
							<LineChart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{watchlist.length}</div>
							<p className="text-xs text-muted-foreground">Active stocks in watchlist</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
							<Brain className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12</div>
							<p className="text-xs text-muted-foreground">Generated this week</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Predictions</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">8</div>
							<p className="text-xs text-muted-foreground">Active predictions</p>
						</CardContent>
					</Card>
				</div>

				{/* Watchlist */}
				<Card>
					<CardHeader>
						<CardTitle>Stock Watchlist</CardTitle>
						<CardDescription>
							Track and analyze your favorite stocks with AI-powered insights
						</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						) : watchlist.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">No stocks in your watchlist yet</p>
								<Button>
									<Plus className="mr-2 h-4 w-4" />
									Add Your First Stock
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{watchlist.map((stock) => (
									<div
										key={stock.id}
										onClick={() => router.push(`/${stock.symbol}`)}
										className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
									>
										<div className="flex-1">
											<div className="flex items-center space-x-3">
												<div>
													<h3 className="font-semibold text-lg">{stock.symbol}</h3>
													<p className="text-sm text-muted-foreground">{stock.name}</p>
												</div>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														stock.status === 'watching'
															? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
															: stock.status === 'analyzing'
																? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
																: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
													}`}
												>
													{stock.status}
												</span>
											</div>
										</div>
										<div className="flex items-center space-x-6">
											<div className="text-right">
												<p className="text-lg font-semibold">${stock.price.toFixed(2)}</p>
												<div
													className={`flex items-center text-sm ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
												>
													{stock.change >= 0 ? (
														<TrendingUp className="h-4 w-4 mr-1" />
													) : (
														<TrendingDown className="h-4 w-4 mr-1" />
													)}
													{stock.change >= 0 ? '+' : ''}
													{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
												</div>
											</div>
											<Button variant="outline" size="sm">
												<Brain className="mr-2 h-4 w-4" />
												Analyze
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
