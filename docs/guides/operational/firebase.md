# Firebase: đăng ký và đăng nhập

**Firebase là gì?** Là dịch vụ của Google giúp đưa app của bạn lên mạng (hosting), lưu dữ liệu (database) và cho người dùng đăng nhập — bạn không phải tự quản lý máy chủ.

**Chi phí:**
- Gói **Spark** — miễn phí, đủ cho học và dự án nhỏ. **Không cần thẻ.**
- Gói **Blaze** — trả theo mức dùng, **cần thẻ**. Chỉ nâng cấp khi Claude giải thích rõ lý do và bạn đồng ý.

## Phần 1 — Tài khoản (làm 1 lần)

1. Bạn cần một **tài khoản Google** (Gmail). Chưa có thì tạo tại https://accounts.google.com/signup
2. Mở **https://console.firebase.google.com** và đăng nhập bằng tài khoản Google đó.
3. Lần đầu vào, đồng ý điều khoản nếu được hỏi.

Đến đây là xong phần tài khoản. **Chưa cần tạo project** — Claude sẽ hướng dẫn khi bắt đầu dự án đầu tiên.

## Phần 2 — Cho máy tính đăng nhập Firebase (làm 1 lần)

Claude sẽ nhờ bạn dán lệnh sau vào Terminal (xem [mo-terminal.md](mo-terminal.md)):

```
firebase login
```

1. Nếu được hỏi có cho phép thu thập thông tin không (`Allow Firebase to collect...`), gõ `n` hoặc `Y` tuỳ ý rồi `Enter`.
2. Trình duyệt tự mở ra → chọn **đúng tài khoản Google** ở Phần 1 → bấm **Allow / Cho phép**.
3. Thấy trang báo **"Firebase CLI Login Successful"** là xong.

Quay lại Claude, gõ **"xong"**.

## Phần 3 — Tạo project (làm khi bắt đầu mỗi dự án)

1. Vào https://console.firebase.google.com → **Create a project / Tạo dự án**.
2. Đặt tên dự án (không dấu), ví dụ `app-dat-lich`.
3. Google Analytics: có thể **tắt** cho đơn giản.
4. Đợi tạo xong → **Continue**.

## Lưu ý an toàn

- Nếu Firebase hỏi **thêm thẻ / nâng cấp Blaze** mà bạn không chủ động yêu cầu → **dừng lại và hỏi Claude trước**.
- Không dán các khoá bí mật (service account, private key) vào chat.
