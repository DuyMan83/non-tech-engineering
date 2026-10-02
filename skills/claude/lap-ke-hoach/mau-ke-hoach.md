# Kế hoạch — {{tên đề xuất}}

## Nguồn

Đề xuất: [`{{docs/de-xuat/YYYY-MM-DD-ten.md}}`]({{đường dẫn tương đối}}).

{{Chạm phần nào của app (màn hình nào, dữ liệu nào). Không chạm phần nào.}}

## Đánh số nghiệm thu

Lấy từ mục "Cách kiểm chứng" của đề xuất, giữ đúng thứ tự.

| Mã | Dòng nghiệm thu (rút gọn) |
| --- | --- |
| NT1 | {{dòng 1 của "Người dùng tự thử"}} |
| TD1 | {{dòng 1 của "Kiểm tra tự động"}} |

## Các chặng

Chặng 1 — {{người dùng làm được gì, viết như tên một việc}}
  Làm được:   {{những gì người dùng thấy và dùng được sau chặng này}}
  Chưa có:    {{những gì người dùng sẽ để ý là còn thiếu}}
  Bạn tự thử: {{các bước người dùng tự làm để biết chặng xong — chỉ những gì nhìn/bấm được}}
  Máy tự kiểm: {{tóm tắt test tự động phải xanh — người dùng chỉ cần nghe "đã kiểm tra, mọi thứ ổn"}}

## Thứ tự và điểm dừng

{{Chặng nào chặn chặng nào, vì sao.}}

Điểm dừng: {{sau chặng nào người dùng tự thử; thấy gì thì không làm tiếp mà quay lại bàn.}}

## Rủi ro và đường lùi

- Rủi ro: {{điều có thể hỏng}}
  Triệu chứng: {{người dùng / AI thấy gì khi nó xảy ra}}
  Ngưỡng: {{tới mức nào thì coi là hỏng}}
  Kiểm bằng: {{test tự động nào bắt nó; hoặc "chỉ thử tay được" + lý do}}
  Lùi về: {{làm gì nếu hỏng}}

## Chiến lược kiểm thử

### Ai kiểm cái gì

| Người dùng tự thử (chỉ những gì cần mắt và cảm giác) | Máy tự kiểm (mọi thứ người dùng không tự thử được) |
| --- | --- |
| {{vd giao diện trông đúng, thao tác thuận tay}} | {{vd quyền dữ liệu, mất mạng, lỗi giữa chừng, bấm hai lần, dữ liệu người khác, trường hợp biên}} |

### Danh sách test, xếp theo ưu tiên

Ưu tiên: **1** rủi ro cao → **2** tích hợp (việc của app chạy qua dữ liệu thật trên bộ giả lập) → **3** luật bảo mật → **4** unit cho trường hợp rủi ro → **5** giao diện. Không viết test cho code hiển nhiên.

| # | Loại | Kiểm điều gì (lời thường) | Rủi ro / nghiệm thu | File | Chặng |
| --- | --- | --- | --- | --- | --- |
| 1 | {{tích hợp / luật / unit / giao diện}} | {{...}} | {{R1, NT2, TD1...}} | `{{tests/... hoặc src/.../*.test.ts}}` | {{1}} |

### Ma trận phủ nghiệm thu

Mỗi dòng nghiệm thu phải có **ít nhất một test tự động**, trừ khi chỉ kiểm được bằng mắt — khi đó ghi rõ lý do.

| Mã | Test tự động (# ở bảng trên) | Người dùng thử ở chặng | Ghi chú |
| --- | --- | --- | --- |
| NT1 | {{#1, #3 hoặc "chỉ thử tay: ..."}} | {{1}} | |
| TD1 | {{#2}} | — | |

## Bước kỹ thuật

Theo thứ tự "Thêm một tính năng" trong `docs/kien-truc/clean-rules.md`. Viết test **trước hoặc cùng lúc** với code.

### Chặng 1 — {{tên}}

1. {{lớp — việc — test đi kèm (# ở bảng)}}
2. `npm run check` xanh.
3. {{AI tự chạy app, đi hết "Bạn tự thử" của chặng, chụp màn hình gửi người dùng.}}
4. Dừng — người dùng tự thử.

## Ghi chép trong lúc làm

{{Ghi theo ngày: "**YYYY-MM-DD, chặng N ...**" — đã làm gì, số test trước/sau, lệch kế hoạch ở đâu, lỗi tìm ra và cách sửa, việc còn treo.}}

## Nguồn từng mục

| Mục | Nguồn | Ngày | Đã cân nhắc và bỏ | Rà lại khi |
| --- | --- | --- | --- | --- |
| Các chặng | {{người quyết / agent đề xuất, người duyệt / agent tự quyết}} | {{YYYY-MM-DD}} | | |
| Thứ tự và điểm dừng | | | | |
| Rủi ro và đường lùi | | | | |
| Chiến lược kiểm thử | | | | |
| Bước kỹ thuật | | | | |
