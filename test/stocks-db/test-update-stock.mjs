import {runTest} from '../bootstrap.mjs';
import {addStock, updateStock, getStockBySymbol} from '../../lib/stocks/stocks-db.mjs';

runTest(async () => {
	console.log('\n=== Testing updateStock ===\n');

	// First, add a test stock
	const testSymbol = `TEST${Date.now().toString().slice(-6)}`;
	console.log(`Test: Creating test stock (${testSymbol}) to update`);

	const newStockData = {
		symbol: testSymbol,
		name: 'Original Name',
		exchange: 'NASDAQ',
		sector: 'Technology',
		status: 'watching'
	};

	try {
		await addStock(newStockData);
		console.log('✓ Test stock created');

		// Now update it
		console.log('\nUpdating stock...');
		const updateData = {
			name: 'Updated Name Inc.',
			sector: 'Consumer Goods',
			status: 'active'
		};

		const updateResult = await updateStock(testSymbol, updateData);
		console.log('Update result:', updateResult);
		console.log('✓ Stock updated successfully');

		// Verify the update
		console.log('\nVerifying updates...');
		const updatedStock = await getStockBySymbol(testSymbol);
		if (updatedStock) {
			console.log('✓ Stock verified in database:');
			console.table([updatedStock], ['symbol', 'name', 'sector', 'status']);

			// Check if updates were applied
			const nameUpdated = updatedStock.name === 'Updated Name Inc.';
			const sectorUpdated = updatedStock.sector === 'Consumer Goods';
			const statusUpdated = updatedStock.status === 'active';

			console.log('\nVerification:');
			console.log(`  Name updated: ${nameUpdated ? '✓' : '✗'}`);
			console.log(`  Sector updated: ${sectorUpdated ? '✓' : '✗'}`);
			console.log(`  Status updated: ${statusUpdated ? '✓' : '✗'}`);

			return {
				success: nameUpdated && sectorUpdated && statusUpdated,
				updatedStock,
				message: 'Stock updated and verified successfully'
			};
		} else {
			return {success: false, message: 'Stock not found after update'};
		}
	} catch (error) {
		console.error('Error during test:', error.message);
		return {success: false, error: error.message};
	}
});
