---
name: de-xuat-tinh-nang
description: Viết bản đề xuất (proposal) cho một tính năng hoặc thay đổi TRƯỚC khi code - khảo sát hiện trạng, nêu mục tiêu, khoảng cách (gap), giải pháp nhìn từ phía người dùng (thành phần, dữ liệu, luồng) và cách kiểm chứng; người dùng duyệt từng quyết định rồi mới làm. Dùng khi người dùng muốn "thêm tính năng", "làm cho app làm được X", "sửa cách Y hoạt động", "lên kế hoạch / đề xuất cho...", hoặc mô tả một vấn đề họ gặp với app. KHÔNG dùng cho sửa lỗi nhỏ rõ ràng hay đổi chữ / màu đơn lẻ.
---

# Đề xuất tính năng

## Mục tiêu
Một file đề xuất trong dự án, **người dùng đã duyệt**, nói rõ: đang thế nào → muốn thế nào → thiếu gì → sẽ làm gì → **kiểm chứng xong bằng cách nào**. Code chỉ bắt đầu sau khi đề xuất được duyệt; phần "Cách kiểm chứng" là định nghĩa "xong" của việc code.

Nói với người dùng: *"Trước khi làm, mình viết một bản đề xuất ngắn để hai bên thống nhất làm gì và thế nào là xong."*

## Giao tiếp
Theo `AGENTS.md` (lời thường, mỗi lần 1 câu hỏi kèm gợi ý, mẫu trình bày). Bản đề xuất **viết cho người dùng đọc**: không tên file, không tên hàm, không thuật ngữ — trừ dòng tên file test trong "Kiểm tra tự động".

## Tài nguyên (cùng thư mục skill)
- `mau-de-xuat.md` — khung các mục. **Luôn bắt đầu từ mẫu này.**
- `vi-du-de-xuat.md` — một đề xuất đã viết xong để tham khảo độ dài và giọng văn.
- `kiem-tra-de-xuat.mjs` — kiểm tra đủ mục: `node <thư mục skill>/kiem-tra-de-xuat.mjs <file>`.

## Nơi lưu
`docs/de-xuat/<YYYY-MM-DD>-<ten-ngan-khong-dau>.md` trong dự án của người dùng.

## Quy trình

### Bước 1 — Nghe vấn đề (mỗi lần 1 câu)
1. Bạn đang gặp chuyện gì / muốn app làm được gì?
2. Ai gặp, trong tình huống nào?
3. Hôm nay bạn đang xoay xở thế nào?

Người dùng nói giải pháp ("thêm nút X") → hỏi lại vấn đề phía sau ("nút đó giúp bạn tránh được chuyện gì?"). Ghi giải pháp họ nói làm một phương án.

### Bước 2 — Khảo sát hiện trạng
Đọc `AGENTS.md` và `docs/kien-truc/` của dự án, các màn hình / dữ liệu / use case liên quan; chạy app nếu cần xem tận mắt. Ghi **ngày khảo sát** và đã xem những gì. Tìm cả những thứ **đã có sẵn dùng lại được**.

### Bước 3 — Viết nháp theo mẫu
Điền `mau-de-xuat.md`, theo thứ tự: Hiện trạng → Mục tiêu → Khoảng cách → Giải pháp → Rủi ro & chi phí → Phạm vi → Hỏi đáp → Phụ lục.

**Phần kỹ thuật cực ngắn, nhìn từ người dùng** — chỉ 3 thứ trong "Thay đổi ở đâu":
- **Thành phần**: màn hình / nút / ô / thông báo nào mới hoặc sửa.
- **Dữ liệu**: thứ gì được lưu thêm, lưu ở đâu, ai ghi khi nào, ai được xem/sửa. Không thêm gì → ghi đúng một câu "Không thêm dữ liệu nào được lưu."
- **Luồng**: 3–6 bước "người dùng làm → app làm → dữ liệu đổi → người dùng thấy". Không có luồng mới → bỏ.

Không viết tên hàm, kiểu dữ liệu, đường dẫn code. Việc chọn cách code là của bước làm, theo `docs/kien-truc/`.

**Cách kiểm chứng — bắt buộc cả hai phần:**
- **Người dùng tự thử**: kịch bản cụ thể dạng checklist `- [ ]` — ở đâu, làm gì, thấy gì. Có cả trường hợp đặc biệt và "cách cũ vẫn chạy".
- **Kiểm tra tự động**: mỗi quy tắc quan trọng → một test trong `npm run check`, ghi bằng lời thường + tên file test, theo lớp: quy tắc nghiệp vụ (`domain`), việc app làm (`services`), luật bảo mật dữ liệu (`tests/firestore.rules.test.ts`) nếu có dữ liệu mới hoặc quyền mới.

**Rủi ro & chi phí** — luôn trả lời 4 câu: tốn tiền thật? dữ liệu cá nhân mới? đổi phân quyền? mất mạng / lỗi giữa chừng? Câu nào "có" thì ghi rủi ro, cách xử lý, cách kiểm chứng.

### Bước 4 — Người dùng quyết
Không dán cả bản nháp. Đưa **từng quyết định một** theo mẫu trình bày, mỗi câu có 2–3 phương án và đề xuất của bạn:
1. Hiện trạng và mục tiêu đã đúng ý chưa.
2. Giải pháp (kèm phương án đã cân nhắc).
3. Các quyết định sản phẩm người dùng sẽ cảm nhận được (hướng, giới hạn, có hỏi xác nhận không...).
4. Phạm vi: làm gì đợt này, để sau gì.

Ghi vào **Phụ lục**: ai chốt mục nào (`người quyết` / `agent đề xuất, người duyệt` / `agent tự quyết`), phương án đã bỏ, khi nào cần rà lại.

### Bước 5 — Kiểm tra và lưu
1. `node <thư mục skill>/kiem-tra-de-xuat.mjs <file>` → phải ✔. Thiếu → bổ sung, không bỏ mục.
2. Gửi người dùng **bản tóm tắt 5 dòng** (vấn đề · mục tiêu · giải pháp · cách biết là xong · ngoài phạm vi) và đường dẫn file.
3. Người dùng duyệt → lưu điểm (commit) "Đề xuất: <tên>"; cập nhật mục "Đang dở / bước tiếp theo" trong `AGENTS.md` của dự án.

### Bước 6 — Khi bắt đầu làm (sau khi duyệt)
- Lập kế hoạch bằng skill **`lap-ke-hoach`** (chia chặng, rủi ro, chiến lược kiểm thử) trước khi code.
- "Xong" = `npm run check` pass **và** người dùng đã thử hết checklist "Người dùng tự thử".
- Trong lúc làm phát hiện phải đổi quyết định → **dừng, hỏi**, sửa đề xuất (ghi "Sửa ngày YYYY-MM-DD: ..." ngay chỗ đổi), rồi mới làm tiếp.

## Ràng buộc
- **Không code trước khi đề xuất được duyệt.**
- Không tự chốt thay người dùng những quyết định họ sẽ cảm nhận được (giao diện, giới hạn, tiền, dữ liệu cá nhân). Agent tự quyết phần kỹ thuật và ghi rõ trong Phụ lục.
- Không xoá mục nào của mẫu; mục không áp dụng → ghi một câu vì sao.
- Đề xuất đã duyệt mà thay đổi → sửa tại chỗ kèm ngày, không viết lại từ đầu.
