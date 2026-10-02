# Khung dự án: web Next.js + Firebase

Bộ khung code cho kiến trúc [`docs/architectures/web-nextjs-firebase`](../../../docs/architectures/web-nextjs-firebase/).
Skill `tao-khung-du-an` copy thư mục này (trừ file README này) để tạo dự án mới.

Có sẵn: 4 lớp, ESLint chặn import sai lớp, `npm run check`, tính năng mẫu "việc cần làm" (đăng nhập ẩn danh) có test cho domain, services và luật Firestore.

Thử khung (cần Node 20+ và Java 21+):

```bash
npm install
npm run check
npm start                 # dev, bộ giả lập — http://localhost:3000
npm run build production  # cần điền config/production.env trước
npm run deploy            # production, hỏi xác nhận trước khi ghi đè
```
