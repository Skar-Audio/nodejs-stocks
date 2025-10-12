import {runTest} from '../bootstrap.mjs';
import {getStocksDB} from '../../lib/mysql/mysql.mjs';

runTest(async () => {
	console.log('\n=== Testing MySQL Connector ===\n');

	// Test 1: Get database connection
	console.log('Test 1: Get database connection');
	const db = getStocksDB();
	console.log('✓ Database connection obtained');
	console.log('Database name:', db.databaseName);
	console.log('Connection alive:', db.alive);

	// Test 2: Execute simple query
	console.log('\nTest 2: Execute simple query (SELECT 1)');
	const result1 = await db.query('SELECT 1 as test');
	console.log('Query result:', result1);
	console.log('✓ Simple query executed successfully');

	// Test 3: Get table information
	console.log('\nTest 3: Get stocks table fields');
	const fields = await db.getTableFields('stocks');
	console.log('Stocks table fields:');
	console.table(fields, ['Field', 'Type', 'Null', 'Key', 'Default']);

	// Test 4: Test getTable method
	console.log('\nTest 4: Test getTable method');
	const stocksTable = db.getTable('stocks');
	console.log('✓ Table instance created');
	console.log('Table name:', stocksTable.tableName);

	// Test 5: Test query with parameters
	console.log('\nTest 5: Test parameterized query');
	const result2 = await db.query('SELECT COUNT(*) as count FROM stocks WHERE status = ?', [
		'watching'
	]);
	console.log('Stocks with status "watching":', result2[0].count);

	return {
		success: true,
		databaseName: db.databaseName,
		connectionAlive: db.alive,
		stocksCount: result2[0].count
	};
});
