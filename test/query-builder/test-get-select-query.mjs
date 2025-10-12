import {runTest} from '../bootstrap.mjs';
import {getSelectQuery} from '../../lib/mysql/query-builder.mjs';

runTest(async () => {
	console.log('\n=== Testing getSelectQuery ===\n');

	// Test 1: Simple select all
	console.log('Test 1: Simple select all');
	const result1 = getSelectQuery('stocks');
	console.log('Query:', result1.query);
	console.log('Values:', result1.values);
	console.log('Expected: SELECT * FROM stocks with no values');

	// Test 2: Select with WHERE clause
	console.log('\nTest 2: Select with WHERE clause');
	const result2 = getSelectQuery('stocks', {symbol: 'AAPL', status: 'watching'});
	console.log('Query:', result2.query);
	console.log('Values:', result2.values);
	console.log('Expected: symbol = ? AND status = ? with values [AAPL, watching]');

	// Test 3: Select with specific fields
	console.log('\nTest 3: Select with specific fields');
	const result3 = getSelectQuery(
		'stocks',
		{status: 'watching'},
		{
			fields: ['id', 'symbol', 'name']
		}
	);
	console.log('Query:', result3.query);
	console.log('Values:', result3.values);
	console.log('Expected: SELECT id, symbol, name FROM stocks WHERE status = ?');

	// Test 4: Select with ORDER BY
	console.log('\nTest 4: Select with ORDER BY');
	const result4 = getSelectQuery('stocks', {}, {orderBy: 'created_at', order: 'ASC'});
	console.log('Query:', result4.query);
	console.log('Values:', result4.values);
	console.log('Expected: ORDER BY created_at ASC');

	// Test 5: Select with LIMIT and OFFSET
	console.log('\nTest 5: Select with LIMIT and OFFSET');
	const result5 = getSelectQuery('stocks', {}, {size: 10, offset: 20});
	console.log('Query:', result5.query);
	console.log('Values:', result5.values);
	console.log('Expected: LIMIT ? OFFSET ? with values [10, 20]');

	// Test 6: Complex query with all options
	console.log('\nTest 6: Complex query with all options');
	const result6 = getSelectQuery(
		'stocks',
		{status: 'watching'},
		{
			fields: ['symbol', 'name', 'price'],
			orderBy: 'symbol',
			order: 'DESC',
			size: 5,
			offset: 10
		}
	);
	console.log('Query:', result6.query);
	console.log('Values:', result6.values);
	console.log('Expected: Full query with WHERE, ORDER BY, LIMIT, OFFSET');

	return {success: true, message: 'All query builder tests completed'};
});
