import {runTest} from '../bootstrap.mjs';
import {getStocksDB} from '../../lib/mysql/mysql.mjs';

runTest(async () => {
	console.log('\n=== Testing MysqlTable Methods ===\n');

	const db = getStocksDB();
	const stocksTable = db.getTable('stocks');

	// Test 1: Select with no conditions
	console.log('Test 1: Select all stocks (limit 5)');
	const allStocks = await stocksTable.select({}, {size: 5});
	console.log(`Found ${allStocks.length} stocks`);
	if (allStocks.length > 0) {
		console.table(allStocks, ['id', 'symbol', 'name', 'status']);
	}

	// Test 2: Select with WHERE condition
	console.log('\nTest 2: Select stocks with status "watching"');
	const watchingStocks = await stocksTable.select({status: 'watching'}, {size: 5});
	console.log(`Found ${watchingStocks.length} watching stocks`);
	if (watchingStocks.length > 0) {
		console.table(watchingStocks, ['id', 'symbol', 'name', 'status']);
	}

	// Test 3: SelectOne
	console.log('\nTest 3: Select one stock by symbol (if exists)');
	if (allStocks.length > 0) {
		const firstSymbol = allStocks[0].symbol;
		const singleStock = await stocksTable.selectOne({symbol: firstSymbol});
		console.log(`Found stock with symbol ${firstSymbol}:`);
		console.table([singleStock], ['id', 'symbol', 'name', 'exchange', 'status']);
	} else {
		console.log('No stocks available to test selectOne');
	}

	// Test 4: Count
	console.log('\nTest 4: Count stocks');
	const totalCount = await stocksTable.count();
	console.log(`Total stocks in database: ${totalCount}`);

	const watchingCount = await stocksTable.count({status: 'watching'});
	console.log(`Stocks with status "watching": ${watchingCount}`);

	// Test 5: Insert and verify (using a unique test symbol)
	console.log('\nTest 5: Insert new test stock');
	const testSymbol = `TEST${Date.now().toString().slice(-6)}`;
	const insertData = {
		symbol: testSymbol,
		name: 'Test Table Stock',
		exchange: 'TEST',
		status: 'watching'
	};

	await stocksTable.insert(insertData);
	console.log(`✓ Inserted test stock: ${testSymbol}`);

	// Verify insert
	const verifyStock = await stocksTable.selectOne({symbol: testSymbol});
	console.log('Verified inserted stock:');
	console.table([verifyStock], ['id', 'symbol', 'name', 'exchange']);

	return {
		success: true,
		totalStocks: totalCount,
		watchingStocks: watchingCount,
		testStockInserted: testSymbol
	};
});
