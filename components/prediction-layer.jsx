import {useEffect, useRef} from 'react';

/**
 * PredictionLayer - Adds prediction overlays to TradingView Lightweight Charts
 * Renders point forecasts, confidence bands, and uncertainty shading
 */
export function usePredictionLayer(chartRef, seriesRef) {
	const predictionLineRef = useRef(null);
	const confidenceBandRef = useRef(null);

	useEffect(() => {
		if (!chartRef.current) return;

		// Create prediction line series (dashed blue line for point forecast)
		if (!predictionLineRef.current) {
			predictionLineRef.current = chartRef.current.addLineSeries({
				color: '#3b82f6',
				lineWidth: 2,
				lineStyle: 2, // Dashed
				priceLineVisible: false,
				lastValueVisible: true,
				title: 'Prediction'
			});
		}

		// Create confidence band area series (shaded area for uncertainty)
		if (!confidenceBandRef.current) {
			confidenceBandRef.current = chartRef.current.addAreaSeries({
				topColor: 'rgba(59, 130, 246, 0.15)',
				bottomColor: 'rgba(59, 130, 246, 0.05)',
				lineColor: 'rgba(59, 130, 246, 0.3)',
				lineWidth: 1,
				priceLineVisible: false,
				lastValueVisible: false,
				title: 'Confidence Band'
			});
		}

		return () => {
			if (predictionLineRef.current) {
				chartRef.current.removeSeries(predictionLineRef.current);
				predictionLineRef.current = null;
			}
			if (confidenceBandRef.current) {
				chartRef.current.removeSeries(confidenceBandRef.current);
				confidenceBandRef.current = null;
			}
		};
	}, [chartRef]);

	const updatePredictions = (predictions) => {
		if (!predictions || predictions.length === 0) {
			if (predictionLineRef.current) predictionLineRef.current.setData([]);
			if (confidenceBandRef.current) confidenceBandRef.current.setData([]);
			return;
		}

		// Point forecast data
		const predictionData = predictions.map((p) => ({
			time: p.date,
			value: p.point
		}));

		// Confidence band data (using high/low from band)
		const confidenceData = predictions.map((p) => ({
			time: p.date,
			value: p.band?.high || p.point // Top of confidence band
		}));

		if (predictionLineRef.current) {
			predictionLineRef.current.setData(predictionData);
		}

		if (confidenceBandRef.current) {
			confidenceBandRef.current.setData(confidenceData);
		}
	};

	return {updatePredictions};
}

/**
 * PredictionMarker - Creates a marker on the chart for a specific prediction
 */
export function createPredictionMarker(date, point, probability) {
	return {
		time: date,
		position: 'aboveBar',
		color: probability >= 0.7 ? '#10b981' : probability >= 0.5 ? '#f59e0b' : '#6b7280',
		shape: 'arrowDown',
		text: `${(probability * 100).toFixed(0)}%`
	};
}

/**
 * Component to display prediction tooltip info
 */
export default function PredictionTooltip({prediction}) {
	if (!prediction) return null;

	return (
		<div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
			<p className="text-sm font-semibold mb-2">Prediction</p>
			<div className="space-y-1 text-xs">
				<div className="flex justify-between gap-4">
					<span className="text-muted-foreground">Point:</span>
					<span className="font-medium">${prediction.point?.toFixed(2)}</span>
				</div>
				<div className="flex justify-between gap-4">
					<span className="text-muted-foreground">Range:</span>
					<span className="font-medium">
						${prediction.band?.low?.toFixed(2)} - ${prediction.band?.high?.toFixed(2)}
					</span>
				</div>
				<div className="flex justify-between gap-4">
					<span className="text-muted-foreground">Confidence:</span>
					<span className="font-medium">{(prediction.confidence * 100).toFixed(0)}%</span>
				</div>
				{prediction.signals && (
					<div className="flex justify-between gap-4">
						<span className="text-muted-foreground">Signal:</span>
						<span
							className={`font-medium ${prediction.signals.action === 'buy' ? 'text-green-600' : prediction.signals.action === 'sell' ? 'text-red-600' : 'text-gray-600'}`}
						>
							{prediction.signals.action.toUpperCase()}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
