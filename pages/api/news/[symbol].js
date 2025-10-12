import {getStocksDB} from '@lib/mysql/mysql.mjs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const {symbol} = req.query;
        const {limit = 20} = req.query;

        if (!symbol) {
            return res.status(400).json({error: 'Symbol parameter is required'});
        }

        const db = getStocksDB();
        const stocksTable = db.getTable('stocks');
        const newsTable = db.getTable('stock_news');

        // Get stock info
        const stock = await stocksTable.selectOne({symbol: symbol.toUpperCase()});
        if (!stock) {
            return res.status(404).json({error: `Stock ${symbol} not found`});
        }

        // Fetch news from database
        const newsItems = await newsTable.select(
            {stock_id: stock.id},
            {orderBy: 'published_date', order: 'DESC', size: parseInt(limit)}
        );

        // Transform to API format
        const formattedNews = newsItems.map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            url: item.url,
            source: item.source,
            publishedAt: item.published_date,
            sentiment: item.sentiment || 'neutral'
        }));

        return res.status(200).json({
            success: true,
            news: formattedNews,
            count: formattedNews.length
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch news'
        });
    }
}
