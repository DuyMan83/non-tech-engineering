# Kiểm thử — {{đối tượng: tên đề xuất / phiên bản / toàn app}}

## Phạm vi

- **Đối tượng:** {{tính năng / phiên bản nào}}
- **Môi trường:** {{dev — bộ giả lập trên máy (mặc định) / bản thật chỉ quan sát, không ghi dữ liệu}}
- **Ngày:** {{YYYY-MM-DD}}
- **Tài liệu đã đọc:** {{AGENTS.md, docs/de-xuat/..., docs/ke-hoach/..., docs/kien-truc/..., docs/phien-ban.md}}
- **Không đọc code.** Mọi hiểu biết bên trong lấy từ tài liệu ở trên.
- **Ngoài phạm vi:** {{...}}

## Mô hình từ tài liệu (hộp xám)

**Tính năng & quy tắc** (từ đề xuất):
- {{quy tắc 1, vd "tên việc tối đa 200 ký tự"}}

**Ma trận quyền** (`QUYỀN`):

| Ai | Dữ liệu | Xem | Thêm | Sửa | Xoá |
|---|---|---|---|---|---|
| {{chủ}} | {{việc của mình}} | ✔ | ✔ | ✔ | ✔ |
| {{người khác}} | {{việc của chủ}} | ✘ | ✘ | ✘ | ✘ |

**Trạng thái** (`TRẠNG THÁI`): {{(chưa có) → chưa xong ⇄ xong → (đã xoá)}}

**Luồng chính** (`LUỒNG`): {{người dùng làm → app làm → dữ liệu đổi → người dùng thấy}}

## Rủi ro (risk-based)

| # | Rủi ro | Nguồn | Khả năng (1–3) | Ảnh hưởng (1–3) | Điểm | Mức kiểm |
|---|---|---|---|---|---|---|
| R1 | {{...}} | {{đề xuất / kế hoạch / đoán lỗi}} | | | | {{kỹ / vừa / smoke}} |

Điểm ≥ 6 → kiểm **kỹ** (nhiều kỹ thuật, có khám phá). 3–4 → **vừa**. ≤ 2 → **smoke / checklist**.

## Test case

| ID | Rủi ro | Kỹ thuật | Hộp | Bước (người dùng làm) | Mong đợi | Kết quả | Bằng chứng |
|---|---|---|---|---|---|---|---|
| TC1 | R1 | {{BIÊN}} | {{đen / xám}} | {{...}} | {{...}} | {{✔ / ✘ / chưa chạy}} | {{ảnh / ghi chú}} |

## Phiên khám phá

**Phiên 1** — Charter: *Khám phá {{vùng}} bằng {{cách}} để tìm {{loại lỗi}}.* Thời gian: {{15–30 phút}}.
- Đã thử: {{...}}
- Thấy: {{...}}
- Lỗi: {{L1...}}
- Câu hỏi mở: {{...}}

## Kiểm tra tự động hiện có (`PHỦ`, không đọc code test)

`npm run check`: {{xanh / đỏ}} — {{N}} ca. Dòng nghiệm thu không thấy ca test tương ứng: {{... hoặc "không có"}}.

## Lỗi tìm thấy

### L1 — {{tiêu đề lời thường: "Bấm X thì Y"}}
- **Mức:** {{Nghiêm trọng (mất / lộ dữ liệu, kẹt không dùng được) · Cao (sai chức năng chính) · Vừa (có cách vòng) · Thấp (giao diện, chữ)}}
- **Rủi ro / test case:** {{R1 / TC3}}
- **Bước tái hiện:** 1. … 2. … 3. …
- **Mong đợi:** {{...}}
- **Thực tế:** {{...}}
- **Tái hiện được:** {{luôn / thỉnh thoảng (x/10)}}
- **Bằng chứng:** {{ảnh}}

## UAT — nghiệm thu của người dùng

Người dùng tự làm trên app, **người dùng** quyết.

| # | Việc người dùng thử (từ "Người dùng tự thử" của đề xuất) | Người dùng nói |
|---|---|---|
| U1 | {{...}} | {{đạt / chưa đạt — ghi chú}} |

Kết luận UAT: {{**Đạt** / **Chưa đạt** — lý do}} · Ngày: {{...}}

## Kết luận

- **Rủi ro đã kiểm:** {{R1, R2...}} · **Còn mở:** {{... và vì sao}}
- **Lỗi:** {{N}} (Nghiêm trọng {{a}}, Cao {{b}}, Vừa {{c}}, Thấp {{d}}) — đang mở: {{...}}
- **Khuyến nghị:** {{**Đủ để triển khai** / **Chưa** — cần sửa L1, L2 trước}}
