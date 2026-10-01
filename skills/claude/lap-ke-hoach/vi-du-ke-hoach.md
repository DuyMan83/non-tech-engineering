# Kế hoạch — Xoá hết việc đã xong bằng một nút

## Nguồn

Đề xuất: [`docs/de-xuat/2026-10-01-xoa-viec-da-xong.md`](../de-xuat/2026-10-01-xoa-viec-da-xong.md).

Chạm màn danh sách việc và việc xoá dữ liệu trong kho. Không chạm đăng nhập, không đổi luật bảo mật (luật xoá đã có).

## Đánh số nghiệm thu

| Mã | Dòng nghiệm thu (rút gọn) |
| --- | --- |
| NT1 | 3 việc, tích xong 2 → hiện "Xoá 2 việc đã xong" |
| NT2 | Bấm nút rồi Huỷ → không đổi gì |
| NT3 | Bấm nút rồi Xoá → còn 1 việc; tải lại vẫn 1 việc |
| NT4 | Không có việc đã xong → không thấy nút |
| NT5 | Thêm / tích / bỏ tích vẫn như trước |
| TD1 | Chọn đúng các việc đã xong, không đụng việc chưa xong |
| TD2 | Chỉ xoá việc của người đang dùng; không có việc đã xong thì không làm gì |
| TD3 | Người khác / chưa đăng nhập không xoá được |

## Các chặng

Chặng 1 — Bạn dọn được danh sách bằng một nút
  Làm được:   nút "Xoá N việc đã xong" ở cuối danh sách, hỏi xác nhận, xoá hẳn; mất mạng giữa chừng thì báo lỗi và danh sách hiện đúng những gì còn lại
  Chưa có:    xoá từng việc; lấy lại việc đã xoá (ngoài phạm vi đề xuất)
  Bạn tự thử: tạo 3 việc, tích xong 2 → thấy nút ghi "2"; bấm rồi Huỷ; bấm rồi Xoá; tải lại trang; tích/bỏ tích một việc
  Máy tự kiểm: xoá đúng việc, đúng người, mất mạng giữa chừng, người khác không xoá được, bấm hai lần không xoá hai lần

## Thứ tự và điểm dừng

Một chặng là đủ — việc nhỏ, mọi phần nằm trên một màn.

Điểm dừng: sau chặng 1 người dùng tự thử. Thấy nút khó tìm hoặc hỏi xác nhận gây khó chịu → quay lại đề xuất.

## Rủi ro và đường lùi

- Rủi ro R1: xoá nhầm việc chưa xong.
  Triệu chứng: sau khi xoá, mất việc chưa tích.
  Ngưỡng: một lần là hỏng.
  Kiểm bằng: test #1 (tích hợp), #4 (unit).
  Lùi về: ẩn nút cho tới khi sửa.

- Rủi ro R2: mất mạng giữa chừng, xoá được một nửa, màn hình hiện sai.
  Triệu chứng: danh sách trên màn khác với sau khi tải lại.
  Ngưỡng: khác dù một việc.
  Kiểm bằng: test #2 (tích hợp, giả lỗi ở việc thứ hai).
  Lùi về: luôn tải lại danh sách từ kho sau khi xoá, kể cả khi lỗi.

- Rủi ro R3: bấm nút hai lần liền thì gửi hai lượt xoá.
  Triệu chứng: báo lỗi lạ ở lần thứ hai.
  Ngưỡng: có báo lỗi khi người dùng chỉ bấm nhanh.
  Kiểm bằng: test #5 (giao diện: nút khoá trong lúc đang xoá).
  Lùi về: khoá nút khi đang xoá.

## Chiến lược kiểm thử

### Ai kiểm cái gì

| Người dùng tự thử | Máy tự kiểm |
| --- | --- |
| Nút ở chỗ dễ thấy, chữ dễ hiểu, hỏi xác nhận rõ ràng; cảm giác dùng | Xoá đúng việc, đúng người; mất mạng giữa chừng; người khác không xoá được; bấm hai lần; không có việc đã xong |

### Danh sách test, xếp theo ưu tiên

| # | Loại | Kiểm điều gì (lời thường) | Rủi ro / nghiệm thu | File | Chặng |
| --- | --- | --- | --- | --- | --- |
| 1 | tích hợp | Có việc xong và chưa xong của 2 người; xoá việc đã xong của Alice → chỉ việc đã xong của Alice biến mất | R1, NT3, TD2 | `tests/tasks.integration.test.ts` | 1 |
| 2 | tích hợp | Kho lỗi ở việc thứ hai → báo lỗi; danh sách tải lại đúng phần còn lại; bấm lại thì xoá nốt | R2 | `tests/tasks.integration.test.ts` | 1 |
| 3 | luật | Bob không xoá được việc của Alice; chưa đăng nhập không xoá được | TD3 | `tests/firestore.rules.test.ts` | 1 |
| 4 | unit | Chọn việc đã xong: danh sách trộn, toàn chưa xong, rỗng | R1, TD1, NT4 | `src/domain/task.test.ts` | 1 |
| 5 | unit | Không có việc đã xong → không gọi xoá | TD2 | `src/services/tasks.test.ts` | 1 |
| 6 | giao diện | AI mở app trên trình duyệt: nút hiện đúng số, Huỷ không đổi gì, Xoá xong tải lại vẫn đúng, nút khoá khi đang xoá | NT1–NT5, R3 | chạy tay bằng trình duyệt tự động, chụp màn hình | 1 |

### Ma trận phủ nghiệm thu

| Mã | Test tự động | Người dùng thử ở chặng | Ghi chú |
| --- | --- | --- | --- |
| NT1 | #6 | 1 | Số trên nút |
| NT2 | #6 | 1 | |
| NT3 | #1, #6 | 1 | |
| NT4 | #4, #6 | 1 | |
| NT5 | các test hiện có của thêm / tích việc | 1 | Không viết test mới |
| TD1 | #4 | — | |
| TD2 | #1, #5 | — | |
| TD3 | #3 | — | |

## Bước kỹ thuật

### Chặng 1 — Bạn dọn được danh sách bằng một nút

1. `domain`: hàm chọn việc đã xong — test #4.
2. `services`: thêm "xoá việc của tôi" vào hợp đồng kho dữ liệu; use case "xoá việc đã xong" — test #5.
3. `data`: Firestore xoá từng việc — test #1, #2.
4. Luật: thêm ca vào test luật — test #3.
5. `ui`: nút + hộp xác nhận, khoá nút khi đang xoá, tải lại danh sách sau khi xoá.
6. `npm run check` xanh.
7. AI chạy app, đi hết "Bạn tự thử" (test #6), chụp màn hình gửi người dùng.
8. Dừng — người dùng tự thử.

## Ghi chép trong lúc làm

(Chưa bắt đầu.)

## Nguồn từng mục

| Mục | Nguồn | Ngày | Đã cân nhắc và bỏ | Rà lại khi |
| --- | --- | --- | --- | --- |
| Các chặng | agent đề xuất, người duyệt | 2026-10-01 | Hai chặng (nút trước, xác nhận sau) — mỗi chặng quá mỏng để thử | Đề xuất thêm xoá từng việc |
| Thứ tự và điểm dừng | agent đề xuất, người duyệt | 2026-10-01 | — | — |
| Rủi ro và đường lùi | agent tự quyết | 2026-10-01 | — | Người dùng gặp xoá nhầm |
| Chiến lược kiểm thử | agent tự quyết | 2026-10-01 | Test giao diện bằng thư viện riêng — khung chưa có; dùng trình duyệt tự động do AI chạy | Khung có test giao diện tự động |
| Bước kỹ thuật | agent tự quyết | 2026-10-01 | — | Đề xuất đổi |
