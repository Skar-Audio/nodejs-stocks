import {runTest} from '../bootstrap.mjs';
import {getDeleteQuery} from '../../lib/mysql/query-builder.mjs';

runTest(async () => {
	console.log('\n=== Testing getDeleteQuery ===\n');

	// Test 1: Simple delete with single WHERE condition
	console.log('Test 1: Simple delete with single WHERE condition');
	const result1 = getDeleteQuery('stocks', {symbol: 'AAPL'});
	console.log('Query:', result1.query);
	console.log('Values:', result1.values);
	console.log('Expected: DELETE FROM stocks WHERE symbol = ?');

	// Test 2: Delete with multiple WHERE conditions
	console.log('\nTest 2: Delete with multiple WHERE conditions');
	const result2 = getDeleteQuery('stocks', {status: 'inactive', exchange: 'NASDAQ'});
	console.log('Query:', result2.query);
	console.log('Values:', result2.values);
	console.log('Expected: WHERE status = ? AND exchange = ?');

	// Test 3: Delete from watchlist by id
	console.log('\nTest 3: Delete from watchlist by id');
	const result3 = getDeleteQuery('watchlist', {id: 123});
	console.log('Query:', result3.query);
	console.log('Values:', result3.values);
	console.log('Expected: DELETE FROM watchlist WHERE id = ?');

	return {success: true, message: 'All delete query tests completed'};
});
