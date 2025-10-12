import {useEffect, useRef, useState} from 'react';

/**
 * Hook to consume SSE stream for real-time stock price updates
 * @param {string[]} symbols - Array of stock symbols to watch
 * @param {boolean} enabled - Whether streaming is enabled
 * @returns {Object} - {priceData, isConnected, error}
 */
export function useStockStream(symbols, enabled = true) {
    const [priceData, setPriceData] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!enabled || !symbols || symbols.length === 0) {
            return;
        }

        const symbolsParam = symbols.join(',');
        const eventSource = new EventSource(`/api/stream/price?symbols=${symbolsParam}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'connected') {
                    console.log('SSE connected:', data.timestamp);
                } else if (data.type === 'price_update') {
                    setPriceData((prev) => ({
                        ...prev,
                        [data.symbol]: {
                            price: data.price,
                            open: data.open,
                            high: data.high,
                            low: data.low,
                            volume: data.volume,
                            change: data.change,
                            changePercent: data.changePercent,
                            timestamp: data.timestamp,
                            date: data.date
                        }
                    }));
                } else if (data.type === 'error') {
                    setError(data.message);
                }
            } catch (err) {
                console.error('Error parsing SSE data:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE error:', err);
            setIsConnected(false);
            setError('Connection lost');
            eventSource.close();
        };

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [symbols, enabled]);

    return {priceData, isConnected, error};
}
