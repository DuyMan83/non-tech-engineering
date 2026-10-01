---
name: thuc-thi-ke-hoach
description: Làm (code) một kế hoạch đã được duyệt, từng chặng một - viết test trước, code cho xanh, lưu điểm từng bước, tự kiểm và tự chạy app hết mỗi chặng, rồi dừng cho người dùng tự thử; làm trên nhánh riêng, nghiệm thu xong mới gộp vào bản chính. Dùng sau skill lap-ke-hoach, khi người dùng nói "làm đi", "bắt đầu làm", "làm tiếp", "làm chặng tiếp theo". KHÔNG dùng khi chưa có kế hoạch được duyệt.
---

# Làm theo kế hoạch

## Mục tiêu
Kế hoạch được làm xong từng chặng; mỗi chặng **máy đã tự kiểm** và **người dùng đã tự thử**; mọi dòng nghiệm thu của đề xuất được người dùng xác nhận; code nằm trên bản chính, `npm run check` xanh.

## Giao tiếp
Theo `AGENTS.md`. Báo tiến độ dạng **"Chặng 1/2 · bước 3/7 — …"**. Người dùng chỉ cần làm 3 việc: **thử ở điểm dừng**, **trả lời khi bị hỏi**, **nghiệm thu cuối**. Không in log thô, không bắt người dùng đọc code hay thử những gì máy tự kiểm được.

## Tài nguyên
- `kiem-tra-chang.mjs` (cùng thư mục skill) — chạy trong thư mục dự án:
  `node <thư mục skill>/kiem-tra-chang.mjs --ke-hoach <file kế hoạch> --chang <N>`
  Bắt: test của chặng chưa có, số ca test giảm, `.skip`/`.only`, tắt ESLint, `@ts-ignore`, `any`, sửa file cấu hình kiểm tra hoặc `config/production.env`, luật bảo mật `if true`.
- Đề xuất `docs/de-xuat/<ten>.md` và kế hoạch `docs/ke-hoach/<ten>.md` của dự án.

## Quy trình

### Bước 0 — Kiểm tra trước khi bắt đầu
1. Có đề xuất **và** kế hoạch đã duyệt; `node <skill lap-ke-hoach>/kiem-tra-ke-hoach.mjs <ke-hoach> --de-xuat <de-xuat>` → ✔. Thiếu → dừng, đề nghị skill tương ứng.
2. `git status` sạch. Có thay đổi lạ → hỏi người dùng (lưu lại / bỏ đi), không tự xoá.
3. Đang ở `main` và `npm run check` xanh. **Ghi số ca test hiện có** vào Ghi chép. Đỏ sẵn → dừng, báo; không đổ cho việc mới.
4. Tạo nhánh riêng cho đề xuất: `git switch -c de-xuat/<ten>` (làm tiếp → `git switch de-xuat/<ten>`). Người dùng không cần biết khái niệm nhánh — nói: *"Mình làm trên một bản nháp riêng; bản chính của bạn vẫn chạy bình thường cho tới khi bạn nghiệm thu."*

### Bước 1 — Vào chặng
Báo: *"Bắt đầu chặng N/M: <tên>. Xong chặng này bạn sẽ thử được: <Bạn tự thử>."*

### Bước 2 — Mỗi bước kỹ thuật (theo đúng thứ tự trong kế hoạch)
1. **Viết test trước** (ưu tiên test rủi ro và test tích hợp — theo bảng test của kế hoạch).
2. Chạy riêng test đó → phải **ĐỎ đúng lý do** (thiếu chức năng, không phải lỗi gõ). Xanh ngay → test chưa bắt được gì, sửa test.
   - **Ngoại lệ — test cho hành vi đã có sẵn** (vd luật bảo mật đã cho phép từ trước): test xanh ngay là đúng. Chứng minh nó bắt được lỗi bằng cách **tạm làm hỏng** code/luật → thấy test đỏ → **trả về y nguyên** (kiểm bằng `git diff`). Ghi vào Ghi chép.
3. Viết code **vừa đủ** cho test xanh, đúng lớp theo `docs/kien-truc/clean-rules.md`.
4. `npm run check` → xanh toàn bộ.
5. **Lưu điểm**: `git commit` với lời nhắn lời thường, vd "Thêm nút xoá việc đã xong".
   - Đổi một **hợp đồng** (interface trong `services/ports.ts`) thì kiểm tra kiểu đỏ cho tới khi lớp `data/` làm theo → **làm tiếp các bước sau cho tới khi xanh rồi mới lưu điểm một lần**; ghi "gộp bước X–Y" vào Ghi chép như một lần lệch kế hoạch.
6. Ghi 1 dòng vào **Ghi chép trong lúc làm** của kế hoạch.

### Bước 3 — Hết chặng: tự kiểm trước khi đưa người dùng
1. `npm run check` xanh.
2. `node <thư mục skill>/kiem-tra-chang.mjs --ke-hoach <file> --chang <N>` → ✔.
3. Đối chiếu ma trận phủ: mọi test kế hoạch giao cho chặng đã có và xanh.
4. Tự đọc lại toàn bộ thay đổi của chặng (`git diff main`) với con mắt người soi lỗi: sai lớp, lộ bí mật, xử lý lỗi thiếu, trường hợp biên chưa test. Thấy → sửa (test trước) → quay lại 1.
5. **AI tự chạy app và đi hết "Bạn tự thử"** của chặng:
   - Web: `npm start` chạy nền, trình duyệt tự động làm từng bước, chụp màn hình.
   - Mobile: `npm run build` (đóng gói thử); phần trên điện thoại dành cho người dùng.
   Có bước không làm được → ghi rõ trong Ghi chép.
6. Cập nhật Ghi chép (số ca test trước/sau, lỗi tìm ra, việc treo) và `AGENTS.md` của dự án (use case, collection, đang dở) → lưu điểm.
7. **Đẩy lên GitHub** để sao lưu: `git push -u origin de-xuat/<ten>`. Lần đầu trong dự án → hỏi trước; người dùng đồng ý một lần thì các lần sau tự đẩy. Chưa có repo GitHub / chưa đăng nhập → bỏ qua, nói rõ.

### Bước 4 — Điểm dừng: người dùng tự thử
Trình bày theo mẫu trình bày:

~~~markdown
**Thử chặng N: <tên>**

<1–2 câu: đã làm được gì. Máy đã tự kiểm: <tóm tắt 1 dòng>. Rủi ro còn treo: <nếu có>.>
Bạn mở app (mình đã chạy sẵn ở http://localhost:3000) và thử lần lượt:

1. <bước "Bạn tự thử"> — <kết quả mong đợi>
2. ...

Thấy đúng hết thì gõ **ổn**; có gì lạ thì kể hoặc chụp màn hình gửi mình.
~~~

- **"ổn"** → đánh dấu các dòng NT tương ứng `[x]` trong đề xuất, ghi ngày vào Ghi chép, **làm tiếp chặng sau luôn** (báo 1 câu).
- **Báo lỗi** → hỏi thêm cho rõ (1 câu/lần) → tái hiện → **viết test tái hiện (đỏ)** → sửa → xanh → Bước 3 → nhờ thử lại đúng chỗ đó.
- **Muốn đổi ý** → nếu đổi quyết định trong đề xuất: dừng, sửa đề xuất + kế hoạch (ghi "Sửa ngày ..."), người dùng duyệt lại, rồi mới làm.
- **Bảo bỏ qua điểm dừng** → làm theo, ghi vào Ghi chép rủi ro nào vì vậy còn treo.

### Bước 5 — Nghiệm thu và gộp vào bản chính
Khi mọi chặng xong và **mọi dòng NT đã được người dùng xác nhận**:
1. `npm run check` xanh lần cuối trên nhánh.
2. Tóm tắt cho người dùng: làm được gì, số ca test trước → sau, rủi ro còn treo (nếu có).
3. Gộp: `git switch main && git merge --no-ff de-xuat/<ten>` → `npm run check` xanh trên `main` → `git push origin main` (theo đồng ý đẩy lên GitHub ở Bước 3).
4. Đề xuất: trạng thái **"Đã xong <ngày>"**; `AGENTS.md` của dự án: cập nhật bảng đề xuất / kế hoạch và "Đang dở / bước tiếp theo".
5. Hỏi người dùng có muốn đưa phiên bản mới lên mạng không → skill **`trien-khai-phien-ban-moi`**. **Skill này không deploy.**

## Ràng buộc

**Phạm vi**
- Chỉ làm những gì trong kế hoạch. Việc ngoài kế hoạch → ghi mục "Việc phát sinh" trong Ghi chép và hỏi; không tự làm.
- Không refactor lan ra ngoài phần đang làm. Không thêm thư viện khi chưa hỏi.

**Test**
- Test viết trước và phải thấy ĐỎ trước khi code.
- **Không sửa test để cho xanh**, trừ khi test sai thật — nói rõ vì sao, ghi vào Ghi chép.
- Không skip / xoá test, không nới cấu hình kiểm tra (ESLint, tsconfig, vitest, lệnh `check`). Số ca test không giảm.
- Lỗi tìm ra (do người dùng hay do AI) → test tái hiện trước khi sửa.

**Dữ liệu và an toàn**
- Chỉ chạy môi trường **dev / bộ giả lập**. Không `npm start production`, không `npm run deploy`, không `eas build` / `eas update`.
- Không sửa `config/production.env`. Không mở luật bảo mật. Không commit bí mật.

**Lưu điểm và nhánh**
- Mọi việc làm trên nhánh `de-xuat/<ten>`; `main` chỉ nhận code khi nghiệm thu.
- Mỗi bước xanh = 1 lần lưu điểm. **Không bao giờ lưu điểm khi đang đỏ.**
- Không force push, không viết lại lịch sử, không xoá nhánh của người dùng.

**Khi kẹt**
- Cùng một lỗi sửa **3 lần** chưa xong → dừng: báo lời thường, đưa 1–2 hướng, chờ người dùng chọn.
- Code buộc phải lệch kế hoạch → dừng, hỏi, sửa kế hoạch trước.
- Không đoán; không báo "xong" khi chưa thử.

**Ghi chép**
- Theo ngày, theo chặng: đã làm gì, số ca test trước/sau, lỗi tìm ra và cách sửa, việc treo, lệch kế hoạch.
- **Trung thực**: chưa chạy / chưa thử được gì thì ghi rõ "chưa thử", kèm lý do.
