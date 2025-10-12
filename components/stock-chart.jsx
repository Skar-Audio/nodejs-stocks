'use client';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useState, useMemo} from 'react';

const CustomTooltip = ({active, payload}) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="rounded-lg border bg-background p-2 shadow-md">
				<p className="text-sm font-medium">{data.date}</p>
				<p className="text-sm text-muted-foreground">
					Close:{' '}
					<span className="font-semibold text-foreground">${data.close?.toFixed(2)}</span>
				</p>
				<p className="text-sm text-muted-foreground">
					Volume:{' '}
					<span className="font-semibold text-foreground">
						{data.volume?.toLocaleString()}
					</span>
				</p>
			</div>
		);
	}
	return null;
};

export default function StockChart({data, symbol}) {
	const [timeRange, setTimeRange] = useState('1M');

	const filteredData = useMemo(() => {
		if (!data || data.length === 0) return [];

		const now = new Date();
		let daysAgo;

		switch (timeRange) {
			case '1W':
				daysAgo = 7;
				break;
			case '1M':
				daysAgo = 30;
				break;
			case '3M':
				daysAgo = 90;
				break;
			case '6M':
				daysAgo = 180;
				break;
			case '1Y':
				daysAgo = 365;
				break;
			case 'ALL':
				return data;
			default:
				daysAgo = 30;
		}

		const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
		return data.filter((item) => new Date(item.date) >= cutoffDate);
	}, [data, timeRange]);

	const priceChange = useMemo(() => {
		if (filteredData.length < 2) return null;
		const first = filteredData[0].close;
		const last = filteredData[filteredData.length - 1].close;
		const change = last - first;
		const changePercent = ((change / first) * 100).toFixed(2);
		return {change, changePercent, isPositive: change >= 0};
	}, [filteredData]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Price Chart - {symbol}</CardTitle>
					{priceChange && (
						<div
							className={`text-sm font-medium ${priceChange.isPositive ? 'text-green-600' : 'text-red-600'}`}
						>
							{priceChange.isPositive ? '+' : ''}
							{priceChange.changePercent}% ({timeRange})
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<Tabs value={timeRange} onValueChange={setTimeRange} className="mb-4">
					<TabsList>
						<TabsTrigger value="1W">1W</TabsTrigger>
						<TabsTrigger value="1M">1M</TabsTrigger>
						<TabsTrigger value="3M">3M</TabsTrigger>
						<TabsTrigger value="6M">6M</TabsTrigger>
						<TabsTrigger value="1Y">1Y</TabsTrigger>
						<TabsTrigger value="ALL">ALL</TabsTrigger>
					</TabsList>
				</Tabs>

				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={filteredData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="date"
							tick={{fontSize: 12}}
							className="text-muted-foreground"
							tickFormatter={(value) => {
								const date = new Date(value);
								return `${date.getMonth() + 1}/${date.getDate()}`;
							}}
						/>
						<YAxis
							tick={{fontSize: 12}}
							className="text-muted-foreground"
							domain={['auto', 'auto']}
							tickFormatter={(value) => `$${value.toFixed(0)}`}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="close"
							stroke="hsl(var(--primary))"
							strokeWidth={2}
							dot={false}
							activeDot={{r: 6}}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
