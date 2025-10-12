import {runTest} from '../bootstrap.mjs';
import {getInsertUpdateQuery} from '../../lib/mysql/query-builder.mjs';

runTest(async () => {
	console.log('\n=== Testing getInsertUpdateQuery (Upsert) ===\n');

	// Test 1: Basic upsert
	console.log('Test 1: Basic upsert');
	const result1 = getInsertUpdateQuery('stocks', {
		symbol: 'AAPL',
		name: 'Apple Inc.',
		status: 'watching'
	});
	console.log('Query:', result1.query);
	console.log('Values:', result1.values);
	console.log('Expected: INSERT INTO stocks ... ON DUPLICATE KEY UPDATE ...');

	// Test 2: Upsert with insertPlus (fields only for insert)
	console.log('\nTest 2: Upsert with insertPlus');
	const result2 = getInsertUpdateQuery(
		'stocks',
		{symbol: 'TSLA', name: 'Tesla Inc.'},
		{}, // updatePlus
		{created_at: new Date().toISOString()} // insertPlus
	);
	console.log('Query:', result2.query);
	console.log('Values:', result2.values);
	console.log('Expected: created_at only in INSERT, not in UPDATE');

	// Test 3: Upsert with updatePlus (fields only for update)
	console.log('\nTest 3: Upsert with updatePlus');
	const result3 = getInsertUpdateQuery(
		'stocks',
		{symbol: 'MSFT', name: 'Microsoft'},
		{updated_at: new Date().toISOString()}, // updatePlus
		{} // insertPlus
	);
	console.log('Query:', result3.query);
	console.log('Values:', result3.values);
	console.log('Expected: updated_at only in UPDATE, not in INSERT');

	// Test 4: Upsert with both insertPlus and updatePlus
	console.log('\nTest 4: Upsert with both insertPlus and updatePlus');
	const now = new Date().toISOString();
	const result4 = getInsertUpdateQuery(
		'stocks',
		{symbol: 'GOOGL', name: 'Alphabet Inc.', status: 'watching'},
		{updated_at: now}, // updatePlus
		{created_at: now} // insertPlus
	);
	console.log('Query:', result4.query);
	console.log('Values:', result4.values);
	console.log('Expected: created_at in INSERT, updated_at in UPDATE');

	return {success: true, message: 'All upsert query tests completed'};
});
