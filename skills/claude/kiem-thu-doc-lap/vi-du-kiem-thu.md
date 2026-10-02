# Kiểm thử — Xoá hết việc đã xong bằng một nút

## Phạm vi

- **Đối tượng:** tính năng "Xoá hết việc đã xong" (đề xuất `docs/de-xuat/2026-10-01-xoa-viec-da-xong.md`, trạng thái Đã xong) + hồi quy thêm / tích việc.
- **Môi trường:** dev — bộ giả lập trên máy (`npm start`), trình duyệt tự động, khung 420px và 360px.
- **Ngày:** 2026-10-02
- **Tài liệu đã đọc:** AGENTS.md, đề xuất, kế hoạch, docs/kien-truc/.
- **Không đọc code.** ⚠ Kiểm thử bởi phiên đã viết code của tính năng này — tính độc lập hạn chế (thiết kế test vẫn chỉ dựa trên tài liệu).
- **Ngoài phạm vi:** bản thật (chưa triển khai), trình duyệt Safari, điện thoại thật.

## Mô hình từ tài liệu (hộp xám)

**Quy tắc:** nút "Xoá N việc đã xong" chỉ hiện khi có việc xong; hỏi xác nhận; xoá hẳn; mất mạng → báo "Chưa xoá được, thử lại sau", danh sách giữ đúng phần còn lại.

**Ma trận quyền:**

| Ai | Dữ liệu | Xem | Thêm | Sửa (tích) | Xoá |
|---|---|---|---|---|---|
| Chủ việc | việc của mình | ✔ | ✔ | ✔ | ✔ |
| Người khác | việc của chủ | ✘ | ✘ | ✘ | ✘ |

**Trạng thái:** (chưa có) → chưa xong ⇄ xong → (đã xoá, chỉ từ "xong").

**Luồng:** bấm nút → xác nhận → app lấy việc đã xong của người đó → xoá từng việc trong kho → danh sách chỉ còn việc chưa xong.

**Câu hỏi về tài liệu:**
- Q1. Đề xuất không ghi giới hạn tên việc (độ dài, toàn khoảng trắng). App đang chặn ở 200 ký tự và chặn tên rỗng — nên ghi vào tài liệu để kiểm thử và người dùng biết.

## Rủi ro (risk-based)

| # | Rủi ro | Nguồn | Khả năng | Ảnh hưởng | Điểm | Mức kiểm |
|---|---|---|---|---|---|---|
| R1 | Xoá / thấy việc của người khác | ma trận quyền | 1 | 3 | 3 | vừa |
| R2 | Mất mạng giữa chừng: màn hình sai / mất việc chưa xong | đề xuất "Rủi ro & chi phí" | 3 | 3 | 9 | **kỹ** |
| R3 | Bấm nút xoá hai lần | kế hoạch R3 | 2 | 2 | 4 | vừa |
| R4 | Đầu vào biên / lạ khi thêm việc | đoán lỗi | 2 | 2 | 4 | vừa |
| R5 | Số trên nút / trạng thái lệch dữ liệu sau tải lại | vòng đời | 2 | 2 | 4 | vừa |
| R6 | Vỡ giao diện điện thoại, không dùng được bằng bàn phím | checklist | 1 | 2 | 2 | smoke |

## Test case

| ID | Rủi ro | Kỹ thuật | Hộp | Bước | Mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| TC1a | R4 | PVTĐ | đen | Thêm việc tên rỗng; toàn khoảng trắng | Báo lỗi, không thêm | ✔ "Tên việc không được để trống." |
| TC1b | R4 | BIÊN | đen | Tên 200 ký tự; 201 ký tự | 200 thêm được; 201 bị chặn có thông báo | ✔ (giới hạn không có trong tài liệu — Q1) |
| TC1c | R4 | PVTĐ | đen | Tên có dấu, emoji, gạch dài | Hiển thị đúng | ✔ |
| TC2 | R4 | ĐOÁN, AN TOÀN NGOÀI | đen | Tên `<img onerror=alert(1)><script>…` | Hiện như chữ, không chạy | ✔ không có hộp thoại nào bật lên |
| TC3 | R1 | QUYỀN | xám | A và B (2 cửa sổ). B tải lại; B xoá việc đã xong của B; A tải lại | B không thấy việc A; việc A còn nguyên | ✔ |
| TC4 | R5 | VÒNG ĐỜI | xám | Thêm 3, tích 1, tải lại | Còn đủ 3, đúng trạng thái, nút "Xoá 1 việc đã xong" | ✔ |
| TC5 | R5 | TRẠNG THÁI | xám | Tích 2 → bỏ tích 1 | Nút đổi "Xoá 2…" → "Xoá 1…" | ✔ |
| TC6 | R3 | ĐOÁN | đen | Bấm đúp nút xoá | 1 hộp xác nhận, xoá đúng 1 lần, không lỗi | ✔ |
| TC7a | R2 | LUỒNG, CHỊU LỖI | xám | Có 1 việc xong; tắt mạng; bấm xoá → đồng ý | Báo "Chưa xoá được, thử lại sau"; danh sách đúng phần còn lại | **✘ L1** |
| TC7b | R2 | CHỊU LỖI | đen | Vẫn mất mạng, thêm việc mới | Báo lỗi hoặc cho biết đang chờ mạng | **✘ L2** |
| TC7c | R2 | VÒNG ĐỜI | xám | Bật mạng lại; tải lại trang | Dữ liệu cuối cùng đúng | ✔ m1 đã xoá, m3 đã thêm, m2 còn |
| TC8 | R6 | MÀN HÌNH | đen | Khung 360px, việc tên rất dài | Không tràn ngang | ✔ |
| TC9 | R6 | TRUY CẬP | đen | Thêm việc bằng phím Enter | Thêm được | ✔ |
| H1 | — | HỒI QUY | đen | Thêm / tích / bỏ tích | Như trước | ✔ (trong TC4, TC5) |

## Phiên khám phá

**Phiên 1** — Charter: *Khám phá thao tác khi mất mạng bằng cách tắt / bật mạng giữa các thao tác để tìm chỗ màn hình lệch với dữ liệu hoặc người dùng không biết chuyện gì xảy ra.* 15 phút.
- Đã thử: xoá khi mất mạng; thêm khi mất mạng; bật mạng lại; tải lại.
- Thấy: mọi thao tác khi mất mạng **không báo gì** — nút kẹt "Đang xoá...", việc mới không hiện, chữ vẫn nằm trong ô nhập. Có mạng lại thì mọi thứ tự hoàn tất và dữ liệu cuối cùng đúng.
- Lỗi: L1, L2.
- Câu hỏi mở: Q2. Khi mất mạng, sản phẩm muốn **chờ rồi tự làm tiếp** (như đang xảy ra) hay **báo lỗi ngay** (như đề xuất viết)? Hai cách đều hợp lý — người dùng quyết.

## Kiểm tra tự động hiện có (`PHỦ`)

`npm run check`: xanh. Các dòng "Kiểm tra tự động" của đề xuất đều có ca test cùng tên ý. **Khoảng trống:** test "mất mạng giữa chừng" trong kế hoạch giả lập *kho dữ liệu báo lỗi*, nhưng mất mạng thật thì app **không nhận lỗi mà chờ** (TC7a) — test tự động xanh trong khi hành vi thật khác đề xuất.

## Lỗi tìm thấy

### L1 — Mất mạng khi bấm "Xoá việc đã xong" thì nút kẹt "Đang xoá..." và không báo gì
- **Mức:** Cao — trái với đề xuất; người dùng không biết đã xoá hay chưa, không làm tiếp được với danh sách đó tới khi có mạng.
- **Rủi ro / test case:** R2 / TC7a
- **Bước tái hiện:** 1. Thêm 2 việc, tích xong 1. 2. Tắt mạng (chế độ máy bay / offline). 3. Bấm "Xoá 1 việc đã xong" → Đồng ý.
- **Mong đợi:** báo "Chưa xoá được, thử lại sau"; danh sách hiện đúng phần còn lại.
- **Thực tế:** nút đổi thành "Đang xoá..." và đứng đó; không thông báo; danh sách không đổi. Bật mạng lại → việc được xoá.
- **Tái hiện được:** luôn (3/3).
- **Bằng chứng:** `anh/tc7-mat-mang.png` (sau khi có mạng lại).

### L2 — Mất mạng khi thêm việc thì không có phản hồi nào
- **Mức:** Vừa — người dùng có thể bấm "Thêm" nhiều lần, tưởng app hỏng; khi có mạng lại việc vẫn được thêm.
- **Rủi ro / test case:** R2 / TC7b
- **Bước tái hiện:** 1. Tắt mạng. 2. Gõ tên việc, bấm "Thêm".
- **Mong đợi:** thông báo (lỗi hoặc "đang chờ mạng").
- **Thực tế:** không có gì xảy ra; chữ vẫn trong ô; việc không hiện. Có mạng lại → việc hiện ra.
- **Tái hiện được:** luôn (3/3).

## UAT — nghiệm thu của người dùng

| # | Việc người dùng thử | Người dùng nói |
|---|---|---|
| U1 | Có 3 việc, tích xong 2 → thấy "Xoá 2 việc đã xong" | *chưa chạy — chờ người dùng* |
| U2 | Bấm nút rồi Huỷ → không đổi gì | *chưa chạy* |
| U3 | Bấm nút rồi Xoá → còn 1 việc; tải lại vẫn 1 | *chưa chạy* |
| U4 | Không có việc đã xong → không thấy nút | *chưa chạy* |
| U5 | Thêm, tích, bỏ tích như trước | *chưa chạy* |
| U6 | (mới) Tắt Wi-Fi, bấm xoá — bạn thấy app nên làm gì? (trả lời Q2) | *chưa chạy* |

Kết luận UAT: **chưa có** — lần chạy thử skill trên cloud không có người dùng thật.

## Kết luận

- **Rủi ro đã kiểm:** R1, R3, R4, R5, R6 — đạt. **R2 (điểm 9) — không đạt** (L1, L2).
- **Lỗi:** 2 (Cao 1, Vừa 1) — đều đang mở. Câu hỏi tài liệu: Q1, Q2.
- **Khuyến nghị:** **Chưa nên triển khai.** Người dùng trả lời Q2 trước (chờ mạng hay báo lỗi), rồi sửa L1 (và L2 nếu chọn báo lỗi) qua `thuc-thi-ke-hoach` — viết test tái hiện mất mạng thật trước khi sửa.
