import {useEffect, useRef, useState, useMemo} from 'react';
import {createChart, ColorType} from 'lightweight-charts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';

export default function PriceChart({data, symbol, predictions = []}) {
	const chartContainerRef = useRef(null);
	const chartRef = useRef(null);
	const candlestickSeriesRef = useRef(null);
	const predictionSeriesRef = useRef(null);
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

	// Initialize chart
	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: {type: ColorType.Solid, color: 'transparent'},
				textColor: '#6b7280',
				fontSize: 12
			},
			grid: {
				vertLines: {color: '#e5e7eb'},
				horzLines: {color: '#e5e7eb'}
			},
			width: chartContainerRef.current.clientWidth,
			height: 400,
			rightPriceScale: {
				borderVisible: false
			},
			timeScale: {
				borderVisible: false,
				timeVisible: true,
				secondsVisible: false
			},
			crosshair: {
				mode: 1
			},
			handleScroll: {
				vertTouchDrag: false
			}
		});

		chartRef.current = chart;

		// Create candlestick series
		const candlestickSeries = chart.addCandlestickSeries({
			upColor: '#10b981',
			downColor: '#ef4444',
			borderVisible: false,
			wickUpColor: '#10b981',
			wickDownColor: '#ef4444'
		});

		candlestickSeriesRef.current = candlestickSeries;

		// Create prediction line series
		const predictionSeries = chart.addLineSeries({
			color: '#3b82f6',
			lineWidth: 2,
			lineStyle: 2, // Dashed
			priceLineVisible: false,
			lastValueVisible: false
		});

		predictionSeriesRef.current = predictionSeries;

		// Handle resize
		const handleResize = () => {
			if (chartContainerRef.current && chartRef.current) {
				chartRef.current.applyOptions({
					width: chartContainerRef.current.clientWidth
				});
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, []);

	// Update chart data
	useEffect(() => {
		if (!candlestickSeriesRef.current || !filteredData.length) return;

		const candleData = filteredData.map((item) => ({
			time: item.date,
			open: item.open,
			high: item.high,
			low: item.low,
			close: item.close
		}));

		candlestickSeriesRef.current.setData(candleData);

		// Fit content to time scale
		if (chartRef.current) {
			chartRef.current.timeScale().fitContent();
		}
	}, [filteredData]);

	// Update predictions
	useEffect(() => {
		if (!predictionSeriesRef.current || !predictions.length) return;

		const predictionData = predictions.map((item) => ({
			time: item.date,
			value: item.point
		}));

		predictionSeriesRef.current.setData(predictionData);
	}, [predictions]);

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

				<div ref={chartContainerRef} className="w-full" />
			</CardContent>
		</Card>
	);
}
