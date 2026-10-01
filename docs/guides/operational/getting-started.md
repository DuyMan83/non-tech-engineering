# Bắt đầu: cài Claude, Git và bộ skill

Đây là phần **duy nhất bạn phải tự làm** trước khi Claude giúp được bạn. Mất khoảng 15 phút.
Sau 3 bước này, Claude sẽ lo phần còn lại.

```
Bước 1: Cài Claude  →  Bước 2: Cài Git  →  Bước 3: Cài bộ skill  →  Claude thiết lập phần còn lại
```

## Bước 1 — Cài Claude

1. Bạn cần tài khoản Claude gói **Pro** hoặc **Max** (đăng ký tại https://claude.ai).
2. Tải ứng dụng Claude cho máy tính tại **https://claude.ai/download** và cài như phần mềm bình thường.
3. Mở Claude, đăng nhập.

## Bước 2 — Cài Git

**Git là gì?** Công cụ để lưu lại từng bước làm và tải code từ GitHub về. Không có Git thì không lấy được bộ skill, cũng không làm việc được với code.

### macOS
1. Mở Terminal (xem [mo-terminal.md](mo-terminal.md)).
2. Gõ lệnh sau rồi nhấn `Enter`:
   ```
   git --version
   ```
3. - Nếu hiện ra `git version ...` → **đã có Git**, sang Bước 3.
   - Nếu hiện **hộp thoại "Install Command Line Developer Tools"** → bấm **Install** → **Agree** → đợi cài xong (5–10 phút).
4. Gõ lại `git --version` để chắc chắn đã có.

### Windows
1. Vào **https://git-scm.com/download/win** — file cài sẽ tự tải về.
2. Mở file vừa tải → bấm **Next** liên tục, **giữ nguyên mọi lựa chọn mặc định** → **Install** → **Finish**.
3. **Tắt hẳn ứng dụng Claude rồi mở lại**, để Claude nhận ra Git vừa cài.

## Bước 3 — Cài bộ skill

Mở Claude, vào phần **Code**, chọn một thư mục làm việc bất kỳ (ví dụ thư mục `Documents`), rồi **dán nguyên câu sau** vào ô chat:

```
Cài bộ skill non-tech-engineering cho tôi: tải repo https://github.com/DuyMan83/non-tech-engineering.git về thư mục ~/non-tech-engineering (nếu đã có thì cập nhật bản mới nhất), sau đó chạy scripts/install-skills.sh claude trong repo đó. Xong thì báo cho tôi bằng lời đơn giản.
```

Claude có thể hỏi xin phép chạy lệnh → bấm **Cho phép / Allow**.

## Bước 4 — Để Claude thiết lập phần còn lại

Khi Claude báo cài xong, gõ:

```
Thiết lập môi trường cho tôi
```

Claude sẽ kiểm tra máy, cài các công cụ còn thiếu (VS Code, Node.js, Firebase…) và hướng dẫn bạn tạo tài khoản GitHub, Firebase từng bước một.

---

**Gặp khó?** Chụp màn hình gửi cho Claude, hoặc cho người hướng dẫn của bạn.
