---
name: lap-ke-hoach
description: Lập kế hoạch làm một đề xuất đã được duyệt - chia thành các chặng người dùng tự kiểm tra được, liệt kê rủi ro và đường lùi, và chiến lược kiểm thử dựa trên rủi ro (máy tự kiểm mọi thứ người dùng không tự thử được, ưu tiên test tích hợp, mọi dòng nghiệm thu đều có test). Dùng sau skill de-xuat-tinh-nang, khi người dùng nói "làm đi", "bắt đầu làm đề xuất này", "lên kế hoạch làm", hoặc trước khi code một tính năng có đề xuất. KHÔNG dùng khi chưa có đề xuất được duyệt.
---

# Lập kế hoạch

## Mục tiêu
Một file kế hoạch trong dự án, người dùng đã duyệt các chặng và điểm dừng, trong đó:
- Mỗi chặng kết thúc bằng thứ **người dùng tự thử được** (nhìn, bấm, cảm nhận).
- **Mọi thứ người dùng không tự thử được thì máy tự kiểm** (test tự động).
- **Mọi dòng nghiệm thu** của đề xuất đều có test tự động phủ (trừ thứ chỉ mắt thấy được — ghi lý do).
- Rủi ro cao được test **trước**; test **tích hợp** được ưu tiên hơn unit.

Nói với người dùng: *"Mình chia việc thành từng chặng nhỏ. Hết mỗi chặng bạn tự thử được bằng tay; những gì khó thử bằng tay thì máy tự kiểm giúp."*

## Giao tiếp
Theo `AGENTS.md`. Người dùng chỉ cần đọc và duyệt: **Các chặng**, **Thứ tự và điểm dừng**, **Rủi ro và đường lùi** (phần Triệu chứng và Lùi về), và cột trái của **Ai kiểm cái gì**. Phần còn lại là của AI — không bắt người dùng đọc.

## Tài nguyên (cùng thư mục skill)
- `mau-ke-hoach.md` — khung các mục. **Luôn bắt đầu từ mẫu này.**
- `vi-du-ke-hoach.md` — kế hoạch mẫu cho đề xuất ví dụ của skill `de-xuat-tinh-nang`.
- `kiem-tra-ke-hoach.mjs` — kiểm tra đủ mục và độ phủ: `node <thư mục skill>/kiem-tra-ke-hoach.mjs <ke-hoach.md> --de-xuat <de-xuat.md>`.

## Nơi lưu
`docs/ke-hoach/<cùng tên file với đề xuất>.md`.

## Quy trình

### Bước 1 — Đọc đề xuất
Phải có đề xuất trong `docs/de-xuat/`, **đã được duyệt**. Chưa có → dừng, đề nghị skill `de-xuat-tinh-nang`.
Đọc thêm `AGENTS.md`, `docs/kien-truc/` và code liên quan để biết cái gì đã có, test nào đã có.

### Bước 2 — Đánh số nghiệm thu
Chép mục "Cách kiểm chứng" của đề xuất thành bảng mã: `NT1, NT2...` cho "Người dùng tự thử", `TD1, TD2...` cho "Kiểm tra tự động", giữ đúng thứ tự.

### Bước 3 — Chia chặng
- Mỗi chặng là **một việc người dùng làm được trọn vẹn và tự thử được**. Đặt tên theo việc đó ("Bạn dọn được danh sách bằng một nút"), không theo phần code.
- Chặng đầu đánh vào **rủi ro lớn nhất** sớm nhất có thể.
- Không chia quá mỏng (chặng không có gì để thử) hay quá dày (thử một lần không hết).
- Mỗi chặng ghi 4 dòng: **Làm được · Chưa có · Bạn tự thử · Máy tự kiểm**. "Bạn tự thử" chỉ gồm thao tác nhìn/bấm được, cụ thể từng bước.
- Việc nhỏ → một chặng là đủ.

### Bước 4 — Rủi ro và đường lùi
Liệt kê điều có thể hỏng — về dữ liệu, quyền, mất mạng, lỗi giữa chừng, bấm nhanh / hai lần, hiệu năng, trải nghiệm. Mỗi rủi ro: **Triệu chứng · Ngưỡng · Kiểm bằng · Lùi về**.
"Kiểm bằng" chỉ tới test tự động. Chỉ ghi "chỉ thử tay được" khi thật sự không tự động được (vd cảm giác mượt trên máy thật) — kèm lý do.

### Bước 5 — Chiến lược kiểm thử (dựa trên rủi ro)

**Ai kiểm cái gì.** Người dùng chỉ thử những gì cần mắt và cảm giác. **Mọi thứ khác máy tự kiểm**: quyền dữ liệu, dữ liệu người khác, mất mạng, lỗi giữa chừng, bấm hai lần, trường hợp biên, dữ liệu sai.

**Thứ tự ưu tiên khi chọn test:**
1. **Rủi ro cao** — mỗi rủi ro có ít nhất một test, viết trước.
2. **Tích hợp** — việc của app (`services`) chạy qua `data/` thật trên bộ giả lập, có bật luật bảo mật (`tests/*.integration.test.ts`, chạy trong `npm run check`). Bắt được lỗi mà unit test với dữ liệu giả không thấy: ghi sai kiểu dữ liệu, luật chặn nhầm, truy vấn sai. **Mọi tính năng có đọc/ghi dữ liệu phải có test tích hợp.**
3. **Luật bảo mật** — collection hoặc quyền mới → ca được phép và ca bị chặn (`tests/firestore.rules.test.ts`).
4. **Unit** — chỉ cho **trường hợp rủi ro**: biên, rỗng, lỗi, quá giới hạn, quyền. **Không viết unit test cho code hiển nhiên** (gán giá trị, gọi thẳng qua).
5. **Giao diện** — luồng người dùng: AI tự chạy app (trình duyệt tự động với web, máy ảo / Expo với mobile), đi hết "Bạn tự thử", chụp màn hình gửi người dùng.

**Ma trận phủ.** Mỗi mã NT/TD → test nào phủ. Không mã nào trống.

### Bước 6 — Bước kỹ thuật
Ngắn gọn, theo thứ tự "Thêm một tính năng" trong `docs/kien-truc/clean-rules.md`. Mỗi bước ghi test đi kèm (# ở danh sách test). Cuối mỗi chặng luôn có: `npm run check` xanh → AI chạy app đi hết "Bạn tự thử" + chụp màn hình → **dừng cho người dùng tự thử**.

### Bước 7 — Kiểm tra và duyệt
1. `node <thư mục skill>/kiem-tra-ke-hoach.mjs <ke-hoach.md> --de-xuat <de-xuat.md>` → phải ✔.
2. Trình bày cho người dùng (theo mẫu trình bày): các chặng (tên + "Bạn tự thử"), điểm dừng, rủi ro chính và đường lùi. Hỏi duyệt **từng điểm**, không dán cả file.
3. Duyệt → ghi Nguồn từng mục, lưu điểm "Kế hoạch: <tên>", cập nhật `AGENTS.md` của dự án.

### Bước 8 — Trong lúc làm
- Làm từng chặng. Hết chặng: `npm run check` xanh, AI tự đi hết "Bạn tự thử", rồi **dừng** cho người dùng thử.
- Ghi vào **Ghi chép trong lúc làm** theo ngày: đã làm gì, số test trước/sau, lỗi tìm ra và cách sửa, việc còn treo, lệch kế hoạch ở đâu.
- Tìm ra lỗi khi thử → **viết test tái hiện lỗi trước**, rồi mới sửa.
- Người dùng bảo bỏ qua điểm dừng → làm theo, nhưng ghi rõ rủi ro nào vì vậy còn treo.
- Phải đổi quyết định trong đề xuất → dừng, hỏi, sửa đề xuất trước.

## Ràng buộc
- Không lập kế hoạch khi chưa có đề xuất được duyệt.
- Không bỏ dòng nghiệm thu nào; không đánh dấu "chỉ thử tay" cho thứ tự động được.
- Không làm yếu kiểm tra để test xanh (theo `clean-rules.md`).
- Không bắt người dùng thử những gì máy tự kiểm được.
