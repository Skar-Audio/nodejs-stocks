import {useRouter} from 'next/router';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import TickerLayout from '@/components/layouts/ticker-layout';
import {AlertTriangle, BarChart3, TrendingUp, Info} from 'lucide-react';

export default function TickerExplainPage() {
	const router = useRouter();
	const {symbol} = router.query;
	const symbolUpper = symbol?.toUpperCase();

	// Mock feature importance data - will be replaced with real data
	const featureImportance = [
		{name: 'Price Momentum (20d)', weight: 0.24, trend: 'up'},
		{name: 'Volume Profile', weight: 0.19, trend: 'neutral'},
		{name: 'RSI Divergence', weight: 0.16, trend: 'down'},
		{name: 'MACD Signal', weight: 0.14, trend: 'up'},
		{name: 'Market Sentiment', weight: 0.12, trend: 'up'}
	];

	const modelDiagnostics = {
		mae: 2.34,
		mape: 3.12,
		rollingAccuracy: 87.5,
		dataQuality: 'good',
		driftDetected: false,
		psi: 0.08
	};

	return (
		<TickerLayout symbol={symbolUpper || '...'} activeTab="explain">
			{/* Header */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold">Model Explainability</h2>
				<p className="text-sm text-muted-foreground">
					Understand how predictions are generated and model performance
				</p>
			</div>

			{/* Model Health Check */}
			<div className="mb-6">
				<Card className={modelDiagnostics.driftDetected ? 'border-yellow-500' : ''}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Model Health Status</CardTitle>
							<Badge variant={modelDiagnostics.driftDetected ? 'destructive' : 'default'}>
								{modelDiagnostics.driftDetected ? 'Drift Detected' : 'Healthy'}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-4">
							<div>
								<p className="text-sm text-muted-foreground">MAE</p>
								<p className="text-2xl font-bold">{modelDiagnostics.mae}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">MAPE</p>
								<p className="text-2xl font-bold">{modelDiagnostics.mape}%</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Accuracy (Rolling)</p>
								<p className="text-2xl font-bold text-green-600">
									{modelDiagnostics.rollingAccuracy}%
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">PSI Score</p>
								<p className="text-2xl font-bold">{modelDiagnostics.psi}</p>
								<p className="text-xs text-muted-foreground">{'<'}0.2 = stable</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Feature Importance */}
			<div className="mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Feature Importance</CardTitle>
						<CardDescription>Top 5 drivers of prediction for 5-day horizon</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{featureImportance.map((feature, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">{feature.name}</span>
											{feature.trend === 'up' && (
												<TrendingUp className="h-4 w-4 text-green-600" />
											)}
											{feature.trend === 'down' && (
												<TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
											)}
											{feature.trend === 'neutral' && (
												<BarChart3 className="h-4 w-4 text-muted-foreground" />
											)}
										</div>
										<span className="text-sm font-semibold">{(feature.weight * 100).toFixed(0)}%</span>
									</div>
									<div className="relative h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="absolute left-0 top-0 h-full bg-primary rounded-full"
											style={{width: `${feature.weight * 100}%`}}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Prediction Components */}
			<div className="grid gap-6 md:grid-cols-2 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Prediction Breakdown</CardTitle>
						<CardDescription>Components of forecast</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Base Trend</span>
							<div className="flex items-center gap-2">
								<span className="font-medium">$245.30</span>
								<Badge variant="outline">Core</Badge>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Event Lift</span>
							<div className="flex items-center gap-2">
								<span className="font-medium text-green-600">+$3.20</span>
								<Badge variant="outline">Earnings</Badge>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Residual</span>
							<div className="flex items-center gap-2">
								<span className="font-medium text-red-600">-$1.05</span>
								<Badge variant="outline">Noise</Badge>
							</div>
						</div>
						<div className="border-t pt-3 flex justify-between items-center">
							<span className="text-sm font-semibold">Final Prediction</span>
							<span className="text-lg font-bold">$247.45</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Data Quality</CardTitle>
						<CardDescription>Input data health metrics</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Overall Status</span>
							<Badge variant="default">Good</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Missingness</span>
							<span className="font-medium">0.02%</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Last API Check</span>
							<span className="font-medium">2 min ago</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Data Freshness</span>
							<Badge variant="outline">Real-time</Badge>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Warnings & Notices */}
			{modelDiagnostics.psi > 0.2 && (
				<Card className="border-yellow-500">
					<CardHeader>
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-yellow-600" />
							<CardTitle>Drift Warning</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Population Stability Index (PSI) above threshold. Model may need retraining with
							recent data.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Help Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Info className="h-5 w-5 text-blue-600" />
						<CardTitle>Understanding These Metrics</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<p>
						<strong>MAE (Mean Absolute Error):</strong> Average prediction error in dollars. Lower
						is better.
					</p>
					<p>
						<strong>MAPE (Mean Absolute Percentage Error):</strong> Average error as percentage.
						Lower is better.
					</p>
					<p>
						<strong>PSI (Population Stability Index):</strong> Measures data drift. {'<'}0.1 =
						stable, 0.1-0.2 = slight shift, {'>'}0.2 = significant drift.
					</p>
				</CardContent>
			</Card>
		</TickerLayout>
	);
}
