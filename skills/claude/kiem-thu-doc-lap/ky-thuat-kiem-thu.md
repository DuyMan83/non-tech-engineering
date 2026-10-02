# Kỹ thuật kiểm thử

Danh mục cho skill `kiem-thu-doc-lap`. Mọi kỹ thuật ở đây chỉ dựa trên **tài liệu** và **app đang chạy** — không đọc code.
Ví dụ dùng app mẫu "Việc cần làm" (thêm việc, tích xong, xoá việc đã xong; mỗi người chỉ thấy việc của mình).

Mỗi test case ghi rõ **kỹ thuật** đã dùng để thiết kế nó (cột "Kỹ thuật" trong kế hoạch kiểm thử).

---

## A. Hộp đen (black-box) — từ yêu cầu, không cần biết bên trong

### A1. Phân vùng tương đương (Equivalence Partitioning) — `PVTĐ`
Chia đầu vào thành các nhóm mà app **phải xử lý giống nhau**; mỗi nhóm thử 1 giá trị đại diện. Luôn có cả nhóm **hợp lệ** và **không hợp lệ**.
*Ví dụ:* tên việc → {rỗng} · {chỉ khoảng trắng} · {chữ thường hợp lệ} · {có dấu tiếng Việt / emoji} · {quá dài}.

### A2. Giá trị biên (Boundary Value Analysis) — `BIÊN`
Lỗi hay nằm ở **mép** của mỗi nhóm. Thử ngay tại biên, sát dưới, sát trên.
*Ví dụ:* đề xuất ghi "tối đa 200 ký tự" → thử 199, 200, 201; 0 và 1 ký tự; "  a  " (1 ký tự sau khi bỏ khoảng trắng).

### A3. Bảng quyết định (Decision Table) — `BẢNG`
Khi kết quả phụ thuộc **nhiều điều kiện cùng lúc**: liệt kê mọi tổ hợp điều kiện → hành động mong đợi.
*Ví dụ:* nút "Xoá việc đã xong" — {có việc xong? × bấm Xoá hay Huỷ? × có mạng?}.

### A4. Chuyển trạng thái (State Transition) — `TRẠNG THÁI`
Vẽ các **trạng thái** và **sự kiện** chuyển giữa chúng (từ "Luồng" của đề xuất). Thử mọi chuyển hợp lệ và vài chuyển **không được phép**.
*Ví dụ:* việc: (chưa có) → chưa xong → xong → chưa xong → (đã xoá). Thử: xoá việc chưa xong qua nút "Xoá việc đã xong" (không được phép).

### A5. Kịch bản / ca sử dụng (Use Case / Scenario) — `KỊCH BẢN`
Đi trọn một **việc người dùng thật làm**, từ đầu đến cuối, theo cách họ làm (kể cả cách vụng về).
*Ví dụ:* sáng thêm 5 việc, chiều tích 3, tối dọn danh sách, hôm sau mở lại.

### A6. Cặp đôi (Pairwise) — `CẶP`
Nhiều yếu tố, mỗi yếu tố nhiều giá trị → không thử hết được. Chọn bộ test sao cho **mọi cặp giá trị** xuất hiện ít nhất một lần.
*Ví dụ:* {trình duyệt: Chrome/Safari} × {màn hình: điện thoại/máy tính} × {số việc: 0/1/nhiều}.

### A7. Đoán lỗi (Error Guessing) — `ĐOÁN`
Dựa kinh nghiệm về chỗ app hay hỏng: bấm hai lần liên tiếp, bấm khi đang tải, dán chữ rất dài, ký tự đặc biệt `<script>`, `' " \`, mất mạng giữa chừng, tải lại trang giữa thao tác, nút Back của trình duyệt.

---

## B. Hộp xám dựa trên tài liệu (thay cho hộp trắng)

> Hộp trắng đúng nghĩa cần đọc code — **không làm trong skill này**. Thay vào đó dùng **cấu trúc bên trong được mô tả trong tài liệu** (`docs/kien-truc/`, mục "Dữ liệu" và "Luồng" của đề xuất) để thiết kế test, rồi thử từ bên ngoài.

### B1. Ma trận phân quyền — `QUYỀN`
Từ mục "Dữ liệu" của đề xuất ("ai được xem / sửa"), lập bảng **ai × dữ liệu × hành động → được / bị chặn**. Thử mọi ô "bị chặn" từ bên ngoài (2 trình duyệt / 2 tài khoản khác nhau).
*Ví dụ:* người B có thấy, tích, xoá được việc của người A không?

### B2. Vòng đời dữ liệu (CRUD) — `VÒNG ĐỜI`
Mỗi loại dữ liệu: tạo → đọc → sửa → xoá; sau mỗi bước **tải lại trang / mở lại app** xem dữ liệu có còn đúng không (dữ liệu có thật sự được lưu, hay chỉ hiện trên màn hình).

### B3. Luồng dữ liệu theo lớp — `LUỒNG`
Từ "Luồng" của đề xuất và kiến trúc 4 lớp: mỗi bước luồng có thể hỏng ở đâu (giao diện / việc của app / kho dữ liệu / luật bảo mật)? Thiết kế test làm **hỏng từng chỗ từ bên ngoài**: mất mạng (kho dữ liệu), dữ liệu sai (quy tắc nghiệp vụ), người khác (luật bảo mật).

### B4. Độ phủ test tự động (không đọc code test) — `PHỦ`
Chạy `npm run check` và đọc **kết quả** (số ca, tên ca); đối chiếu với "Kiểm tra tự động" của đề xuất và "Ma trận phủ" của kế hoạch. Dòng nghiệm thu nào không thấy ca test tương ứng → ghi thành rủi ro.

---

## C. Dựa trên kinh nghiệm

### C1. Ad-hoc — `ADHOC`
Thử tự do, không kịch bản, để **bắt nhanh lỗi hiển nhiên**. Ngắn (5–10 phút), ghi lại mọi thứ lạ.

### C2. Khám phá có chủ đích (Exploratory, session-based) — `KHÁM PHÁ`
Mỗi phiên có **charter** (một câu: *khám phá <vùng> bằng <cách> để tìm <loại lỗi>*), giới hạn thời gian (15–30 phút), ghi chép: đã thử gì, thấy gì, lỗi, câu hỏi.
*Ví dụ charter:* "Khám phá việc xoá việc đã xong bằng thao tác nhanh / lặp lại để tìm lỗi trạng thái màn hình lệch với dữ liệu."

### C3. Danh sách kiểm (Checklist) — `CHECKLIST`
Các điểm luôn kiểm ở mọi app: chữ tiếng Việt hiển thị đúng; nút có chữ rõ nghĩa; thông báo lỗi bằng lời thường; màn hình điện thoại không tràn ngang; dùng được bằng bàn phím (Tab / Enter); màu chữ đọc được ở chế độ tối.

---

## D. Dựa trên rủi ro (Risk-based) — `RỦI RO`

1. Liệt kê rủi ro từ: "Rủi ro & chi phí" của đề xuất, "Rủi ro và đường lùi" của kế hoạch, và đoán lỗi (A7).
2. Chấm **Khả năng** (1–3) × **Ảnh hưởng** (1–3) → điểm 1–9.
   Ảnh hưởng 3 = mất / lộ dữ liệu, sai tiền, người dùng kẹt không làm tiếp được.
3. Điểm cao test **trước và kỹ hơn** (nhiều kỹ thuật); điểm thấp chỉ smoke / checklist.
4. Kết quả báo theo rủi ro: rủi ro nào đã được kiểm, rủi ro nào còn mở.

---

## E. Phi chức năng (nhẹ, từ bên ngoài)

| Mã | Kiểm | Cách |
|---|---|---|
| `DÙNG` | Dễ dùng với người non-tech | Người lần đầu dùng có làm được việc chính không cần hướng dẫn? Chữ có hiểu được? |
| `TRUY CẬP` | Khả năng tiếp cận cơ bản | Bàn phím, nhãn cho ô nhập, độ tương phản |
| `MÀN HÌNH` | Nhiều cỡ màn hình | Điện thoại (≈ 390px), máy tính bảng, máy tính |
| `CHỊU LỖI` | Mất mạng, chậm mạng | Bật chế độ offline của trình duyệt giữa thao tác, rồi bật lại |
| `TỐC ĐỘ` | Cảm nhận tốc độ | Thao tác chính phản hồi dưới ~1 giây trên máy thường? |
| `AN TOÀN NGOÀI` | Bảo mật nhìn từ ngoài | Ô nhập không chạy được mã (`<script>`); không thấy dữ liệu người khác (B1) |

---

## F. Theo mục đích / thời điểm

| Mã | Loại | Khi nào |
|---|---|---|
| `SMOKE` | Kiểm khói | Đầu mỗi phiên: app mở được, việc chính chạy — không qua thì dừng, không test tiếp |
| `XÁC NHẬN` | Confirmation / retest | Sau khi lỗi được sửa: chạy lại **đúng** ca đã phát hiện lỗi |
| `HỒI QUY` | Regression | Sau mỗi thay đổi: các tính năng cũ (từ `docs/de-xuat/` "Đã xong") vẫn chạy |
| `UAT` | Nghiệm thu người dùng | Người dùng tự làm checklist "Người dùng tự thử" của đề xuất trên app; **họ** quyết "đạt / chưa đạt" |
