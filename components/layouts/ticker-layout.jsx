import {useRouter} from 'next/router';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ArrowLeft, Activity} from 'lucide-react';

export default function TickerLayout({symbol, children, activeTab = 'overview'}) {
	const router = useRouter();

	const handleTabChange = (value) => {
		if (value === 'overview') {
			router.push(`/${symbol}`);
		} else {
			router.push(`/${symbol}/${value}`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			{/* Header */}
			<header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="sm" onClick={() => router.push('/')}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Dashboard
							</Button>
							<div className="flex items-center space-x-2">
								<Activity className="h-6 w-6 text-primary" />
								<h1 className="text-2xl font-bold">{symbol}</h1>
							</div>
						</div>
					</div>

					{/* Navigation Tabs */}
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="backtest">Backtest</TabsTrigger>
							<TabsTrigger value="explain">Explainability</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
