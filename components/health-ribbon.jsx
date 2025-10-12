import {useEffect, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Activity, AlertCircle, CheckCircle, Clock} from 'lucide-react';

/**
 * HealthRibbon - Shows market status, data latency, and backend health
 * Polls /api/status endpoint every 15 seconds
 */
export default function HealthRibbon() {
	const [status, setStatus] = useState({
		market: 'closed',
		dataLatency: 0,
		backend: 'ok',
		lastUpdate: Date.now()
	});

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await fetch('/api/status');
				if (response.ok) {
					const data = await response.json();
					setStatus({
						...data,
						lastUpdate: Date.now()
					});
				}
			} catch (error) {
				console.error('Failed to fetch status:', error);
				setStatus((prev) => ({
					...prev,
					backend: 'degraded',
					lastUpdate: Date.now()
				}));
			} finally {
				setIsLoading(false);
			}
		};

		// Initial fetch
		fetchStatus();

		// Poll every 15 seconds
		const interval = setInterval(fetchStatus, 15000);

		return () => clearInterval(interval);
	}, []);

	const getMarketBadge = () => {
		const isOpen = status.market === 'open';
		return (
			<Badge variant={isOpen ? 'default' : 'outline'} className="gap-1">
				<Activity className="h-3 w-3" />
				Market {isOpen ? 'Open' : 'Closed'}
			</Badge>
		);
	};

	const getLatencyBadge = () => {
		const threshold = 1000; // 1 second threshold
		const isHighLatency = status.dataLatency > threshold;

		return (
			<Badge variant={isHighLatency ? 'destructive' : 'outline'} className="gap-1">
				<Clock className="h-3 w-3" />
				{status.dataLatency}ms
			</Badge>
		);
	};

	const getBackendBadge = () => {
		const isHealthy = status.backend === 'ok';

		return (
			<Badge
				variant={isHealthy ? 'default' : 'destructive'}
				className="gap-1 bg-green-600 hover:bg-green-700"
			>
				{isHealthy ? (
					<CheckCircle className="h-3 w-3" />
				) : (
					<AlertCircle className="h-3 w-3" />
				)}
				Backend {isHealthy ? 'OK' : 'Degraded'}
			</Badge>
		);
	};

	if (isLoading) {
		return (
			<div className="border-b bg-muted/30 px-4 py-2">
				<div className="container mx-auto flex items-center justify-end gap-2">
					<div className="h-5 w-24 bg-muted animate-pulse rounded" />
					<div className="h-5 w-16 bg-muted animate-pulse rounded" />
					<div className="h-5 w-20 bg-muted animate-pulse rounded" />
				</div>
			</div>
		);
	}

	return (
		<div className="border-b bg-muted/30 px-4 py-2">
			<div className="container mx-auto flex items-center justify-end gap-2 text-sm">
				{getMarketBadge()}
				{getLatencyBadge()}
				{getBackendBadge()}
			</div>
		</div>
	);
}
