# Khung dự án: mobile Expo + Firebase

Bộ khung code cho kiến trúc [`docs/architectures/mobile-expo-firebase`](../../../docs/architectures/mobile-expo-firebase/).
Skill `tao-khung-du-an` copy thư mục này (trừ file README này) để tạo dự án mới.

Có sẵn: 4 lớp (domain/services dùng chung cách viết với khung web), Expo Router, Firebase JS SDK (chạy trong Expo Go, giữ phiên đăng nhập bằng AsyncStorage), ESLint chặn import sai lớp, `npm run check`, cấu hình `config/dev.env` / `config/production.env`, `eas.json`, và lệnh `start` / `build` / `deploy` có xác nhận.

Thử khung (cần Node 20+, Java 21+, app Expo Go trên điện thoại):

```bash
npm install
npm run check
npm start                         # dev: quét QR bằng Expo Go
npm run build                     # đóng gói thử trên máy
npm run deploy -- --thu           # xem trước các lệnh phát hành (không chạy thật)
```
