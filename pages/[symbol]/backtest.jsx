import {useRouter} from 'next/router';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import TickerLayout from '@/components/layouts/ticker-layout';
import {TrendingUp, Download, Settings} from 'lucide-react';

export default function TickerBacktestPage() {
	const router = useRouter();
	const {symbol} = router.query;
	const symbolUpper = symbol?.toUpperCase();

	// Mock backtest data - will be replaced with real data
	const backtestResults = {
		cagr: 15.4,
		sharpe: 1.82,
		maxDrawdown: -12.3,
		hitRate: 67.2,
		totalTrades: 48,
		winningTrades: 32,
		losingTrades: 16,
		benchmarkComparison: {
			symbol: 'SPY',
			cagr: 10.2,
			sharpe: 1.45
		}
	};

	return (
		<TickerLayout symbol={symbolUpper || '...'} activeTab="backtest">
			{/* Header */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Backtest Results</h2>
					<p className="text-sm text-muted-foreground">
						Strategy performance over historical data
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Settings className="mr-2 h-4 w-4" />
						Configure
					</Button>
					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Performance Metrics */}
			<div className="mb-6 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">CAGR</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-green-600">
							{backtestResults.cagr > 0 ? '+' : ''}
							{backtestResults.cagr}%
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							vs SPY: {backtestResults.benchmarkComparison.cagr}%
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Sharpe Ratio
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{backtestResults.sharpe}</p>
						<p className="text-xs text-muted-foreground mt-1">
							vs SPY: {backtestResults.benchmarkComparison.sharpe}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Max Drawdown
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-red-600">{backtestResults.maxDrawdown}%</p>
						<Badge variant="outline" className="mt-1">
							Risk metric
						</Badge>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Hit Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{backtestResults.hitRate}%</p>
						<p className="text-xs text-muted-foreground mt-1">
							{backtestResults.winningTrades}/{backtestResults.totalTrades} trades
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Strategy Details */}
			<div className="grid gap-6 md:grid-cols-2 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Strategy Configuration</CardTitle>
						<CardDescription>Current backtest parameters</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Strategy</span>
							<Badge>Baseline</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Period</span>
							<span className="font-medium">1 Year</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Walk-Forward</span>
							<Badge variant="outline">Enabled</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Commission</span>
							<span className="font-medium">$0.00 / trade</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Trade Statistics</CardTitle>
						<CardDescription>Win/loss breakdown</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Total Trades</span>
							<span className="font-medium">{backtestResults.totalTrades}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Winning Trades</span>
							<span className="font-medium text-green-600">
								{backtestResults.winningTrades}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Losing Trades</span>
							<span className="font-medium text-red-600">
								{backtestResults.losingTrades}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Avg. Trade Duration</span>
							<span className="font-medium">5.2 days</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Trade List */}
			<Card>
				<CardHeader>
					<CardTitle>Trade History</CardTitle>
					<CardDescription>Detailed trade-by-trade breakdown</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-12 text-muted-foreground">
						<TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Trade list will be displayed here</p>
						<p className="text-sm mt-2">Per-trade attribution and performance heatmap</p>
					</div>
				</CardContent>
			</Card>
		</TickerLayout>
	);
}
