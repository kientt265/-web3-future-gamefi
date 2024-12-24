// PriceTracker.tsx
import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

// Đăng ký tất cả các thành phần cần thiết
Chart.register(...registerables);

const PriceTracker = () => {
    
    const [price, setPrice] = useState<number | null>(null);
    const [priceData, setPriceData] = useState<number[]>([]);

    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

        ws.onopen = () => {
            console.log('Connected to Binance WebSocket');
        };

        ws.onmessage = (event) => {
            const prices = JSON.parse(event.data);
            prices.forEach((ticker: { s: string; c: string; }) => {
                if (ticker.s === 'BTCUSDT') {
                    setPrice(parseFloat(ticker.c));
                    setPriceData(prevData => [...prevData, parseFloat(ticker.c)]);
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

    // Dữ liệu cho biểu đồ
    const data = {
        labels: priceData.map((_, index) => index + 1),
        datasets: [
            {
                label: 'BTCUSDT Price',
                data: priceData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <h1>Price Tracker</h1>
            {price ? <p>Price of BTCUSDT: {price}</p> : <p>Loading...</p>}
            <Line data={data} />
        </div>
    );
};

export default PriceTracker;
