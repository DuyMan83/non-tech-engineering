# Rules chung: clean architecture đơn giản

Áp dụng cho **mọi kiến trúc** trong `docs/architectures/` (web và mobile).
Mỗi kiến trúc có `rules.md` riêng, chỉ ghi phần khác biệt và trỏ về file này.

**Viết cho AI đọc.** Người dùng non-tech không cần hiểu file này; AI phải giữ đúng các rules và chỉ báo kết quả bằng lời thường.

## Mục tiêu

1. **Sửa một chỗ không làm vỡ chỗ khác** — mỗi phần code có ranh giới rõ.
2. **AI tự kiểm tra được** — không cần người dùng đọc code.
3. **Ít lớp nhất có thể** — 4 lớp, không hơn.

## 4 lớp

```
src/
├── app/         # Màn hình / trang (routing). Mỏng: chỉ ghép component từ ui/
├── ui/          # Component giao diện. Chỉ gọi services/
├── services/    # Các "việc" app làm (use case). Mỗi việc 1 file
├── domain/      # Quy tắc nghiệp vụ thuần: kiểu dữ liệu, tính toán, kiểm tra hợp lệ
└── data/        # Chỗ DUY NHẤT nói chuyện với Firebase / dịch vụ bên ngoài
```

Chiều phụ thuộc chỉ đi vào trong:

```
app → ui → services → domain
                ↑
              data   (data làm theo interface do services định ra)
```

## A. Ranh giới (quan trọng nhất)

1. **`domain/`** không import gì từ thư mục khác trong `src/`, không import React, Firebase hay thư viện giao diện. Chỉ là TypeScript thuần.
2. **`services/`** chỉ import `domain/`. Cần đọc/ghi dữ liệu → định nghĩa **interface** (ví dụ `BookingRepository`) trong `services/` và nhận nó qua tham số. Không import React, Firebase.
3. **`data/`** là chỗ **duy nhất** import Firebase (hoặc SDK bên ngoài khác). Nó *implement* các interface trong `services/`. Được import `domain/` và `services/` (để lấy interface).
4. **`ui/`** chỉ gọi `services/` (và dùng kiểu từ `domain/`). Không gọi Firebase, không viết quy tắc nghiệp vụ trong component.
5. **`app/`** chỉ chứa màn hình/trang: ghép component từ `ui/`, đọc tham số đường dẫn. Không logic, không gọi Firebase.
6. **Nối các lớp** (tạo repository từ `data/`, truyền vào `services/`) ở **một file duy nhất**: `src/composition.ts`.
7. Ranh giới được **ESLint chặn tự động** (`no-restricted-imports` theo từng thư mục). Import sai lớp = `npm run check` báo lỗi.

## B. Quy ước

8. Code (tên file, hàm, biến) bằng **tiếng Anh**. Chú thích ngắn và sổ tay dự án bằng **tiếng Việt**.
9. Mỗi use case là **1 file** trong `services/`, tên là động từ: `createBooking.ts`, `cancelBooking.ts`. Export đúng 1 hàm chính.
10. File quá ~200 dòng → tách.
11. **TypeScript strict.** Không dùng `any`, không `// @ts-ignore` khi chưa hỏi người dùng.
12. **Không thêm thư viện** khi chưa hỏi người dùng (nói bằng lời thường: thêm để làm gì, có tốn tiền không) và ghi lý do vào `AGENTS.md` của dự án.
13. **Không nâng cấp phiên bản framework** (Next.js, React Native, React, Firebase SDK) khi chưa hỏi.

## C. Kiểm tra (để AI tự xác nhận)

14. `domain/` và `services/` **bắt buộc có test**. Test `services/` dùng repository giả (in-memory), **không cần Firebase thật**.
15. Có **đúng 1 lệnh**: `npm run check`, chạy lần lượt: kiểm tra kiểu (`tsc --noEmit`) → ESLint (ranh giới) → test → test luật bảo mật Firestore (Emulator).
16. **Chạy `npm run check` và thấy pass trước khi** báo "xong" hoặc lưu điểm. Fail → sửa, không lưu điểm hỏng.
17. **Không được làm yếu kiểm tra** để cho pass: không tắt rule ESLint, không xoá/skip test, không nới `tsconfig`. Cần thay đổi → hỏi người dùng, giải thích lý do.

## D. Dữ liệu và bảo mật

18. **`firestore.rules` không bao giờ để mở** (`allow read, write: if true`). Mặc định chặn hết, mở từng collection theo nhu cầu.
19. **Mỗi collection mới phải có luật đi kèm và có test** (chạy trên Firebase Emulator, nằm trong `npm run check`).
20. Cấu hình Firebase phía client (apiKey, projectId...) **không phải bí mật** nhưng vẫn để ngoài code: `.env.local` (web) hoặc file cấu hình native (mobile), có file mẫu đi kèm. Bảo mật thật nằm ở **luật Firestore**.
21. **Bí mật thật** (service account, private key, key API trả phí) **không bao giờ** nằm trong code client hay trong repo.
22. Mặc định dùng **gói Spark miễn phí**. Tính năng cần gói Blaze (Cloud Functions, App Hosting...) → hỏi người dùng trước, nói rõ chi phí.

## E. Sổ tay dự án

23. Mỗi dự án có `AGENTS.md` ở gốc (và `CLAUDE.md` chứa `@AGENTS.md`), ghi:
    - App làm gì, cho ai (lời thường).
    - Kiến trúc đang dùng (trỏ tới `rules.md` tương ứng).
    - Danh sách use case (`services/`) và collection Firestore.
    - Các quyết định đã chốt + lý do (thư viện thêm vào, đổi hướng...).
    - Đang dở ở đâu, bước tiếp theo.
24. Cập nhật `AGENTS.md` **sau mỗi thay đổi lớn**, trước khi lưu điểm.

## Thêm một tính năng — thứ tự làm

1. `domain/`: thêm/sửa kiểu dữ liệu và quy tắc + test.
2. `services/`: thêm file use case (+ interface repository nếu cần) + test với repository giả.
3. `data/`: implement repository bằng Firebase + cập nhật `firestore.rules` + test luật.
4. `src/composition.ts`: nối.
5. `ui/` rồi `app/`: giao diện.
6. `npm run check` pass → cho người dùng xem kết quả thật → họ ưng → cập nhật `AGENTS.md` → lưu điểm.
