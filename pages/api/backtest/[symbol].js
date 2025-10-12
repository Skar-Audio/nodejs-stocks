import {getStocksDB} from '@lib/mysql/mysql.mjs';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const {symbol} = req.query;
        const {period = 365, benchmark = 'SPY'} = req.query;

        if (!symbol) {
            return res.status(400).json({error: 'Symbol parameter is required'});
        }

        const db = getStocksDB();
        const stocksTable = db.getTable('stocks');
        const predictionsTable = db.getTable('stock_predictions');
        const pricesTable = db.getTable('stock_prices');

        // Get stock info
        const stock = await stocksTable.selectOne({symbol: symbol.toUpperCase()});
        if (!stock) {
            return res.status(404).json({error: `Stock ${symbol} not found`});
        }

        // Get all predictions with actual outcomes
        const predictions = await predictionsTable.select(
            {stock_id: stock.id},
            {orderBy: 'prediction_date', order: 'ASC'}
        );

        if (!predictions || predictions.length === 0) {
            return res.status(400).json({error: 'No predictions available for backtesting'});
        }

        // For each prediction, get the actual price on target date
        const tradesWithOutcomes = [];
        for (const pred of predictions) {
            const actualPrice = await pricesTable.selectOne(
                {stock_id: stock.id, price_date: pred.target_date},
                {orderBy: 'price_date', order: 'DESC'}
            );

            if (actualPrice) {
                const predictedPrice = parseFloat(pred.predicted_price);
                const actual = parseFloat(actualPrice.close_price);
                const basePrice = parseFloat(pred.current_price || actualPrice.open_price);

                const predictedReturn = ((predictedPrice - basePrice) / basePrice) * 100;
                const actualReturn = ((actual - basePrice) / basePrice) * 100;

                const trade = {
                    predictionDate: pred.prediction_date,
                    targetDate: pred.target_date,
                    basePrice,
                    predictedPrice,
                    actualPrice: actual,
                    predictedReturn: parseFloat(predictedReturn.toFixed(2)),
                    actualReturn: parseFloat(actualReturn.toFixed(2)),
                    correct: (predictedReturn > 0 && actualReturn > 0) || (predictedReturn < 0 && actualReturn < 0),
                    returnDiff: parseFloat((actualReturn - predictedReturn).toFixed(2))
                };

                tradesWithOutcomes.push(trade);
            }
        }

        if (tradesWithOutcomes.length === 0) {
            return res.status(400).json({error: 'No completed predictions to backtest'});
        }

        // Calculate backtest metrics
        const metrics = calculateBacktestMetrics(tradesWithOutcomes);

        // Get benchmark data (simplified - just use a fixed benchmark for now)
        const benchmarkMetrics = {
            symbol: benchmark,
            cagr: 10.2, // Mock benchmark CAGR
            sharpe: 1.45 // Mock benchmark Sharpe
        };

        return res.status(200).json({
            success: true,
            backtest: {
                ...metrics,
                benchmarkComparison: benchmarkMetrics,
                trades: tradesWithOutcomes
            }
        });
    } catch (error) {
        console.error('Error running backtest:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to run backtest'
        });
    }
}

function calculateBacktestMetrics(trades) {
    const returns = trades.map((t) => t.actualReturn);
    const winningTrades = trades.filter((t) => t.actualReturn > 0).length;
    const losingTrades = trades.filter((t) => t.actualReturn < 0).length;
    const correctPredictions = trades.filter((t) => t.correct).length;

    // Calculate CAGR (simplified)
    const totalReturn = returns.reduce((sum, r) => sum + r, 0);
    const avgReturn = totalReturn / returns.length;
    const cagr = avgReturn * (252 / trades.length); // Annualized assuming 252 trading days

    // Calculate Sharpe Ratio
    const avgReturnDecimal = avgReturn / 100;
    const stdDev = calculateStdDev(returns.map((r) => r / 100));
    const sharpe = stdDev > 0 ? (avgReturnDecimal / stdDev) * Math.sqrt(252) : 0;

    // Calculate Max Drawdown
    const maxDrawdown = calculateMaxDrawdown(returns);

    // Calculate Hit Rate
    const hitRate = (correctPredictions / trades.length) * 100;

    return {
        cagr: parseFloat(cagr.toFixed(2)),
        sharpe: parseFloat(sharpe.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        hitRate: parseFloat(hitRate.toFixed(2)),
        totalTrades: trades.length,
        winningTrades,
        losingTrades,
        correctPredictions
    };
}

function calculateStdDev(values) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
}

function calculateMaxDrawdown(returns) {
    let peak = 0;
    let maxDD = 0;
    let cumulative = 0;

    for (const ret of returns) {
        cumulative += ret;
        if (cumulative > peak) {
            peak = cumulative;
        }
        const drawdown = peak - cumulative;
        if (drawdown > maxDD) {
            maxDD = drawdown;
        }
    }

    return -maxDD; // Return as negative percentage
}
