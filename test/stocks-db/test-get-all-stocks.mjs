import {runTest} from '../bootstrap.mjs';
import {getAllStocks} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing getAllStocks ===\n');

	// Test 1: Get all stocks with default options
	console.log('Test 1: Get all stocks with default options (limit 100)');
	const result1 = await getAllStocks();
	console.log(`Found ${result1.length} stocks`);
	console.table(result1.slice(0, 5), ['id', 'symbol', 'name', 'status', 'exchange']);

	// Test 2: Get stocks with specific status
	console.log('\nTest 2: Get stocks with status "watching"');
	const result2 = await getAllStocks({status: 'watching'});
	console.log(`Found ${result2.length} stocks with status "watching"`);
	if (result2.length > 0) {
		console.table(result2.slice(0, 5), ['id', 'symbol', 'name', 'status']);
	}

	// Test 3: Get limited number of stocks
	console.log('\nTest 3: Get only 5 stocks');
	const result3 = await getAllStocks({limit: 5});
	console.log(`Found ${result3.length} stocks (should be 5 or less)`);
	console.table(result3, ['id', 'symbol', 'name', 'status']);

	return {
		success: true,
		totalStocks: result1.length,
		watchingStocks: result2.length
	};
});
