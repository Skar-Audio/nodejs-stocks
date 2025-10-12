/**
 * Health status endpoint
 * Returns market status, data latency, and backend health
 */
export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({error: 'Method not allowed'});
	}

	try {
		// Mock data - replace with real checks
		const now = new Date();
		const hour = now.getUTCHours();
		const minute = now.getUTCMinutes();
		const day = now.getUTCDay();

		// US market hours: Monday-Friday, 9:30 AM - 4:00 PM ET (14:30 - 21:00 UTC)
		const isWeekday = day >= 1 && day <= 5;
		const isMarketHours =
			isWeekday && ((hour === 14 && minute >= 30) || (hour > 14 && hour < 21));

		// Simulate data latency (in production, measure actual API response times)
		const dataLatency = Math.floor(Math.random() * 500) + 100; // 100-600ms

		// Backend health check (in production, check database, APIs, etc.)
		const backend = 'ok'; // or 'degraded'

		return res.status(200).json({
			market: isMarketHours ? 'open' : 'closed',
			dataLatency,
			backend,
			timestamp: now.toISOString()
		});
	} catch (error) {
		console.error('Error in status API route:', error);
		return res.status(500).json({
			market: 'unknown',
			dataLatency: 0,
			backend: 'degraded',
			error: error.message
		});
	}
}
