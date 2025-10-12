import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {TrendingUp, TrendingDown, Minus, Activity} from 'lucide-react';

/**
 * SignalsPanel - Displays buy/sell/hold signals with probabilities
 * Shows expected return, risk score, and recent model runs
 */
export default function SignalsPanel({signals}) {
	// Default mock data if no signals provided
	const defaultSignals = {
		action: 'buy',
		probability: 0.72,
		expectedReturn: 5.4,
		riskScore: 3.2,
		horizon: '5-day',
		lastRuns: [
			{timestamp: '2025-01-12 10:30', action: 'buy', probability: 0.72},
			{timestamp: '2025-01-11 10:30', action: 'buy', probability: 0.68},
			{timestamp: '2025-01-10 10:30', action: 'hold', probability: 0.55},
			{timestamp: '2025-01-09 10:30', action: 'buy', probability: 0.61},
			{timestamp: '2025-01-08 10:30', action: 'hold', probability: 0.52}
		]
	};

	const data = signals || defaultSignals;

	const getActionIcon = (action) => {
		switch (action) {
			case 'buy':
				return <TrendingUp className="h-5 w-5" />;
			case 'sell':
				return <TrendingDown className="h-5 w-5" />;
			default:
				return <Minus className="h-5 w-5" />;
		}
	};

	const getActionColor = (action) => {
		switch (action) {
			case 'buy':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'sell':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	const getSignalBadgeVariant = (action) => {
		switch (action) {
			case 'buy':
				return 'default';
			case 'sell':
				return 'destructive';
			default:
				return 'outline';
		}
	};

	return (
		<div className="space-y-6">
			{/* Main Signal Card */}
			<Card className={`border-2 ${getActionColor(data.action)}`}>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							{getActionIcon(data.action)}
							Signal: {data.action.toUpperCase()}
						</CardTitle>
						<Badge variant={getSignalBadgeVariant(data.action)} className="text-lg px-3 py-1">
							{(data.probability * 100).toFixed(0)}%
						</Badge>
					</div>
					<CardDescription>Current {data.horizon} forecast</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Expected Return</p>
							<p
								className={`text-2xl font-bold ${data.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}
							>
								{data.expectedReturn >= 0 ? '+' : ''}
								{data.expectedReturn}%
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Risk Score</p>
							<p className="text-2xl font-bold">
								{data.riskScore}/10
								<span className="text-sm font-normal text-muted-foreground ml-2">
									{data.riskScore < 4 ? 'Low' : data.riskScore < 7 ? 'Medium' : 'High'}
								</span>
							</p>
						</div>
					</div>

					{/* Probability Bar */}
					<div className="mt-4">
						<div className="flex justify-between text-sm mb-1">
							<span className="text-muted-foreground">Confidence</span>
							<span className="font-medium">{(data.probability * 100).toFixed(1)}%</span>
						</div>
						<div className="relative h-3 bg-muted rounded-full overflow-hidden">
							<div
								className={`absolute left-0 top-0 h-full rounded-full transition-all ${
									data.action === 'buy'
										? 'bg-green-500'
										: data.action === 'sell'
											? 'bg-red-500'
											: 'bg-gray-500'
								}`}
								style={{width: `${data.probability * 100}%`}}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recent Runs */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Activity className="h-4 w-4" />
						Recent Model Runs
					</CardTitle>
					<CardDescription>Last 5 prediction cycles</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{data.lastRuns.map((run, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className={`p-1.5 rounded ${getActionColor(run.action)}`}>
										{getActionIcon(run.action)}
									</div>
									<div>
										<p className="text-sm font-medium">{run.action.toUpperCase()}</p>
										<p className="text-xs text-muted-foreground">{run.timestamp}</p>
									</div>
								</div>
								<Badge variant="outline">{(run.probability * 100).toFixed(0)}%</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Signal Sparkline Placeholder */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Probability Trend</CardTitle>
					<CardDescription>Signal strength over time</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-24 flex items-end gap-1">
						{data.lastRuns.map((run, index) => (
							<div
								key={index}
								className={`flex-1 rounded-t transition-all ${
									run.action === 'buy'
										? 'bg-green-500'
										: run.action === 'sell'
											? 'bg-red-500'
											: 'bg-gray-400'
								}`}
								style={{height: `${run.probability * 100}%`}}
								title={`${run.timestamp}: ${(run.probability * 100).toFixed(0)}%`}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
