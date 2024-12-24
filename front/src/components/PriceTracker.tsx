// PriceTracker.tsx
import React, { useEffect, useState } from 'react';

const PriceTracker = () => {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

        ws.onopen = () => {
            console.log('Connected to Binance WebSocket');
        };

        ws.onmessage = (event) => {
            const prices = JSON.parse(event.data);
            prices.forEach((ticker: { s: string; c: React.SetStateAction<null>; }) => {
                if (ticker.s === 'BTCUSDT') {
                    setPrice(ticker.c);
                }
            });
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Cleanup on component unmount
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>Price Tracker</h1>
            {price ? <p>Price of BTCUSDT: {price}</p> : <p>Loading...</p>}
        </div>
    );
};

export default PriceTracker;
