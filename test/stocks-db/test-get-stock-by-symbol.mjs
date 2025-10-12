import {runTest} from '../bootstrap.mjs';
import {getStockBySymbol} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing getStockBySymbol ===\n');

	// Test 1: Get a common stock (change to a symbol that exists in your DB)
	console.log('Test 1: Get stock by symbol (AAPL)');
	const result1 = await getStockBySymbol('AAPL');
	if (result1) {
		console.log('Found stock:');
		console.table([result1], ['id', 'symbol', 'name', 'exchange', 'sector', 'status']);
	} else {
		console.log('Stock not found (AAPL might not be in your database yet)');
	}

	// Test 2: Test lowercase input (should convert to uppercase)
	console.log('\nTest 2: Get stock with lowercase symbol (tsla)');
	const result2 = await getStockBySymbol('tsla');
	if (result2) {
		console.log('Found stock (uppercase conversion works):');
		console.table([result2], ['id', 'symbol', 'name', 'exchange']);
	} else {
		console.log('Stock not found (TSLA might not be in your database yet)');
	}

	// Test 3: Try to get non-existent stock
	console.log('\nTest 3: Try to get non-existent stock (FAKESYMBOL)');
	const result3 = await getStockBySymbol('FAKESYMBOL');
	console.log('Result:', result3 === null ? 'null (as expected)' : 'found unexpectedly');

	return {
		success: true,
		aaplFound: !!result1,
		tslaFound: !!result2,
		fakeNotFound: result3 === null
	};
});
