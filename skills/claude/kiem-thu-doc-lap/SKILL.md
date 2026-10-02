---
name: kiem-thu-doc-lap
description: Kiểm thử độc lập một tính năng / phiên bản / cả app CHỈ dựa trên tài liệu và app đang chạy, KHÔNG đọc code - phân tích rủi ro (risk-based), thiết kế test bằng kỹ thuật hộp đen (phân vùng tương đương, giá trị biên, bảng quyết định, chuyển trạng thái, kịch bản, đoán lỗi) và hộp xám từ tài liệu (ma trận quyền, vòng đời dữ liệu, luồng), khám phá / ad-hoc, rồi UAT cùng người dùng; báo lỗi bằng lời thường và kết luận có nên triển khai không. Dùng khi người dùng nói "kiểm thử", "test thử giúp", "kiểm tra kỹ trước khi đưa lên", "QA", "nghiệm thu", "có lỗi gì không", hoặc trước skill trien-khai-phien-ban-moi.
---

# Kiểm thử độc lập

## Nguyên tắc
1. **Chỉ đọc tài liệu, không đọc code.** Được đọc: `*.md` (AGENTS.md, README, CHANGELOG), mọi thứ trong `docs/`, ảnh chụp. Không đọc: `src/`, `tests/`, `scripts/`, file cấu hình, `firestore.rules`, `git diff/show`. Được **chạy** app và lệnh kiểm tra (`npm start`, `npm run check`) và quan sát kết quả như người dùng.
2. **Hộp đen + hộp xám, không hộp trắng.** Hộp xám = dùng cấu trúc bên trong **được mô tả trong tài liệu** (dữ liệu, ai được làm gì, luồng, kiến trúc) để thiết kế test, rồi thử từ bên ngoài.
3. **Dựa trên rủi ro.** Rủi ro cao kiểm trước và kỹ hơn; báo cáo theo rủi ro.
4. **UAT do người dùng quyết.** AI chuẩn bị và hướng dẫn; "đạt / chưa đạt" là lời của người dùng.
5. **Không sửa gì.** Không sửa code, không sửa tài liệu dự án ngoài file kiểm thử. Lỗi → báo cáo; sửa là việc của skill khác.
6. **Độc lập thật:** nên chạy skill này trong **một phiên Claude mới**, chưa từng xem code của tính năng. Phiên đã viết code thì ghi rõ trong báo cáo: "kiểm thử bởi phiên đã đọc code — tính độc lập hạn chế".

## Tài nguyên (cùng thư mục skill)
- `ky-thuat-kiem-thu.md` — danh mục kỹ thuật và mã (`PVTĐ`, `BIÊN`, `BẢNG`, `TRẠNG THÁI`, `KỊCH BẢN`, `CẶP`, `ĐOÁN`, `QUYỀN`, `VÒNG ĐỜI`, `LUỒNG`, `PHỦ`, `ADHOC`, `KHÁM PHÁ`, `CHECKLIST`, `RỦI RO`, phi chức năng, `SMOKE`, `XÁC NHẬN`, `HỒI QUY`, `UAT`). **Đọc trước khi thiết kế test.**
- `mau-kiem-thu.md` — khung báo cáo. **Luôn bắt đầu từ mẫu này.**
- `vi-du-kiem-thu.md` — báo cáo thật cho tính năng "Xoá hết việc đã xong": tìm ra lỗi mất mạng mà test tự động xanh không bắt được.
- `duoc-doc.mjs` — gác cửa đọc file:
  - Hỏi: `node <skill>/duoc-doc.mjs <đường dẫn>` → "được" / "không được".
  - Chặn thật: dự án tạo từ khung có sẵn hook trong `.claude/settings.json`; hook **chỉ chặn khi có file `.kiem-thu-dang-chay`** ở gốc dự án.

## Nơi lưu
`docs/kiem-thu/<YYYY-MM-DD>-<đối tượng>.md` (+ ảnh trong `docs/kiem-thu/anh/`).

## Quy trình

### Bước 0 — Bật chế độ kiểm thử độc lập
`touch .kiem-thu-dang-chay` ở gốc dự án (hook bắt đầu chặn đọc code). Hỏi người dùng **1 câu**: kiểm thử cái gì — gợi ý: tính năng vừa làm (đề xuất mới nhất "Đã xong" hoặc đang làm), hay cả phiên bản sắp triển khai, hay cả app.

### Bước 1 — Đọc tài liệu, dựng mô hình (hộp xám)
Đọc `AGENTS.md`, đề xuất + kế hoạch liên quan, `docs/kien-truc/`, `docs/phien-ban.md`. Điền mục **Mô hình**: quy tắc, ma trận quyền, trạng thái, luồng. Tài liệu thiếu / mâu thuẫn → ghi thành **câu hỏi** (cũng là phát hiện), không đoán bằng cách đọc code.

### Bước 2 — Phân tích rủi ro
Gom rủi ro từ đề xuất ("Rủi ro & chi phí"), kế hoạch ("Rủi ro và đường lùi"), mô hình (ô "bị chặn" của ma trận quyền, chuyển trạng thái không hợp lệ) và đoán lỗi. Chấm Khả năng × Ảnh hưởng → mức kiểm.
Luôn có rủi ro về: **dữ liệu người khác**, **mất / sai dữ liệu khi mất mạng**, **thao tác lặp / nhanh**, **đầu vào biên**.

### Bước 3 — Thiết kế test case
Mỗi rủi ro → test case bằng kỹ thuật phù hợp (`ky-thuat-kiem-thu.md`); rủi ro điểm cao dùng ≥ 2 kỹ thuật. Mỗi case ghi: rủi ro, kỹ thuật, hộp (đen/xám), bước theo cách người dùng làm, mong đợi.
Thêm: 1 phiên `KHÁM PHÁ` cho mỗi rủi ro điểm ≥ 6; `CHECKLIST` chung; `HỒI QUY` cho tính năng cũ (đề xuất "Đã xong" trước đó).

### Bước 4 — Thực thi
1. `SMOKE`: `npm start` (dev, bộ giả lập — **không bao giờ kiểm thử ghi dữ liệu trên bản thật**). Không qua → dừng, báo.
2. `PHỦ`: chạy `npm run check`, đọc **kết quả** (không đọc code test), đối chiếu với nghiệm thu của đề xuất.
3. Chạy test case bằng **trình duyệt tự động** (web) — mỗi người dùng khác nhau = một cửa sổ riêng; mất mạng = chế độ offline của trình duyệt. Mobile: những gì cần điện thoại → đưa vào UAT.
4. Phiên khám phá theo charter, có giới hạn thời gian, ghi chép.
5. Mỗi case: ✔ / ✘ / chưa chạy (lý do) + bằng chứng (ảnh, mô tả). ✘ → **lỗi** theo mẫu; thử tái hiện 3 lần để ghi "luôn / thỉnh thoảng".

### Bước 5 — UAT với người dùng
Bảng U1… từ "Người dùng tự thử" của đề xuất (+ ca quan trọng AI tìm ra). Trình bày theo mẫu trình bày (tiêu đề = để làm gì; các bước; "gõ đạt / chưa đạt cho từng dòng"). App đã chạy sẵn. Ghi **nguyên văn** nhận xét của người dùng. Kết luận UAT là của người dùng.

### Bước 6 — Báo cáo
1. Điền **Kết luận**: rủi ro đã kiểm / còn mở, lỗi theo mức, khuyến nghị **đủ để triển khai / chưa**. Có lỗi Nghiêm trọng hoặc Cao đang mở → khuyến nghị **chưa**.
2. Tóm tắt cho người dùng 5 dòng lời thường + đường dẫn file.
3. Lỗi cần sửa → đề nghị: lỗi nhỏ, rõ → làm một bước sửa theo `thuc-thi-ke-hoach` (test tái hiện trước); lỗi lớn / đổi hành vi → `de-xuat-tinh-nang`.
4. Lưu điểm "Kiểm thử: <đối tượng>". **Xoá `.kiem-thu-dang-chay`.**

### Kiểm thử lại (`XÁC NHẬN`, `HỒI QUY`)
Sau khi lỗi được sửa: bật lại chế độ (Bước 0), chạy lại **đúng** case đã phát hiện lỗi + `HỒI QUY` các vùng gần đó; cập nhật báo cáo cũ (thêm "Kiểm lại <ngày>: ✔ / ✘"), không viết lại từ đầu.

## Ràng buộc
- Không đọc code (kể cả qua `cat`, `grep`, `git diff/show`). Hook chặn mà vẫn cần thông tin → hỏi người dùng hoặc ghi "tài liệu thiếu".
- Chỉ kiểm thử trên **dev / bộ giả lập**. Bản thật: chỉ quan sát (mở trang, xem), không thêm / sửa / xoá.
- Không sửa code, không sửa đề xuất / kế hoạch (chỉ ghi câu hỏi / phát hiện vào báo cáo).
- Không tự kết luận UAT thay người dùng.
- Báo cáo **trung thực**: case chưa chạy ghi "chưa chạy" + lý do; không nói "đã test kỹ" khi chỉ smoke.
- Luôn xoá `.kiem-thu-dang-chay` khi xong hoặc khi dừng giữa chừng.
