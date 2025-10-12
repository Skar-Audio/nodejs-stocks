import {runTest} from '../bootstrap.mjs';
import {getInsertQuery} from '../../lib/mysql/query-builder.mjs';

runTest(async () => {
	console.log('\n=== Testing getInsertQuery ===\n');

	// Test 1: Simple insert
	console.log('Test 1: Simple insert');
	const result1 = getInsertQuery('stocks', {
		symbol: 'AAPL',
		name: 'Apple Inc.',
		exchange: 'NASDAQ'
	});
	console.log('Query:', result1.query);
	console.log('Values:', result1.values);
	console.log('Expected: INSERT INTO stocks (symbol, name, exchange) VALUES (?, ?, ?)');

	// Test 2: Insert with all stock fields
	console.log('\nTest 2: Insert with all stock fields');
	const result2 = getInsertQuery('stocks', {
		symbol: 'TSLA',
		name: 'Tesla Inc.',
		exchange: 'NASDAQ',
		sector: 'Technology',
		industry: 'Auto Manufacturers',
		description: 'Electric vehicle and clean energy company',
		status: 'watching'
	});
	console.log('Query:', result2.query);
	console.log('Values:', result2.values);
	console.log('Expected: All fields with corresponding placeholders');

	return {success: true, message: 'All insert query tests completed'};
});
