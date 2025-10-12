import {searchStocks} from '@lib/stocks/stock-api.mjs';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({error: 'Method not allowed'});
	}

	try {
		const {q: query} = req.query;

		if (!query || query.length < 1) {
			return res.status(400).json({error: 'Query parameter is required'});
		}

		const results = await searchStocks(query);

		return res.status(200).json({
			success: true,
			data: results
		});
	} catch (error) {
		console.error('Error in search API route:', error);
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to search stocks'
		});
	}
}
