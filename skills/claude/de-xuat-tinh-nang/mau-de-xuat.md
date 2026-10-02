# {{Tên đề xuất — viết theo việc người dùng làm được, vd "Xoá việc đã xong bằng một nút"}}

## Hiện trạng (Problem)

Khảo sát ngày {{YYYY-MM-DD}}, trên {{app / màn hình / tài liệu đã xem}}.

{{Ai đang gặp chuyện gì, trong tình huống nào, phiền ra sao. Kể như chuyện đời thường, 1–3 đoạn ngắn. Không nói giải pháp ở đây.}}

## Mục tiêu (Objective)

{{Sau khi làm xong, người dùng làm được gì, ở đâu, cảm giác thế nào. 1–2 đoạn, đo được bằng mắt.}}

## Khoảng cách (Gap)

Khảo sát ngày {{YYYY-MM-DD}}.

- {{Hôm nay app đang làm gì / chưa làm gì so với mục tiêu — mỗi gạch đầu dòng một khoảng cách.}}
- {{Cái gì ĐÃ CÓ SẴN và dùng lại được (để người đọc thấy việc nhỏ hay lớn).}}

## Giải pháp (Solution)

### Người dùng sẽ thấy gì

- **{{Hành động / tình huống}}.** {{Người dùng làm gì → app phản hồi ra sao.}}
- **{{Trường hợp đặc biệt}}.** {{vd danh sách trống, mất mạng, bấm hai lần.}}
- **{{Những cách cũ vẫn còn}}.** {{Cái gì giữ nguyên.}}

### Thay đổi ở đâu (nhìn từ người dùng)

**Thành phần**

| Thành phần | Mới hay sửa | Thay đổi |
| --- | --- | --- |
| {{Màn hình / nút / ô nhập / thông báo}} | {{Mới / Sửa}} | {{1 câu}} |

**Dữ liệu**

{{"Không thêm dữ liệu nào được lưu." — hoặc bảng dưới.}}

| Thứ này là gì | Bên trong có gì | Lưu ở đâu | Ai ghi, khi nào |
| --- | --- | --- | --- |
| {{vd Việc cần làm}} | {{các thông tin}} | {{vd kho dữ liệu trên mạng (Firestore), đã có / mới}} | {{ai, lúc nào}} |

{{Ai được xem / sửa dữ liệu mới — 1 câu, lời thường.}}

**Luồng**

1. {{Người dùng làm gì}}
2. {{App làm gì}}
3. {{Dữ liệu đổi thế nào}}
4. {{Người dùng thấy kết quả gì}}

### Quyết định sản phẩm

- {{Mỗi quyết định 1 gạch đầu dòng, kèm lý do ngắn nếu chưa hiển nhiên.}}

### Cách kiểm chứng (Acceptance)

#### Người dùng tự thử

- [ ] {{Kịch bản cụ thể: ở đâu, làm gì → thấy gì. Người non-tech tự làm theo được.}}
- [ ] {{Trường hợp đặc biệt / lỗi.}}
- [ ] {{Những cách cũ vẫn chạy như trước.}}

#### Kiểm tra tự động (`npm run check`)

- {{Quy tắc nào được test, viết bằng lời thường}} — `{{file test}}`.
- {{Luật bảo mật dữ liệu nào được test (ai được / không được làm gì)}} — `tests/firestore.rules.test.ts`.

## Rủi ro & chi phí

Bốn câu hỏi: **tốn tiền thật** không · **dữ liệu cá nhân mới** không · **phân quyền** (ai được làm gì) có đổi không · **mất mạng / lỗi giữa chừng** thì sao.

{{Câu nào "không" thì ghi gọn một dòng. Câu nào "có" thì ghi: rủi ro gì, xử lý thế nào, kiểm chứng bằng cách nào.}}

## Trong phạm vi

- {{Việc sẽ làm đợt này.}}

## Ngoài phạm vi

- {{Việc KHÔNG làm đợt này, và hệ quả người dùng sẽ thấy.}}

## Hỏi đáp (Q&A)

**Q: {{Câu người đọc hay thắc mắc — vd "Sao không làm cách X?"}}**

A: {{Trả lời ngắn.}}

## Phụ lục

### Phân vai quyết định

Người quyết đã chốt: {{...}}.

Agent đã tự quyết: {{...}}.

### Nguồn từng mục

| Mục | Nguồn | Ngày | Đã cân nhắc và bỏ | Rà lại khi |
| --- | --- | --- | --- | --- |
| Hiện trạng | {{người quyết / agent đề xuất, người duyệt / agent tự quyết}} | {{YYYY-MM-DD}} | {{phương án đã bỏ, hoặc —}} | {{điều kiện xem lại}} |
| Mục tiêu | | | | |
| Khoảng cách | | | | |
| Giải pháp | | | | |
| Quyết định sản phẩm | | | | |
| Cách kiểm chứng | | | | |
| Rủi ro & chi phí | | | | |
| Phạm vi | | | | |
