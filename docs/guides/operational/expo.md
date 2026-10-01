# Tài khoản Expo (chỉ app điện thoại)

**Expo là gì?** Dịch vụ giúp build app điện thoại trên máy chủ của họ (không cần máy Mac), gửi app lên App Store / Google Play, và gửi bản cập nhật nhanh tới người dùng.

**Chi phí:** Có gói miễn phí, giới hạn số lần build mỗi tháng. Claude sẽ báo trước mỗi lần dùng tới một lượt build.

## Tạo tài khoản (làm 1 lần)

1. Vào **https://expo.dev/signup** — *để có tài khoản build và phát hành app*.
2. Đăng ký bằng email (hoặc tài khoản GitHub bạn đã có).
3. Mở email, bấm link xác nhận — *để chứng minh email là của bạn*.

## Cho máy tính đăng nhập Expo (làm 1 lần)

*Để máy tính được phép build và phát hành app dưới tên tài khoản của bạn.* Claude không tự làm được vì cần bạn nhập mật khẩu. Mở Terminal trong VS Code (**Terminal → New Terminal**), dán lệnh rồi nhấn Enter:

```
npx eas-cli@latest login
```

Nhập email / tên đăng nhập và mật khẩu Expo khi được hỏi (gõ mật khẩu sẽ không thấy chữ — bình thường). Thấy `Logged in as ...` là xong — gõ **xong** với Claude.

## Lên App Store / Google Play (khi muốn phát hành lần đầu)

- **Google Play:** tài khoản nhà phát triển tại https://play.google.com/console — **25 USD một lần**.
- **App Store:** Apple Developer Program tại https://developer.apple.com/programs/ — **99 USD mỗi năm**.

Chỉ đăng ký khi bạn đã sẵn sàng phát hành. Lần đầu gửi app, store sẽ duyệt (vài giờ tới vài ngày) và hỏi thêm thông tin về app (ảnh chụp, mô tả, chính sách quyền riêng tư) — Claude sẽ hướng dẫn từng mục.
