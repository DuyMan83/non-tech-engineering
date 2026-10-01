---
name: thiet-lap-moi-truong
description: Thiết lập máy tính để người không biết code bắt đầu vibe coding - cài Git, Node.js, VS Code, Claude extension, công cụ Firebase; GitHub CLI; hướng dẫn tạo tài khoản GitHub, đăng nhập GitHub (HTTPS), Firebase. Dùng khi người dùng mới bắt đầu, nói "cài đặt máy", "chuẩn bị môi trường", "máy tôi đã sẵn sàng chưa", hoặc khi một skill khác báo thiếu công cụ / gặp lỗi lạ về môi trường. Chạy lại nhiều lần an toàn.
---

# Thiết lập môi trường

## Mục tiêu
Người dùng kết thúc với một máy **đã chạy thử được**: lưu được code lên GitHub, có VS Code + Claude, và (gói `web`) đưa được app lên Firebase.

## Người dùng là ai — đọc kỹ
Skill này thường chạy **trước khi** có AGENTS.md / CLAUDE.md, nên tự tuân theo các quy tắc sau:
- Người dùng **không biết code, không đọc được log**. Nói tiếng Việt, lời thường, không thuật ngữ; nếu buộc phải dùng thì giải thích trong ngoặc.
- **Mỗi lần chỉ hỏi 1 câu**, kèm gợi ý câu trả lời.
- **Báo tiến độ**: "Bước 2/6 — ...".
- Không in log thô. Lỗi → tóm tắt bằng 1–2 câu + bước tiếp theo.
- Kết thúc mỗi lượt: **đã làm gì · bạn sẽ thấy gì · bước tiếp theo**.

## Tài nguyên
- `tools.yaml` (cùng thư mục) — danh sách công cụ, tài khoản, lệnh kiểm tra/cài, thứ tự, phụ thuộc. **Là nguồn sự thật**; không tự nghĩ ra lệnh cài khác.
- Hướng dẫn cho người dùng: `docs/guides/operational/` trong repo `non-tech-engineering`. Tìm repo bằng cách resolve symlink thư mục skill này (`realpath` hoặc `readlink -f`) rồi lên 3 cấp. Không tìm thấy → dùng `https://github.com/DuyMan83/non-tech-engineering/tree/main/docs/guides/operational`.

## Tham số
- **Chế độ**: `kiem-tra` (chỉ đọc, dừng sau bước 2) hoặc `thiet-lap` (mặc định). Câu hỏi kiểu "máy tôi ổn chưa?" → `kiem-tra`.
- **Gói**: `co-ban` | `web` (mặc định) | `day-du`. Chỉ xử lý mục có gói tương ứng trong `tools.yaml`.

## Quy trình

### Bước 0 — Nhận diện (không hỏi người dùng)
- Hệ điều hành, chip (Apple Silicon/Intel), shell.
- Đang ở môi trường cloud/container (không có màn hình, đường dẫn kiểu `/home/user`, biến môi trường cloud)? → báo "môi trường cloud đã được chuẩn bị sẵn, không cần thiết lập" và **dừng**.
- Linux → báo chưa hỗ trợ chính thức, chỉ chạy `kiem-tra`.
- Đọc file trạng thái `~/.non-tech/moi-truong.json` nếu có, để biết lần trước dở ở đâu.

### Bước 1 — Kiểm tra (chỉ đọc)
Với mỗi mục trong gói: chạy `kiem_tra`, so `kiem_tra_chuoi` / `phien_ban_toi_thieu`. Mục `ai_lam: nguoi` không kiểm tra được bằng lệnh → dựa vào file trạng thái, chưa có thì coi là "chưa xong".

### Bước 2 — Báo cáo
Dùng đúng mẫu:

```
Kết quả kiểm tra máy của bạn:

✅ Đã sẵn sàng:      Git, VS Code
🤖 Claude sẽ cài:    Node.js, công cụ Firebase
🙋 Cần bạn làm:      Tạo tài khoản GitHub, đăng nhập GitHub trên máy
⚠️ Cần chú ý:        (xung đột, ví dụ Node quá cũ)
```
Mỗi mục kèm `vi_sao` ngắn. Chế độ `kiem-tra` → dừng ở đây.

### Bước 3 — Xin duyệt một lần
Liệt kê kế hoạch theo thứ tự trong `tools.yaml` (tôn trọng `phu_thuoc`), ước lượng thời gian, rồi hỏi **một lần**: "Mình bắt đầu nhé?". Không hỏi lại từng gói.

### Bước 4 — Thực hiện theo thứ tự
Đi lần lượt từng mục chưa xong (bỏ qua mục có `chi_he_dieu_hanh` khác máy hiện tại, và coi phụ thuộc vào mục đó là đã thoả):
- **`ai_lam: ai`** → chạy lệnh `cai` theo hệ điều hành → chạy lại `kiem_tra` ngay. Thất bại → **dừng**, giải thích lời thường, không tự thử cách khác.
- **`ai_lam: nguoi-dan-lenh`** → đưa đúng 1 lệnh trong khối code, nhắc mở hướng dẫn `mo-terminal.md`, báo trước những gì sẽ xảy ra (hỏi mật khẩu không hiện chữ, cửa sổ hiện ra...). Chờ "xong" → `kiem_tra`.
- **`ai_lam: nguoi`** → đọc file `huong_dan`, đưa **từng bước một** (không dán cả file), chờ "xong". Thu thập `thu_thap` mỗi lần 1 câu.

Ghi chú riêng:
- **github-login**: kết nối GitHub bằng **HTTPS qua GitHub CLI**, không dùng SSH key. Người dùng dán lệnh → làm theo `dang-nhap-github.md` (mã 1 lần + trình duyệt) → AI chạy `sau_khi_cai` → `kiem_tra`. Nếu username không khớp tài khoản đã tạo → báo, hỏi có muốn đăng nhập lại không.
- **Windows**: sau khi cài Git/Node/VS Code, lệnh mới có thể chưa nhận → bảo người dùng **tắt hẳn và mở lại** Claude/VS Code, rồi gõ "làm tiếp".
- **homebrew (Apple Silicon)**: chạy phần `sau_khi_cai`, báo trước sẽ thêm 1 dòng vào `~/.zprofile`.
- **claude-extension**: cài xong, hướng dẫn Phần 3 của `vscode-va-claude-extension.md` để đăng nhập.

Sau mỗi mục: cập nhật file trạng thái.

### Bước 5 — Chạy thử
Trong thư mục tạm:
1. `git init`, tạo 1 file, `git commit` → lưu điểm được.
2. `gh auth status` thành công và `git config --global --get-regexp 'credential.*github.com.*helper'` có `gh` → Git lưu code lên GitHub được.
3. Gói `web`: `node -e "console.log('ok')"` và `firebase login:list` có email.
4. Xoá thư mục tạm.

### Bước 6 — Kết thúc
Ghi file trạng thái, rồi báo:
```
🎉 Máy của bạn đã sẵn sàng!
- Đã cài: ...
- Tài khoản: GitHub (<username>), Firebase (<email>)
Bước tiếp theo: mở VS Code, bấm biểu tượng Claude và nói ý tưởng app bạn muốn làm.
```
Hoặc nếu còn thiếu: "Còn thiếu X. Bước tiếp theo: Y."

## File trạng thái
`~/.non-tech/moi-truong.json`:
```json
{
  "cap_nhat": "<ISO time>",
  "he_dieu_hanh": "macos",
  "goi": "web",
  "muc": {
    "git": "ok",
    "github-account": "ok",
    "github-login": "dang-lam"
  },
  "github_username": "...",
  "github_email": "..."
}
```
Giá trị: `ok` | `dang-lam` | `loi` | `chua`. Chỉ lưu thông tin công khai — **không lưu mật khẩu, token, khoá**.

## Ràng buộc an toàn (bắt buộc)
- **Không bao giờ** yêu cầu, nhận hoặc in ra mật khẩu, token, mã 2 bước, mã 1 lần của GitHub. Không chạy `gh auth token` hay bất kỳ lệnh nào in token. Người dùng lỡ dán vào chat → bảo họ đổi ngay.
- Chỉ dùng lệnh trong `tools.yaml` (nguồn chính thức). Không `curl | bash` từ nguồn khác.
- Không `sudo`. Lệnh cần mật khẩu → chuyển sang `nguoi-dan-lenh`.
- Không gỡ, hạ cấp, hay ghi đè công cụ/khoá đã có. Xung đột (Node quá cũ, có nvm, đã đăng nhập GitHub bằng tài khoản khác) → báo và hỏi.
- Không sửa file cấu hình shell khi chưa nói rõ sẽ thêm dòng nào.
- Không tạo tài khoản, không nhập thẻ thanh toán, không nâng cấp gói Firebase Blaze.
- Lỗi → dừng và giải thích. Không thử liên tiếp các cách khác.

## Ngoài phạm vi
Tạo project Firebase, dựng dự án, cài IDE khác, cấu hình máy công ty (proxy, quyền admin bị khoá → soạn sẵn tin nhắn mẫu để người dùng gửi bộ phận IT).
