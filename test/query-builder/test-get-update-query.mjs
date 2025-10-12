import {runTest} from '../bootstrap.mjs';
import {getUpdateQuery} from '../../lib/mysql/query-builder.mjs';

runTest(async () => {
	console.log('\n=== Testing getUpdateQuery ===\n');

	// Test 1: Simple update
	console.log('Test 1: Simple update');
	const result1 = getUpdateQuery(
		'stocks',
		{name: 'Apple Inc.', status: 'active'},
		{
			symbol: 'AAPL'
		}
	);
	console.log('Query:', result1.query);
	console.log('Values:', result1.values);
	console.log('Expected: UPDATE stocks SET name = ?, status = ? WHERE symbol = ?');
	console.log('Expected values: [Apple Inc., active, AAPL]');

	// Test 2: Update with multiple WHERE conditions
	console.log('\nTest 2: Update with multiple WHERE conditions');
	const result2 = getUpdateQuery(
		'stocks',
		{status: 'inactive'},
		{symbol: 'AAPL', exchange: 'NASDAQ'}
	);
	console.log('Query:', result2.query);
	console.log('Values:', result2.values);
	console.log('Expected: WHERE symbol = ? AND exchange = ?');

	// Test 3: Update multiple fields
	console.log('\nTest 3: Update multiple fields');
	const result3 = getUpdateQuery(
		'stocks',
		{
			name: 'Tesla Motors Inc.',
			sector: 'Consumer Cyclical',
			industry: 'Auto Manufacturers',
			description: 'Updated description'
		},
		{symbol: 'TSLA'}
	);
	console.log('Query:', result3.query);
	console.log('Values:', result3.values);
	console.log('Expected: Multiple SET clauses with single WHERE condition');

	return {success: true, message: 'All update query tests completed'};
});
