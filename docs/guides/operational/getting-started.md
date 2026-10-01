# Bắt đầu: cài Claude, Git và bộ skill

Đây là phần **duy nhất bạn phải tự làm** trước khi Claude giúp được bạn. Mất khoảng 20–30 phút.
Sau các bước này, Claude sẽ lo phần còn lại.

```
1. Cài Claude → 2. Cài Git → 3. Tài khoản GitHub + xin quyền → 4. Tải bộ skill → 5. Claude cài skill → 6. Claude thiết lập phần còn lại
```

> Bộ skill hiện đang ở chế độ **riêng tư** (private): chỉ người được mời mới tải được. Vì vậy bạn cần tài khoản GitHub và được người quản lý mời trước.

## Bước 1 — Cài Claude

1. Bạn cần tài khoản Claude gói **Pro** hoặc **Max** (đăng ký tại https://claude.ai).
2. Tải ứng dụng Claude cho máy tính tại **https://claude.ai/download** và cài như phần mềm bình thường.
3. Mở Claude, đăng nhập.

## Bước 2 — Cài Git

**Git là gì?** Công cụ để lưu lại từng bước làm với code. Claude cần nó để làm việc với bạn.

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

## Bước 3 — Tài khoản GitHub và xin quyền truy cập

1. Tạo tài khoản GitHub theo [tao-tai-khoan-github.md](tao-tai-khoan-github.md) (đã có thì bỏ qua).
2. Gửi **username GitHub** của bạn cho người quản lý bộ skill để được mời.
3. Bạn sẽ nhận email **"invited you to collaborate on DuyMan83/non-tech-engineering"** → bấm **View invitation** → **Accept invitation**.

## Bước 4 — Tải bộ skill

1. Đăng nhập GitHub trên trình duyệt, mở **https://github.com/DuyMan83/non-tech-engineering**
   (thấy lỗi 404 nghĩa là bạn chưa đăng nhập hoặc chưa chấp nhận lời mời ở Bước 3).
2. Bấm nút xanh **Code** → **Download ZIP**.
3. File `non-tech-engineering-main.zip` sẽ nằm trong thư mục **Downloads**. **Không cần giải nén** — Claude sẽ làm.

## Bước 5 — Nhờ Claude cài bộ skill

Mở Claude, vào phần **Code**, chọn thư mục làm việc là **Downloads**, rồi **dán nguyên câu sau** vào ô chat:

```
Cài bộ skill non-tech-engineering cho tôi: trong thư mục Downloads có file non-tech-engineering-main.zip (hoặc thư mục non-tech-engineering-main nếu máy đã tự giải nén). Giải nén nếu cần, chuyển nội dung vào thư mục ~/non-tech-engineering (nếu thư mục đó đã có thì hỏi tôi trước khi thay), rồi chạy scripts/install-skills.sh claude trong đó. Xong thì báo cho tôi bằng lời đơn giản.
```

Claude có thể hỏi xin phép chạy lệnh → bấm **Cho phép / Allow**.

## Bước 6 — Để Claude thiết lập phần còn lại

Khi Claude báo cài xong, gõ:

```
Thiết lập môi trường cho tôi
```

Claude sẽ kiểm tra máy, cài các công cụ còn thiếu (VS Code, Node.js, Firebase…) và hướng dẫn bạn đăng nhập GitHub, Firebase từng bước một.

---

**Gặp khó?** Chụp màn hình gửi cho Claude, hoặc cho người hướng dẫn của bạn.

## Dành cho người quản lý bộ skill

Mời người dùng mới:
1. Mở https://github.com/DuyMan83/non-tech-engineering/settings/access
2. **Add people** → nhập username GitHub của họ → chọn quyền **Read** → gửi lời mời.

Cập nhật bộ skill cho người dùng: hiện tại họ phải tải lại ZIP và làm lại Bước 5. Khi repo chuyển sang công khai, Bước 3–5 sẽ rút gọn thành một câu nhờ Claude tải bằng Git.
