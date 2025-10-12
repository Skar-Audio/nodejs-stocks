import {getStocksDB} from '../mysql/mysql.mjs';

/**
 * Database functions for stocks
 */

export async function getAllStocks(options = {}) {
	const db = getStocksDB();
	const stocksTable = db.getTable('stocks');
	const {status, limit = 100} = options;

	const where = status ? {status} : {};
	const selectOptions = {orderBy: 'updated_at', order: 'DESC', size: limit};

	return await stocksTable.select(where, selectOptions);
}

export async function getStockBySymbol(symbol) {
	const db = getStocksDB();
	const stocksTable = db.getTable('stocks');

	return await stocksTable.selectOne({symbol: symbol.toUpperCase()});
}

export async function addStock(stockData) {
	const db = getStocksDB();
	const stocksTable = db.getTable('stocks');

	return await stocksTable.insert({
		symbol: stockData.symbol.toUpperCase(),
		name: stockData.name,
		exchange: stockData.exchange,
		sector: stockData.sector,
		industry: stockData.industry,
		description: stockData.description,
		status: stockData.status || 'watching'
	});
}

export async function updateStock(symbol, updateData) {
	const db = getStocksDB();
	const stocksTable = db.getTable('stocks');

	return await stocksTable.update(updateData, {symbol: symbol.toUpperCase()});
}

export async function getWatchlist() {
	const db = getStocksDB();

	const query = `
        SELECT w.id as watchlist_id,
               w.user_notes,
               w.price_alert_high,
               w.price_alert_low,
               w.priority,
               w.added_at,
               s.*
        FROM watchlist w
                 JOIN stocks s ON w.stock_id = s.id
        ORDER BY w.priority ASC, w.added_at DESC
    `;

	return await db.query(query);
}

export async function addToWatchlist(stockId, watchlistData = {}) {
	const db = getStocksDB();
	const watchlistTable = db.getTable('watchlist');

	return await watchlistTable.insert({
		stock_id: stockId,
		user_notes: watchlistData.notes || null,
		price_alert_high: watchlistData.alertHigh || null,
		price_alert_low: watchlistData.alertLow || null,
		priority: watchlistData.priority || 3
	});
}

export async function getStockAnalyses(stockId, limit = 10) {
	const db = getStocksDB();
	const analysisTable = db.getTable('stock_analysis');

	return await analysisTable.select(
		{stock_id: stockId},
		{orderBy: 'created_at', order: 'DESC', size: limit}
	);
}

export async function saveStockAnalysis(analysisData) {
	const db = getStocksDB();
	const analysisTable = db.getTable('stock_analysis');

	return await analysisTable.insert(analysisData);
}

export async function getStockPredictions(stockId, limit = 10) {
	const db = getStocksDB();
	const predictionsTable = db.getTable('stock_predictions');

	return await predictionsTable.select(
		{stock_id: stockId},
		{orderBy: 'prediction_date', order: 'DESC', size: limit}
	);
}

export async function saveStockPrediction(predictionData) {
	const db = getStocksDB();
	const predictionsTable = db.getTable('stock_predictions');

	return await predictionsTable.insert(predictionData);
}

export async function getRecentPrices(stockId, days = 30) {
	const db = getStocksDB();
	const pricesTable = db.getTable('stock_prices');

	return await pricesTable.select(
		{stock_id: stockId},
		{orderBy: 'date', order: 'DESC', size: days}
	);
}

export async function saveStockPrice(priceData) {
	const db = getStocksDB();
	const pricesTable = db.getTable('stock_prices');

	return await pricesTable.insertUpdate(priceData);
}
