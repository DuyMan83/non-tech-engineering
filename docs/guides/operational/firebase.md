# Firebase: đăng ký và đăng nhập

**Firebase là gì?** Là dịch vụ của Google giúp đưa app của bạn lên mạng (hosting), lưu dữ liệu (database) và cho người dùng đăng nhập — bạn không phải tự quản lý máy chủ.

**Chi phí:**
- Gói **Spark** — miễn phí, đủ cho học và dự án nhỏ. **Không cần thẻ.**
- Gói **Blaze** — trả theo mức dùng, **cần thẻ**. Chỉ nâng cấp khi Claude giải thích rõ lý do và bạn đồng ý.

## Phần 1 — Tài khoản (làm 1 lần)

1. Bạn cần một **tài khoản Google** (Gmail). Chưa có thì tạo tại https://accounts.google.com/signup
2. Mở **https://console.firebase.google.com** và đăng nhập bằng tài khoản Google đó — *Firebase dùng tài khoản Google, không cần đăng ký riêng*.
3. Lần đầu vào, đồng ý điều khoản nếu được hỏi — *bắt buộc để dùng Firebase*.

Đến đây là xong phần tài khoản. **Chưa cần tạo project** — Claude sẽ hướng dẫn khi bắt đầu dự án đầu tiên.

## Phần 2 — Cho máy tính đăng nhập Firebase (làm 1 lần)

*Để máy tính của bạn được phép đưa app lên Firebase của bạn.* Claude sẽ nhờ bạn dán lệnh sau vào Terminal (Claude không tự chạy được vì lệnh cần bạn trả lời và bấm trên trình duyệt). Dễ nhất là dùng Terminal **ngay trong VS Code**: menu **Terminal → New Terminal** (hoặc xem [mo-terminal.md](mo-terminal.md)).

**macOS:**
```
npx -y firebase-tools@latest login
```
**Windows:**
```
npx.cmd -y firebase-tools@latest login
```

Lần đầu chạy sẽ mất khoảng 1 phút để tải công cụ Firebase — cứ đợi.

1. Nếu được hỏi có cho phép thu thập thông tin không (`Allow Firebase to collect...`), gõ `n` hoặc `Y` tuỳ ý rồi `Enter` — *chỉ là gửi thống kê sử dụng cho Google, không ảnh hưởng gì*.
2. Trình duyệt tự mở ra → chọn **đúng tài khoản Google** ở Phần 1 → bấm **Allow / Cho phép** — *để công cụ Firebase trên máy dùng được tài khoản này*.
3. Thấy trang báo **"Firebase CLI Login Successful"** là xong.

Quay lại Claude, gõ **"xong"**.

## Phần 3 — Tạo project (làm khi bắt đầu mỗi dự án)

*Mỗi app cần một project riêng — là "ngôi nhà" chứa trang web, dữ liệu và người dùng của app đó.*

1. Vào https://console.firebase.google.com → **Create a project / Tạo dự án**.
2. Đặt tên dự án (không dấu), ví dụ `app-dat-lich` — *tên này sẽ nằm trong địa chỉ web của app*.
3. Google Analytics: có thể **tắt** — *đây là công cụ thống kê lượt truy cập, chưa cần lúc đầu*.
4. Đợi tạo xong → **Continue**.

## Phần 4 — Chuẩn bị đưa app lên mạng lần đầu (làm 1 lần cho mỗi dự án)

*Để app có nơi lưu dữ liệu thật và cho người dùng thật đăng nhập.* Claude làm phần lớn bằng lệnh; bạn chỉ làm những bước dưới đây khi Claude nhờ.

**Chọn nơi đặt dữ liệu** — Claude sẽ hỏi bạn trước. *Chọn một lần, sau này không đổi được.* Người dùng ở Việt Nam → chọn **Singapore (asia-southeast1)** để app nhanh.

**Bật đăng nhập** — *để người dùng của app đăng nhập được.*
1. Vào https://console.firebase.google.com → chọn dự án của bạn.
2. Menu trái **Build → Authentication** → **Get started**.
3. Tab **Sign-in method** → chọn **Anonymous** → bật **Enable** → **Save**.

## Phần 5 — Lùi về bản trước (khi bản mới có vấn đề)

*Để app trên mạng quay lại bản trước ngay, không cần chờ sửa.* Thường Claude làm giúp; bạn cũng tự làm được:
1. Vào https://console.firebase.google.com → chọn dự án → **Build → Hosting**.
2. Kéo xuống **Release history** — mỗi dòng là một lần đưa lên.
3. Ở dòng của bản trước, bấm **⋮** → **Rollback** → xác nhận.

Lưu ý: cách này chỉ đưa **trang web** về bản trước. **Dữ liệu** và **luật bảo mật** giữ nguyên — nếu bản mới có đổi luật, báo Claude để lùi cả luật.

## Lưu ý an toàn

- Nếu Firebase hỏi **thêm thẻ / nâng cấp Blaze** mà bạn không chủ động yêu cầu → **dừng lại và hỏi Claude trước**.
- Không dán các khoá bí mật (service account, private key) vào chat.
