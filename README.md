# Web3 Future Gamefi

Dự án này là một game để hỗ trợ người chơi tham gia vào game future. Người dùng đặt giá dự đoán trong thời gian 30s, nếu giá BTC trong thời gian đó tăng lên thì người dùng sẽ nhận được tiền dự đoán. Nếu giá BTC trong thời gian đó giảm xuống thì người dùng sẽ bị trừ tiền dự đoán.

## Cấu Trúc Dự Án


## Thành Phần

### Smart Contracts (/contracts)
- Được phát triển với Foundry framework
- Bao gồm FutureFund contract và các test
- Sử dụng forge-std cho testing
- Địa chỉ contract đã deploy trên ethereum
```bash
0xb48905423A8ECeD4b0324955a69350cFd12a6eD8
```
### Backend (/back)
- Node.js server
- Hỗ trợ WebSocket cho dữ liệu realtime
- Xử lý fetch dữ liệu real-time BTC - USDT
```bash
cd back
npm install
npm start
```

### Frontend (/front)
- React.js
- Sử dụng React Query cho fetch dữ liệu
- Sử dụng chart.js để dựng biểu đồ giá cho người dùng dễ thao tác
```bash
cd front
npm install
npm run dev
```
