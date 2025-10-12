import {getStocksDB} from '@lib/mysql/mysql.mjs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {symbols} = req.query;

    if (!symbols) {
        return res.status(400).json({error: 'Symbols parameter is required'});
    }

    // Parse symbols (comma-separated)
    const symbolList = symbols.split(',').map((s) => s.trim().toUpperCase());

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Send initial connection event
    res.write('data: {"type":"connected","timestamp":"' + new Date().toISOString() + '"}\n\n');

    const db = getStocksDB();
    const stocksTable = db.getTable('stocks');
    const pricesTable = db.getTable('stock_prices');

    // Stream price updates at regular intervals
    const intervalId = setInterval(async () => {
        try {
            for (const symbol of symbolList) {
                // Get stock info
                const stock = await stocksTable.selectOne({symbol});
                if (!stock) continue;

                // Get latest price
                const latestPrice = await pricesTable.selectOne(
                    {stock_id: stock.id},
                    {orderBy: 'price_date', order: 'DESC'}
                );

                if (!latestPrice) continue;

                // Calculate change
                const currentPrice = parseFloat(latestPrice.close_price);
                const openPrice = parseFloat(latestPrice.open_price);
                const change = currentPrice - openPrice;
                const changePercent = ((change / openPrice) * 100).toFixed(2);

                // Send price update
                const update = {
                    type: 'price_update',
                    symbol: stock.symbol,
                    price: currentPrice,
                    open: openPrice,
                    high: parseFloat(latestPrice.high_price),
                    low: parseFloat(latestPrice.low_price),
                    volume: latestPrice.volume,
                    change: parseFloat(change.toFixed(2)),
                    changePercent: parseFloat(changePercent),
                    timestamp: new Date().toISOString(),
                    date: latestPrice.price_date
                };

                res.write(`data: ${JSON.stringify(update)}\n\n`);
            }
        } catch (error) {
            console.error('Error streaming price data:', error);
            res.write(
                `data: ${JSON.stringify({type: 'error', message: 'Error fetching price data'})}\n\n`
            );
        }
    }, 5000); // Update every 5 seconds

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}
