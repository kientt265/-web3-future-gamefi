// priceTracker.js

const WebSocket = require('ws');

// Địa chỉ WebSocket của Binance
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

// Khi kết nối thành công
ws.on('open', () => {
    console.log('Connected to Binance WebSocket');
});

// Khi nhận được dữ liệu
ws.on('message', (data) => {
    const prices = JSON.parse(data);
    prices.forEach((ticker) => {
        // Lọc ra giá của đồng coin bạn muốn
        if (ticker.s === 'BTCUSDT') { // Thay 'BTCUSDT' bằng đồng coin bạn muốn
            console.log(`Price of ${ticker.s}: ${ticker.c}`);
        }
    });
});

// Khi có lỗi xảy ra
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// Khi kết nối bị đóng
ws.on('close', () => {
    console.log('WebSocket connection closed');
});