// PriceTracker.tsx
import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Đăng ký các thành phần cần thiết và plugin annotation
Chart.register(...registerables, annotationPlugin);

const PriceTracker = () => {
    const [price, setPrice] = useState<number | null>(null);
    const [priceData, setPriceData] = useState<number[]>([]);
    const [horizontalLine, setHorizontalLine] = useState<number | null>(null);
    const [timer, setTimer] = useState<number>(30);
    const [gameResult, setGameResult] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        let countdown: NodeJS.Timeout | null = null;

        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && horizontalLine !== null) {
            if (price !== null) {
                if (price < horizontalLine) {
                    setGameResult("Người chơi thua cuộc");
                } else {
                    setGameResult("Người chơi chiến thắng");
                }
            }
        }

        return () => {
            if (countdown) {
                clearInterval(countdown);
            }
        };
    }, [timer, horizontalLine, price]);

    const handleButtonClick = () => {
        if (price !== null) {
            setHorizontalLine(price);
            setTimer(30);
            setGameResult(null);
            setCurrentIndex(priceData.length); // Lưu vị trí của Current
        }
    };

    const data = {
        labels: priceData.map((_, index) => index + 1),
        datasets: [
            {
                label: 'BTCUSDT Price',
                data: priceData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            },
            {
                label: 'Horizontal Line',
                data: horizontalLine !== null ? Array(priceData.length).fill(horizontalLine) : [],
                borderColor: 'rgba(255,0,0,0.5)',
                borderDash: [5, 5],
                fill: false,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            annotation: {
                annotations: {
                    current: currentIndex !== null ? {
                        type: 'line',
                        xMin: currentIndex,
                        xMax: currentIndex,
                        borderColor: 'blue',
                        borderWidth: 2,
                        label: {
                            content: 'Current',
                            enabled: true,
                            position: 'top'
                        }
                    } : null,
                    end: timer === 0 && currentIndex !== null ? {
                        type: 'line',
                        xMin: priceData.length,
                        xMax: priceData.length,
                        borderColor: 'green',
                        borderWidth: 2,
                        label: {
                            content: 'End',
                            enabled: true,
                            position: 'top'
                        }
                    } : null,
                }
            }
        }
    };

    return (
        <div>
            <h1>Price Tracker</h1>
            {price ? <p>Price of BTCUSDT: {price}</p> : <p>Loading...</p>}
            <button onClick={handleButtonClick}>Show Price Line</button>
            <p>Thời gian còn lại: {timer} giây</p>
            {gameResult && <p>{gameResult}</p>}
            <Line data={data} options={options as any} />
        </div>
    );
};

export default PriceTracker;
