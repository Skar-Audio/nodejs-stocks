import {getStocksDB} from '@lib/mysql/mysql.mjs';
import {submitToAIProvider} from '@lib/ai/apis/ai-responses.mjs';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return handleGetPredictions(req, res);
    } else if (req.method === 'POST') {
        return handleCreatePrediction(req, res);
    } else {
        return res.status(405).json({error: 'Method not allowed'});
    }
}

async function handleGetPredictions(req, res) {
    try {
        const {symbol} = req.query;
        const {limit = 10} = req.query;

        if (!symbol) {
            return res.status(400).json({error: 'Symbol parameter is required'});
        }

        const db = getStocksDB();
        const stocksTable = db.getTable('stocks');
        const predictionsTable = db.getTable('stock_predictions');

        // Get stock info
        const stock = await stocksTable.selectOne({symbol: symbol.toUpperCase()});
        if (!stock) {
            return res.status(404).json({error: `Stock ${symbol} not found`});
        }

        // Fetch recent predictions
        const predictions = await predictionsTable.select(
            {stock_id: stock.id},
            {orderBy: 'prediction_date', order: 'DESC', size: parseInt(limit)}
        );

        return res.status(200).json({
            success: true,
            predictions: predictions.map((p) => ({
                id: p.id,
                predictionDate: p.prediction_date,
                targetDate: p.target_date,
                predictedPrice: parseFloat(p.predicted_price),
                confidence: parseFloat(p.confidence),
                method: p.prediction_method,
                provider: p.ai_provider,
                model: p.ai_model,
                reasoning: p.reasoning,
                actualPrice: p.actual_price ? parseFloat(p.actual_price) : null
            }))
        });
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch predictions'
        });
    }
}

async function handleCreatePrediction(req, res) {
    try {
        const {symbol} = req.query;
        const {horizon = 5, provider = 'openai'} = req.body;

        if (!symbol) {
            return res.status(400).json({error: 'Symbol parameter is required'});
        }

        const db = getStocksDB();
        const stocksTable = db.getTable('stocks');
        const pricesTable = db.getTable('stock_prices');
        const predictionsTable = db.getTable('stock_predictions');

        // Get stock info
        const stock = await stocksTable.selectOne({symbol: symbol.toUpperCase()});
        if (!stock) {
            return res.status(404).json({error: `Stock ${symbol} not found`});
        }

        // Get recent price history (last 30 days)
        const recentPrices = await pricesTable.select(
            {stock_id: stock.id},
            {orderBy: 'price_date', order: 'DESC', size: 30}
        );

        if (!recentPrices || recentPrices.length === 0) {
            return res.status(400).json({error: 'Insufficient price data for prediction'});
        }

        // Prepare data for AI
        const latestPrice = recentPrices[0];
        const priceHistory = recentPrices.reverse().map((p) => ({
            date: p.price_date,
            close: parseFloat(p.close_price),
            volume: p.volume
        }));

        // Calculate simple technical indicators
        const prices = priceHistory.map((p) => p.close);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const trend =
            prices[prices.length - 1] > prices[0]
                ? 'upward'
                : prices[prices.length - 1] < prices[0]
                    ? 'downward'
                    : 'sideways';

        // Build AI prompt
        const prompt = `You are a financial analyst making stock price predictions.

Stock: ${symbol.toUpperCase()}
Current Price: $${latestPrice.close_price}
30-Day Average: $${avgPrice.toFixed(2)}
Recent Trend: ${trend}

Recent price data (last 10 days):
${priceHistory
            .slice(-10)
            .map((p) => `${p.date}: $${p.close}`)
            .join('\n')}

Task: Predict the stock price ${horizon} trading days from now.

Provide your response as a JSON object with this exact structure:
{
  "predicted_price": <number>,
  "confidence": <number 0-100>,
  "reasoning": "<brief explanation>",
  "signals": {
    "action": "<buy|sell|hold>",
    "probability": <number 0-1>
  }
}

Be conservative and realistic. Base your prediction on the trend, volatility, and recent price action.`;

        // Call AI provider
        const aiResponse = await submitToAIProvider({
            provider,
            messages: [{role: 'user', content: prompt}],
            temperature: 0.3,
            max_tokens: 500
        });

        // Parse AI response
        let prediction;
        try {
            const content = aiResponse.content.trim();
            // Extract JSON from markdown code blocks if present
            const jsonMatch =
                content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
            prediction = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('Failed to parse AI response:', aiResponse.content);
            return res.status(500).json({error: 'Failed to parse prediction from AI'});
        }

        // Validate prediction structure
        if (!prediction.predicted_price || !prediction.confidence) {
            return res.status(500).json({error: 'Invalid prediction structure from AI'});
        }

        // Calculate target date (horizon trading days from now)
        const predictionDate = new Date();
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + horizon);

        // Store prediction in database
        const predictionData = {
            stock_id: stock.id,
            prediction_date: predictionDate.toISOString().split('T')[0],
            target_date: targetDate.toISOString().split('T')[0],
            predicted_price: prediction.predicted_price,
            prediction_method: 'ai_analysis',
            ai_provider: provider,
            ai_model: aiResponse.model || 'unknown',
            confidence: prediction.confidence,
            reasoning: prediction.reasoning || ''
        };

        const result = await predictionsTable.insert(predictionData);

        return res.status(200).json({
            success: true,
            prediction: {
                id: result.insertId,
                symbol: symbol.toUpperCase(),
                current_price: parseFloat(latestPrice.close_price),
                predicted_price: prediction.predicted_price,
                horizon_days: horizon,
                target_date: targetDate.toISOString().split('T')[0],
                confidence: prediction.confidence,
                reasoning: prediction.reasoning,
                signals: prediction.signals,
                provider: provider,
                model: aiResponse.model
            }
        });
    } catch (error) {
        console.error('Error in prediction API route:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate prediction'
        });
    }
}
