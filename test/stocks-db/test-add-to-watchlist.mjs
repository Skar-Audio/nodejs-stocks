import {runTest} from '../bootstrap.mjs';
import {
	addStock,
	getStockBySymbol,
	addToWatchlist,
	getWatchlist
} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing addToWatchlist ===\n');

	// First, ensure we have a test stock
	const testSymbol = `TEST${Date.now().toString().slice(-6)}`;
	console.log(`Creating test stock (${testSymbol})...`);

	try {
		await addStock({
			symbol: testSymbol,
			name: 'Test Watchlist Stock',
			exchange: 'NASDAQ',
			status: 'watching'
		});
		console.log('✓ Test stock created');

		const stock = await getStockBySymbol(testSymbol);
		if (!stock) {
			throw new Error('Test stock not found after creation');
		}

		// Add to watchlist
		console.log('\nAdding stock to watchlist...');
		const watchlistData = {
			notes: 'Test watchlist entry',
			alertHigh: 150.0,
			alertLow: 100.0,
			priority: 2
		};

		const result = await addToWatchlist(stock.id, watchlistData);
		console.log('Add to watchlist result:', result);
		console.log('✓ Stock added to watchlist');

		// Verify it's in the watchlist
		console.log('\nVerifying stock is in watchlist...');
		const watchlist = await getWatchlist();
		const foundInWatchlist = watchlist.find((item) => item.symbol === testSymbol.toUpperCase());

		if (foundInWatchlist) {
			console.log('✓ Stock found in watchlist:');
			console.table(
				[foundInWatchlist],
				['symbol', 'name', 'user_notes', 'price_alert_high', 'price_alert_low', 'priority']
			);

			return {
				success: true,
				watchlistItem: foundInWatchlist,
				message: 'Stock successfully added to watchlist and verified'
			};
		} else {
			console.log('✗ Stock not found in watchlist');
			return {success: false, message: 'Stock not found in watchlist after insert'};
		}
	} catch (error) {
		console.error('Error during test:', error.message);
		return {success: false, error: error.message};
	}
});
