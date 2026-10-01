# Đăng ký SSH key với GitHub

**SSH key là gì?** Là "chìa khoá" để máy tính của bạn chứng minh với GitHub rằng "đây đúng là tôi", không cần gõ mật khẩu mỗi lần lưu code.
Chìa có 2 nửa:
- **Nửa riêng** — nằm trong máy bạn. **Không bao giờ gửi cho ai, không dán vào chat.**
- **Nửa công khai** (file kết thúc bằng `.pub`) — đưa cho GitHub. Ai thấy cũng không sao.

## Phần Claude làm giúp bạn

Claude sẽ tạo chìa khoá và **copy sẵn nửa công khai** vào bộ nhớ tạm (clipboard). Bạn chỉ cần dán vào GitHub.

## Phần bạn làm

1. Mở **https://github.com/settings/keys** (đăng nhập nếu được hỏi).
2. Bấm nút **New SSH key**.
3. Ô **Title**: đặt tên cho máy, ví dụ `Macbook cua toi`.
4. Ô **Key type**: để nguyên **Authentication Key**.
5. Ô **Key**: dán (`⌘ Command` + `V` trên Mac, `Ctrl` + `V` trên Windows). Nội dung bắt đầu bằng `ssh-ed25519 ...`.
6. Bấm **Add SSH key**. GitHub có thể hỏi lại mật khẩu hoặc mã xác minh 2 bước.

## Xong khi

Trang hiện ra chìa khoá bạn vừa thêm. Quay lại Claude, gõ **"xong"** — Claude sẽ tự kiểm tra kết nối.

## Lưu ý

- Mỗi máy tính nên có chìa riêng. Đổi máy mới thì làm lại bước này.
- Mất máy? Vào lại trang trên và bấm **Delete** chìa của máy đó.
