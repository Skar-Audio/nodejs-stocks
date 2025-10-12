import {getStockData} from '@lib/stocks/stock-api.mjs';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({error: 'Method not allowed'});
	}

	try {
		const {symbol} = req.query;
		const forceRefresh = req.query.refresh === 'true';

		if (!symbol) {
			return res.status(400).json({error: 'Symbol parameter is required'});
		}

		const data = await getStockData(symbol.toUpperCase(), forceRefresh);

		return res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		console.error('Error in stock API route:', error);
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to fetch stock data'
		});
	}
}
