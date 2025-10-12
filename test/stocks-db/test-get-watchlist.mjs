import {runTest} from '../bootstrap.mjs';
import {getWatchlist} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing getWatchlist ===\n');

	console.log('Fetching watchlist...');
	const watchlist = await getWatchlist();

	console.log(`\nFound ${watchlist.length} items in watchlist`);

	if (watchlist.length > 0) {
		console.log('\nWatchlist items:');
		console.table(watchlist.slice(0, 10), [
			'watchlist_id',
			'symbol',
			'name',
			'priority',
			'price_alert_high',
			'price_alert_low',
			'user_notes'
		]);
	} else {
		console.log('Watchlist is empty. Consider adding items to test this functionality.');
	}

	return {
		success: true,
		watchlistCount: watchlist.length,
		sampleData: watchlist.slice(0, 3)
	};
});
