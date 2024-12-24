const WebSocket = require('ws');

// Kết nối đến WebSocket Binance
const ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');

// Sự kiện khi WebSocket kết nối thành công
ws.on('open', () => {
  console.log('Connected to Binance WebSocket');
});

// Xử lý dữ liệu nhận được từ Binance
ws.on('message', (data) => {
  console.log('Received data:', data);
});

// Xử lý ping/pong
ws.on('ping', () => {
  ws.pong(); // Trả lời pong ngay khi nhận được ping
  console.log('Ping received, Pong sent');
});

// Xử lý lỗi
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Xử lý ngắt kết nối
ws.on('close', () => {
  console.log('WebSocket connection closed');
});
