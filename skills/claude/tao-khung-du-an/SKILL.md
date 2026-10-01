---
name: tao-khung-du-an
description: Tạo dự án mới cho người không biết code từ khung dự án có sẵn (web Next.js + Firebase) - hỏi tên và mô tả app, copy khung, cài thư viện, kiểm tra, lưu điểm đầu tiên rồi chạy thử cho người dùng xem. Dùng khi người dùng muốn "bắt đầu app mới", "tạo dự án", "làm một trang web/app", "dựng khung dự án", hoặc đã có ý tưởng và muốn bắt tay vào làm. KHÔNG dùng để thêm tính năng vào dự án đã có.
---

# Tạo khung dự án

## Mục tiêu
Người dùng kết thúc với một dự án **chạy được trên máy**, đã kiểm tra (`npm run check` pass), đã lưu điểm đầu tiên, và đã **tận mắt thấy app chạy** trong trình duyệt.

Nói với người dùng: *"Mình dựng **khung dự án** trước — một app mẫu chạy được — rồi xây thêm theo ý bạn."*

## Giao tiếp
Theo `AGENTS.md` (lời thường, mỗi lần 1 câu hỏi, **mẫu trình bày**: tiêu đề = để làm gì → why/how → lệnh hoặc các bước, kết thúc lượt bằng đã làm gì · bạn sẽ thấy gì · bước tiếp theo). Báo tiến độ "Bước 3/8 — ...".

## Tài nguyên
- `tao-du-an.mjs` (cùng thư mục skill) — copy khung + điền thông tin. **Luôn dùng script này**, không copy tay.
- Repo `non-tech-engineering` chứa khung (`templates/projects/<kien-truc>/`) và rules (`docs/architectures/`). Tìm repo theo thứ tự:
  1. Resolve symlink thư mục skill này (`realpath` / `readlink -f`) rồi lên 3 cấp.
  2. `~/non-tech-engineering` (nơi `getting-started.md` cài vào — dùng khi skill được cài bằng copy, ví dụ Windows).
  3. Không thấy → hỏi người dùng; gợi ý làm lại Bước 4–5 của `getting-started.md`.
  Xác nhận bằng cách kiểm tra có thư mục `templates/projects/`.

## Kiến trúc có sẵn
| Kiến trúc | Trạng thái | Khi nào |
|---|---|---|
| `web-nextjs-firebase` | ✅ Có khung | **Mặc định.** Web app, dùng được trên điện thoại (thêm vào màn hình chính) |
| `mobile-expo-firebase` | ⏳ Chưa có khung | Cần lên App Store / Google Play. Người dùng cần cái này → nói thật là chưa có, đề nghị bắt đầu bằng web |

## Quy trình

### Bước 1 — Kiểm tra máy
Chạy nhanh: `node --version` (≥ 20), `java -version` (≥ 21), `git --version`. Hoặc đọc `~/.non-tech/moi-truong.json`.
Thiếu → dừng, đề nghị chạy skill `thiet-lap-moi-truong` (gói `web`) trước.

### Bước 2 — Hỏi về app (mỗi lần 1 câu)
1. **Tên app** — ví dụ "Đặt lịch Spa Hoa Mai".
2. **App làm gì, cho ai** — 1–2 câu lời thường.
3. **Có cần lên App Store / Google Play không?** Gợi ý: "Phần lớn app chỉ cần chạy trên trình duyệt và điện thoại là đủ". Không cần → `web-nextjs-firebase`.

### Bước 3 — Chọn nơi đặt dự án
Mặc định `~/du-an/<slug>` (slug = tên không dấu, nối gạch ngang — script tự tạo). Nói rõ đường dẫn, hỏi đồng ý. Thư mục đã có và không trống → **không ghi đè**, hỏi tên khác.

### Bước 4 — Tạo khung
```
node <thư mục skill>/tao-du-an.mjs --repo <repo> --kien-truc web-nextjs-firebase --dich <thư mục dự án> --ten "<tên>" --mo-ta "<mô tả>"
```
Script in ra JSON `{ ok, dich, slug, demoProjectId }`. Lỗi → giải thích lời thường, không tự sửa tay.

### Bước 5 — Cài thư viện
Báo trước: *"Đang tải các thư viện cần thiết, mất 1–3 phút"*. Trong thư mục dự án: `npm install`.

### Bước 6 — Kiểm tra
`npm run check`. Lần đầu tải bộ giả lập Firebase, hơi lâu — báo trước.
- Pass → báo "Đã kiểm tra, mọi thứ ổn ✓".
- Fail → **dừng**, không lưu điểm; tóm tắt lỗi lời thường. Lỗi về Java/Node → đề nghị `thiet-lap-moi-truong`.

### Bước 7 — Lưu điểm đầu tiên
```
git init -b main
git add -A
git commit -m "Khởi tạo dự án từ khung web-nextjs-firebase"
```
Nói với người dùng: *"Đã lưu điểm đầu tiên — sau này hỏng gì cũng quay về được đây."*

**Đưa lên GitHub** (tạo repo riêng tư) — **hỏi trước**, giải thích: để sao lưu code trên mạng, chỉ bạn thấy. Đồng ý → `gh repo create <slug> --private --source . --push`. Chưa đăng nhập GitHub → đề nghị `thiet-lap-moi-truong`.

### Bước 8 — Cho người dùng xem app chạy
Chạy `npm run dev` ở chế độ nền (giữ chạy), chờ thấy `Ready`, rồi trình bày theo mẫu:

~~~markdown
**Xem app của bạn đang chạy**

App đang chạy thử trên máy bạn, dữ liệu là dữ liệu thử — không ảnh hưởng gì bên ngoài.
Mở trình duyệt và vào địa chỉ dưới đây, thử thêm vài việc và đánh dấu xong:

```
http://localhost:3000
```
~~~

Giải thích: *"Đây là app mẫu 'việc cần làm'. Bước tiếp theo mình sẽ thay dần bằng tính năng của {{tên app}}."*
Nếu công cụ cho phép, tự mở trình duyệt / chụp màn hình gửi người dùng.

### Kết thúc
- Cập nhật mục "Đang dở / bước tiếp theo" trong `AGENTS.md` của dự án (đã có sẵn nội dung mặc định).
- Báo: đã làm gì · bạn sẽ thấy gì · bước tiếp theo: *"Kể cho mình tính năng đầu tiên bạn muốn có"*.

## Ràng buộc
- **Không ghi đè** thư mục có sẵn.
- **Không deploy**, không tạo project Firebase thật — việc đó thuộc bước đưa lên mạng (skill riêng, sau). Dự án mới chỉ chạy với bộ giả lập (`demo-...`).
- **Không bỏ qua** `npm run check`; không lưu điểm khi check fail.
- Không sửa khung trong repo `non-tech-engineering` — chỉ làm trong thư mục dự án mới.
- Tạo repo GitHub, push → luôn hỏi trước.

## Ngoài phạm vi
Thêm tính năng, đổi đăng nhập ẩn danh sang Google/email, kết nối Firebase thật, deploy, khung mobile.
