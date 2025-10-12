import {runTest} from '../bootstrap.mjs';
import {addStock, getStockBySymbol} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing addStock ===\n');

	// Generate a unique test symbol to avoid duplicates
	const testSymbol = `TEST${Date.now().toString().slice(-6)}`;

	console.log(`Test: Adding a new test stock (${testSymbol})`);
	const newStockData = {
		symbol: testSymbol,
		name: 'Test Stock Inc.',
		exchange: 'NASDAQ',
		sector: 'Technology',
		industry: 'Software',
		description: 'A test stock for unit testing',
		status: 'watching'
	};

	try {
		const insertResult = await addStock(newStockData);
		console.log('Insert result:', insertResult);
		console.log('✓ Stock inserted successfully');

		// Verify the stock was inserted
		console.log('\nVerifying stock was inserted...');
		const verifyStock = await getStockBySymbol(testSymbol);
		if (verifyStock) {
			console.log('✓ Stock verified in database:');
			console.table([verifyStock], ['id', 'symbol', 'name', 'status', 'exchange']);

			return {
				success: true,
				stockId: verifyStock.id,
				symbol: verifyStock.symbol,
				message: 'Stock added and verified successfully'
			};
		} else {
			console.log('✗ Stock not found after insert');
			return {success: false, message: 'Stock insert verification failed'};
		}
	} catch (error) {
		console.error('Error adding stock:', error.message);
		return {success: false, error: error.message};
	}
});
