---
name: trien-khai-phien-ban-moi
description: Đưa phiên bản mới (đã nghiệm thu) của app lên cho người dùng thật - web lên Firebase Hosting, app điện thoại qua EAS Update hoặc App Store / Google Play. Soạn phiếu triển khai (có gì mới, ai thấy, dữ liệu có đổi không, chi phí, lùi lại thế nào), chờ người dùng đồng ý, triển khai, tự kiểm trên bản thật, ghi lịch sử phiên bản; lùi về bản trước khi có vấn đề. Lần đầu thì hướng dẫn tạo project Firebase / tài khoản Expo. Dùng khi người dùng nói "đưa lên mạng", "cho mọi người dùng", "phát hành", "deploy", "cập nhật app", "lùi về bản trước", "bản mới bị lỗi".
---

# Triển khai phiên bản mới

## Người dùng non-tech thấy gì và kiểm soát gì

| Lúc | Người dùng **thấy** | Người dùng **kiểm soát** |
|---|---|---|
| Trước | **Phiếu triển khai**: có gì mới (tên các đề xuất họ đã duyệt), ai sẽ thấy và khi nào, luật dữ liệu có đổi không, tốn tiền không, lùi lại được không | **Quyết có đưa lên hay không, và khi nào** — không ai đưa lên thay họ |
| Trong | Tiến độ "Bước 2/4 — …" | Dừng bất cứ lúc nào trước bước đưa lên |
| Sau | Đường link bản thật, ảnh chụp AI đã mở thử, danh sách để tự thử trên bản thật | **Thử trên bản thật**; nói **"lùi về bản trước"** là quay lại (web: tự bấm được trên Firebase console) |
| Lâu dài | `docs/phien-ban.md`: lịch sử các phiên bản, bản nào đang chạy | Biết lúc nào đã đưa gì lên |

Người dùng **không** phải: đọc lệnh, đọc log, chọn cấu hình kỹ thuật.

## Giao tiếp
Theo `AGENTS.md`. Mọi cảnh báo của script (`--xac-nhan`) phải được **trình bày lại bằng lời thường theo phiếu triển khai** trước khi hỏi đồng ý.

## Tài nguyên
- `chuan-bi-trien-khai.mjs` (cùng thư mục skill) — chạy trong dự án: `node <thư mục skill>/chuan-bi-trien-khai.mjs [--json]`. Cho biết: kiến trúc, phiên bản đang chạy, tag mới, tính năng mới (đề xuất "Đã xong" từ lần trước), luật dữ liệu có đổi, cấu hình bản thật đủ chưa, (mobile) có phải gửi lại store không, và lý do chưa sẵn sàng.
- Lệnh của dự án: `npm run deploy [môi trường] [...] -- --thu` (xem trước) / `-- --xac-nhan` (sau khi người dùng đồng ý).
- Hướng dẫn: `docs/guides/operational/firebase.md` (Phần 3–5), `expo.md`, `mo-terminal.md`.

## Quy trình

### Bước 0 — Soạn phiếu
1. `node <skill>/chuan-bi-trien-khai.mjs --json`.
2. Chưa sẵn sàng → nói lý do lời thường và cách xử lý (vd đang ở bản nháp chưa nghiệm thu → hoàn tất skill `thuc-thi-ke-hoach` trước). Dừng.
3. `lanDau: true` → làm **Bước 1** trước.

### Bước 1 — Lần đầu: chuẩn bị nơi chạy thật (mỗi dự án một lần)
Mỗi việc trình bày theo mẫu trình bày, chờ "xong" rồi mới sang việc sau.
1. Máy đã đăng nhập Firebase (`firebase login:list` có email). Chưa → `firebase.md` Phần 2 (người dùng tự dán lệnh).
2. **Tạo project Firebase.** Hỏi tên (gợi ý `<slug>-app`; tên nằm trong địa chỉ web). AI chạy `npx firebase-tools@latest projects:create <id> --display-name "<tên app>"`. Lỗi (chưa đồng ý điều khoản, trùng tên) → hướng dẫn `firebase.md` Phần 3 và hỏi lại mã dự án.
3. **Nơi đặt dữ liệu** — hỏi trước, nói rõ *không đổi được về sau*; gợi ý `asia-southeast1` (Singapore) cho người dùng Việt Nam. AI chạy `npx firebase-tools@latest firestore:databases:create "(default)" --location <nơi> --project <id>`. Lệnh lỗi → hướng dẫn tạo Firestore trên console.
4. **Bật đăng nhập ẩn danh** — người dùng làm theo `firebase.md` Phần 4.
5. **Lấy cấu hình web.** AI chạy `npx firebase-tools@latest apps:create web "<tên app>" --project <id>` rồi `npx firebase-tools@latest apps:sdkconfig web <appId> --project <id>`, điền vào `config/production.env` (không phải bí mật). Lưu điểm "Cấu hình Firebase thật".
6. **Mobile thêm:** tài khoản Expo + đăng nhập (`expo.md`, người dùng tự dán lệnh); AI chạy `npx eas-cli@latest init --non-interactive` (lỗi → người dùng tự chạy `npx eas-cli@latest init` trong Terminal), chép `projectId` vào `EAS_PROJECT_ID`. Lưu điểm.
7. Chạy lại Bước 0.

> Các lệnh `firebase-tools` / `eas-cli` ở trên **chưa được thử trên tài khoản thật** — lỗi thì chuyển sang làm trên console theo hướng dẫn, ghi lại để sửa skill.

### Bước 2 — Trình bày phiếu, chờ quyết định
1. Xem trước: `npm run deploy [...] -- --thu` (mobile: thêm `production store` nếu phiếu báo `canGuiStore`).
2. Trình bày **phiếu triển khai** (đúng mẫu, lời thường):

~~~markdown
**Đưa phiên bản mới lên cho người dùng thật**

Có gì mới:
- <tên đề xuất 1>
- <tên đề xuất 2>

- **Ai thấy, khi nào:** <web: mọi người vào https://<id>.web.app, ngay sau khi xong · mobile update: lần mở app tiếp theo · mobile store: sau khi store duyệt (vài giờ – vài ngày)>
- **Dữ liệu:** <không đổi gì / luật "ai được xem/sửa gì" có đổi: <lời thường>>
- **Chi phí:** <0đ (gói miễn phí) / tốn 1 lượt build Expo / cần tài khoản store>
- **Đã kiểm tra:** <N> ca test tự động xanh; bạn đã nghiệm thu các tính năng trên ngày <…>; kiểm thử độc lập: <kết luận gần nhất từ phiếu, hoặc "chưa có" — nếu chưa có / khuyến nghị "chưa", nói rõ và gợi ý chạy skill `kiem-thu-doc-lap` trước>.
- **Lùi lại được không:** <web: được, khoảng 1 phút · mobile update: được, gửi lại bản trước · mobile store: không rút lại được bản đã duyệt, chỉ gửi bản sửa>

Gõ **đồng ý** để đưa lên, hoặc **để sau**.
~~~

3. Chỉ "đồng ý" rõ ràng mới làm tiếp. Mỗi lần triển khai một lần đồng ý riêng.

### Bước 3 — Triển khai
- Web: `npm run deploy -- --xac-nhan`.
- Mobile update: `npm run deploy -- --xac-nhan`. Mobile store: `npm run deploy production store -- --xac-nhan`; **lần đầu gửi store** (cần tạo khoá ký, đăng nhập Apple) → người dùng tự chạy `npm run deploy production store` trong Terminal (script hỏi họ gõ lại mã dự án).
- Báo tiến độ theo từng lệnh script in ra (`→ ...`), bằng lời thường: kiểm tra → đóng gói → đưa lên.
- Lỗi giữa chừng → **dừng**, nói lời thường đã tới bước nào. Lỗi trước bước "đưa lên" → không có gì thay đổi trên mạng. Lỗi ở bước "đưa lên" → kiểm tra trạng thái thật (mở link) trước khi kết luận.

### Bước 4 — Kiểm tra sau triển khai
1. **Web:** AI mở `https://<id>.web.app` bằng trình duyệt tự động: trang tải được, không có lỗi trên trang, đúng tên app, màn hình chính hiện. **Không thêm / sửa / xoá dữ liệu thật.** Chụp ảnh gửi người dùng.
2. **Mobile update:** `npx eas-cli@latest update:list --branch production --limit 1 --non-interactive` thấy bản mới. Store: báo đường link theo dõi trên expo.dev.
3. Đưa người dùng **danh sách tự thử trên bản thật** — lấy các dòng "Người dùng tự thử" của đề xuất trong phiếu, nhắc: *"đây là dữ liệu thật — thử xong thì xoá dữ liệu thử của bạn"*.

### Bước 5 — Ghi phiên bản
1. Tag: `git tag <tagMoi> && git push origin <tagMoi>` (đã có repo GitHub).
2. `docs/phien-ban.md` (tạo nếu chưa có) — thêm dòng trên cùng:

   | Phiên bản | Ngày | Có gì mới | Nơi | Trạng thái |
   |---|---|---|---|---|
   | `phien-ban-2026-10-01` | 2026-10-01 | Xoá hết việc đã xong | https://… | **Đang chạy** |

   Dòng trước đổi trạng thái thành "Đã thay".
3. `AGENTS.md` của dự án: phiên bản đang chạy, địa chỉ. Lưu điểm, đẩy lên GitHub.

### Lùi về bản trước (khi người dùng nói "lùi lại", "bản mới bị lỗi")
1. Hỏi ngắn chuyện gì xảy ra (1 câu); không bắt chẩn đoán.
2. Trình bày theo mẫu: lùi về `<tag trước>` (ngày, có gì), **dữ liệu người dùng đã tạo vẫn giữ**, chờ "đồng ý".
3. **Web:** nhanh nhất là Hosting → Release history → Rollback (`firebase.md` Phần 5) — người dùng tự bấm, hoặc AI đưa lại bản trước: `git worktree add ../_ban-truoc <tag trước>` → trong đó `npm ci && npm run deploy -- --xac-nhan` → xoá worktree. Bản mới có đổi luật dữ liệu → **phải** dùng cách AI đưa lại (Rollback trên console không lùi luật).
4. **Mobile update:** người dùng tự chạy `npx eas-cli@latest update:rollback` trong Terminal (lệnh hỏi chọn bản) — kiểm tra lệnh trong tài liệu Expo đúng phiên bản trước khi đưa. **Store:** không rút lại được — sửa lỗi rồi gửi bản mới (quay về skill `de-xuat-tinh-nang` / `thuc-thi-ke-hoach` với việc sửa lỗi).
5. Kiểm tra như Bước 4; `docs/phien-ban.md`: bản lỗi "Đã lùi — <lý do ngắn>", bản trước "Đang chạy".

## Ràng buộc
- **Chỉ triển khai từ `main`**, sạch, đã nghiệm thu (`chuan-bi-trien-khai.mjs` ✔). Không triển khai từ nhánh `de-xuat/*`.
- **Không bao giờ tự thêm `--xac-nhan`** khi người dùng chưa gõ đồng ý cho **chính lần triển khai này**.
- Không nâng gói Firebase Blaze, không bật dịch vụ trả phí. Nơi đặt dữ liệu: luôn hỏi.
- Không thêm / sửa / xoá **dữ liệu thật** khi kiểm tra sau triển khai.
- `config/production.env` chỉ chứa cấu hình web của Firebase — không bao giờ ghi bí mật vào đó.
- Luật dữ liệu đổi → nói rõ bằng lời thường **trước** khi hỏi đồng ý.
- Mobile: thay đổi phần native (thư viện, quyền máy, icon, `app.config.ts`) → **không** dùng update, phải gửi store (phiếu báo `canGuiStore`).
- Lỗi giữa chừng → dừng, kiểm tra trạng thái thật, đề xuất lùi; không thử liên tiếp nhiều cách.
- Mỗi lần triển khai / lùi đều ghi vào `docs/phien-ban.md` — **trung thực**, kể cả lần lỗi.
