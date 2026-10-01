# Đăng nhập GitHub trên máy

**Để làm gì?** Cho máy tính của bạn quyền lưu code lên GitHub. Chỉ làm **một lần** — sau đó mỗi lần lưu code không phải gõ mật khẩu nữa.

Bạn sẽ đăng nhập **qua trình duyệt**, không gõ mật khẩu vào Terminal hay vào chat.

## Các bước

1. Claude sẽ đưa bạn lệnh dưới đây. Dán vào Terminal (xem [mo-terminal.md](mo-terminal.md)) rồi nhấn `Enter`:
   ```
   gh auth login --hostname github.com --git-protocol https --web
   ```
2. Nếu được hỏi **"Authenticate Git with your GitHub credentials?"** → nhấn `Enter` (chọn **Yes**).
3. Terminal hiện ra một **mã gồm 8 ký tự**, dạng `ABCD-1234`. Ghi nhớ hoặc copy mã này.
   > Mã này chỉ dùng một lần, **không cần gửi cho Claude**.
4. Nhấn `Enter` → trình duyệt tự mở trang GitHub.
5. Đăng nhập GitHub nếu được hỏi → nhập **mã 8 ký tự** ở bước 3 → **Continue**.
6. Bấm **Authorize github** (cho phép).
7. Trình duyệt báo **"Congratulations, you're all set!"**. Terminal hiện **"Logged in as ..."**.

## Xong khi

Terminal hiện dòng `Logged in as <tên của bạn>`. Quay lại Claude và gõ **"xong"**.

## Gặp vấn đề?

- **Trình duyệt không tự mở**: mở tay trang https://github.com/login/device rồi làm tiếp từ bước 5.
- **Đăng nhập nhầm tài khoản**: báo Claude, Claude sẽ hướng dẫn đăng xuất và đăng nhập lại.
