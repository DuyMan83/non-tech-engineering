# Xoá hết việc đã xong bằng một nút

## Hiện trạng (Problem)

Khảo sát ngày 2026-10-01, trên app mẫu "Việc cần làm" (khung dự án web).

Người dùng ghi việc mỗi ngày và tích xong khi làm xong. Sau một tuần, danh sách dài gấp đôi vì việc đã xong vẫn nằm đó, gạch ngang. Muốn nhìn nhanh còn việc gì thì phải lướt qua cả đống việc cũ. App chưa có cách nào bỏ chúng đi.

## Mục tiêu (Objective)

Người dùng bấm một nút "Xoá việc đã xong" ở cuối danh sách, xác nhận một lần, và danh sách chỉ còn việc chưa xong. Mở lại app vẫn thấy như vậy.

## Khoảng cách (Gap)

Khảo sát ngày 2026-10-01.

- Chưa có nút hay cách nào để xoá việc.
- Luật bảo mật dữ liệu đã cho chủ việc xoá việc của mình, nhưng app chưa dùng tới.
- Việc đã xong đã được xếp xuống cuối danh sách, nên nút đặt ở cuối là tự nhiên.

## Giải pháp (Solution)

### Người dùng sẽ thấy gì

- **Có việc đã xong.** Cuối danh sách hiện nút "Xoá N việc đã xong".
- **Bấm nút.** App hỏi "Xoá N việc đã xong? Không lấy lại được." — bấm Xoá thì các việc đó biến mất; bấm Huỷ thì không có gì đổi.
- **Không có việc nào đã xong.** Không hiện nút.
- **Mất mạng giữa chừng.** Báo "Chưa xoá được, thử lại sau"; danh sách giữ nguyên, không mất việc chưa xong.

### Thay đổi ở đâu (nhìn từ người dùng)

**Thành phần**

| Thành phần | Mới hay sửa | Thay đổi |
| --- | --- | --- |
| Nút "Xoá N việc đã xong" | Mới | Cuối danh sách, chỉ hiện khi có việc đã xong |
| Hộp hỏi xác nhận | Mới | Hiện khi bấm nút |
| Danh sách việc | Sửa | Bỏ các việc vừa xoá |

**Dữ liệu**

Không thêm dữ liệu nào được lưu. Việc đã xong bị xoá hẳn khỏi kho dữ liệu trên mạng (Firestore). Chỉ chủ việc xoá được việc của mình — luật này đã có.

**Luồng**

1. Người dùng bấm "Xoá N việc đã xong" rồi bấm Xoá.
2. App lấy đúng các việc đã xong của người đó.
3. Xoá từng việc trong kho dữ liệu.
4. Danh sách chỉ còn việc chưa xong.

### Quyết định sản phẩm

- Xoá hẳn, không có thùng rác — app nhỏ, giữ đơn giản. Bù lại có hỏi xác nhận.
- Chỉ xoá việc đã xong, không có nút xoá từng việc ở đợt này.
- Nút ghi rõ số việc sẽ xoá để người dùng biết trước.

### Cách kiểm chứng (Acceptance)

#### Người dùng tự thử

- [ ] Có 3 việc, tích xong 2: cuối danh sách hiện "Xoá 2 việc đã xong".
- [ ] Bấm nút rồi Huỷ: không có gì đổi.
- [ ] Bấm nút rồi Xoá: còn 1 việc chưa xong; tải lại trang vẫn còn đúng 1 việc.
- [ ] Không có việc nào đã xong: không thấy nút.
- [ ] Thêm việc, tích xong, bỏ tích vẫn chạy như trước.

#### Kiểm tra tự động (`npm run check`)

- Chọn ra đúng các việc đã xong, không đụng việc chưa xong — `src/domain/task.test.ts`.
- Xoá việc đã xong chỉ xoá việc của người đang dùng; không có việc đã xong thì không làm gì — `src/services/tasks.test.ts`.
- Người khác không xoá được việc của mình; chưa đăng nhập không xoá được — `tests/firestore.rules.test.ts`.

## Rủi ro & chi phí

Không tốn tiền thật · không có dữ liệu cá nhân mới · không đổi phân quyền.

**Mất mạng giữa chừng:** có thể xoá được một phần. Danh sách tải lại từ kho dữ liệu sau khi báo lỗi, nên người dùng thấy đúng những gì còn lại; bấm lại nút thì xoá nốt. Kiểm chứng: test tự động cho trường hợp xoá lỗi ở việc thứ hai.

## Trong phạm vi

- Nút "Xoá N việc đã xong" và hộp xác nhận trên app web.

## Ngoài phạm vi

- Xoá từng việc một — người dùng muốn xoá một việc chưa xong thì chưa làm được.
- Thùng rác / khôi phục việc đã xoá.

## Hỏi đáp (Q&A)

**Q: Sao không tự xoá việc đã xong sau vài ngày?**

A: Người dùng có thể muốn xem lại việc đã làm trong tuần. Để họ tự quyết khi nào dọn.

## Phụ lục

### Phân vai quyết định

Người quyết đã chốt: vấn đề danh sách dài vì việc đã xong; xoá hẳn, có hỏi xác nhận; chưa làm xoá từng việc.

Agent đã tự quyết: vị trí nút ở cuối danh sách, chữ trên nút có số việc, cách xử lý mất mạng giữa chừng, và các test.

### Nguồn từng mục

| Mục | Nguồn | Ngày | Đã cân nhắc và bỏ | Rà lại khi |
| --- | --- | --- | --- | --- |
| Hiện trạng | người quyết | 2026-10-01 | — | Người dùng phàn nàn chuyện khác |
| Mục tiêu | agent đề xuất, người duyệt | 2026-10-01 | — | Hiện trạng đổi |
| Khoảng cách | agent tự quyết | 2026-10-01 | — | Màn danh sách đổi bố cục |
| Giải pháp | người quyết | 2026-10-01 | Tự xoá sau 7 ngày; thùng rác | Người dùng lỡ xoá nhầm và cần lấy lại |
| Quyết định sản phẩm | agent đề xuất, người duyệt | 2026-10-01 | Nút xoá trên từng việc | Có nhu cầu xoá việc chưa xong |
| Cách kiểm chứng | agent đề xuất, người duyệt | 2026-10-01 | — | Giải pháp đổi |
| Rủi ro & chi phí | agent tự quyết | 2026-10-01 | — | Có thêm dữ liệu cá nhân |
| Phạm vi | người quyết | 2026-10-01 | — | — |
