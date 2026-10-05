# Cách dùng bộ skill

Bộ skill này giúp bạn làm app cùng Claude mà **không cần biết code**. Bạn kể ý tưởng, quyết định những gì bạn sẽ thấy và dùng, rồi tự thử app. Phần còn lại Claude làm: viết code, kiểm tra tự động, lưu lại từng bước.

**Bạn không cần nhớ tên skill.** Cứ nói bằng lời thường ("tôi muốn thêm tính năng…", "đưa app lên mạng đi"), Claude sẽ tự chọn đúng skill. Nếu muốn gọi đích danh thì gõ `/` rồi tên skill, ví dụ `/de-xuat-tinh-nang`.

> Chưa cài Claude và bộ skill? Làm theo [getting-started.md](getting-started.md) trước.

## Đi từ ý tưởng tới app chạy thật

```
Chỉ làm 1 lần:
  1. Thiết lập máy  →  2. Tạo dự án

Lặp lại cho mỗi tính năng:
  3. Đề xuất  →  4. Lập kế hoạch  →  5. Làm  →  6. Kiểm thử  →  7. Đưa lên mạng
```

| # | Skill | Để làm gì | Bạn nói, ví dụ |
|---|---|---|---|
| 1 | `thiet-lap-moi-truong` | Chuẩn bị máy tính để làm app | "Thiết lập môi trường cho tôi" |
| 2 | `tao-khung-du-an` | Tạo một app mẫu chạy được, làm nền để xây tiếp | "Tôi muốn bắt đầu app đặt lịch spa" |
| 3 | `de-xuat-tinh-nang` | Thống nhất sẽ làm gì và thế nào là xong, **trước khi** code | "Tôi muốn khách tự huỷ lịch được" |
| 4 | `lap-ke-hoach` | Chia việc thành từng chặng nhỏ mà bạn tự thử được | "Lên kế hoạch làm đề xuất này" |
| 5 | `thuc-thi-ke-hoach` | Làm từng chặng, dừng lại để bạn thử | "Làm đi", "làm tiếp" |
| 6 | `kiem-thu-doc-lap` | Một người kiểm thử "ngoài cuộc" soi lỗi trước khi đưa lên | "Kiểm thử giúp tôi trước khi đưa lên" |
| 7 | `trien-khai-phien-ban-moi` | Đưa bản mới tới người dùng thật, hoặc lùi về bản trước | "Đưa lên mạng", "lùi về bản trước" |

Sửa lỗi nhỏ, đổi chữ hay đổi màu thì không cần đi đủ các bước: cứ nói thẳng, Claude sửa luôn.

---

## Chi tiết từng skill

Mỗi skill được tóm tắt theo ba ý:
- **Bạn cần đưa gì**: thông tin bạn trả lời, việc bạn tự tay làm.
- **Bạn nhận được gì**: kết quả sau khi skill chạy xong.
- **Bạn cần làm gì**: những lúc Claude cần bạn ra tay hoặc quyết định.

### 1. Thiết lập máy — `thiet-lap-moi-truong`

Kiểm tra máy còn thiếu gì, rồi cài đủ công cụ để làm app. Chạy lại bao nhiêu lần cũng an toàn, kể cả chỉ để hỏi "máy tôi ổn chưa?".

**Bạn cần đưa gì**
- Một máy Mac hoặc Windows đã làm xong [getting-started.md](getting-started.md).
- Họ tên và email của bạn, để ghi tên bạn vào những lần lưu code.
- Tài khoản GitHub (nơi cất code) và tài khoản Google (dùng cho Firebase, nơi app chạy thật). Claude hướng dẫn tạo từng bước.

**Bạn nhận được gì**
- Bảng kết quả kiểm tra: ✅ đã có · 🤖 Claude sẽ cài · 🙋 cần bạn làm.
- Một máy đã chạy thử được: có Git, Node.js, Java, VS Code kèm Claude, và đã đăng nhập GitHub, Firebase.

**Bạn cần làm gì**
- Đồng ý kế hoạch cài đặt (hỏi một lần).
- Bấm qua các cửa sổ cài đặt. Khi máy hỏi mật khẩu, nhập **vào cửa sổ cài đặt**, không phải vào khung chat.
- Dán 1–2 lệnh vào Terminal khi được nhờ, ví dụ để đăng nhập GitHub.
- Tự tạo tài khoản và đăng nhập trên trình duyệt.

### 2. Tạo dự án — `tao-khung-du-an`

Dựng một app mẫu "việc cần làm" chạy được ngay. Từ đó các tính năng của bạn sẽ dần thay thế phần mẫu.

**Bạn cần đưa gì** (mỗi lần Claude hỏi 1 câu)
- **Tên app**, ví dụ "Đặt lịch Spa Hoa Mai".
- **App làm gì, cho ai**, 1–2 câu.
- **Có cần lên App Store / Google Play không?** Phần lớn app chỉ cần web là đủ, vì web vẫn dùng tốt trên điện thoại.
  - Lên store tốn phí tài khoản: Apple 99 USD/năm, Google 25 USD.
- Đồng ý chỗ đặt thư mục dự án trên máy.

**Bạn nhận được gì**
- Một dự án trên máy đã qua kiểm tra tự động, kèm **điểm lưu đầu tiên**. Sau này hỏng gì cũng quay về được.
- Nếu bạn đồng ý: một kho code **riêng tư** trên GitHub để sao lưu.
- App chạy thử trước mắt bạn với dữ liệu thử:
  - Web: mở `http://localhost:3000`.
  - App điện thoại: mở bằng app Expo Go.

**Bạn cần làm gì**
- Mở app và thử thêm vài việc.
- Riêng app điện thoại:
  - Cài **Expo Go** trên điện thoại, dùng chung Wi-Fi với máy tính.
  - Tự dán `npm start` vào Terminal rồi quét mã QR.

### 3. Đề xuất tính năng — `de-xuat-tinh-nang`

Trước khi code, Claude viết một bản đề xuất ngắn để hai bên thống nhất: đang thế nào, muốn thế nào, sẽ làm gì, và **thế nào là xong**.

**Bạn cần đưa gì**
- Trả lời 3 câu: Bạn đang gặp chuyện gì? Ai gặp, lúc nào? Hôm nay bạn đang xoay xở ra sao?
- Kể **vấn đề** là đủ, không cần nghĩ ra giải pháp. Nếu bạn nói "thêm nút X", Claude sẽ hỏi lại nút đó giúp bạn tránh được chuyện gì.

**Bạn nhận được gì**
- File đề xuất trong `docs/de-xuat/`, viết bằng lời thường, không có thuật ngữ.
- Bản tóm tắt 5 dòng: vấn đề · mục tiêu · giải pháp · cách biết là xong · những gì để sau.
- Một **danh sách tự thử**: những việc bạn sẽ bấm thử để biết tính năng đã xong.

**Bạn cần làm gì**
- Quyết **từng điểm một**. Mỗi câu hỏi có 2–3 phương án kèm gợi ý của Claude. Các câu thường gặp:
  - Hiện trạng và mục tiêu đã đúng ý chưa.
  - Chọn giải pháp nào.
  - Những gì bạn sẽ thấy: giới hạn, có hỏi xác nhận không…
  - Đợt này làm gì, để sau gì.
- Duyệt bản đề xuất. **Chưa duyệt thì chưa code.**

### 4. Lập kế hoạch — `lap-ke-hoach`

Chia đề xuất thành các **chặng**. Hết mỗi chặng, bạn có một thứ tự thử được bằng tay. Những gì khó thử bằng tay (dữ liệu của người khác, mất mạng, bấm hai lần…) thì máy tự kiểm.

**Bạn cần đưa gì**
- Một đề xuất đã duyệt. Chưa có thì Claude sẽ đề nghị làm bước 3 trước.

**Bạn nhận được gì**
- File kế hoạch trong `docs/ke-hoach/`. Bạn chỉ cần đọc phần dành cho bạn:
  - Các chặng, mỗi chặng ghi rõ "Bạn tự thử" những gì.
  - Chỗ nào sẽ dừng lại chờ bạn.
  - Rủi ro chính: dấu hiệu nhận ra và cách lùi lại nếu có chuyện.

**Bạn cần làm gì**
- Duyệt các chặng, các điểm dừng và các rủi ro. Claude hỏi từng điểm, không bắt đọc cả file.

### 5. Làm theo kế hoạch — `thuc-thi-ke-hoach`

Claude code từng chặng trên một **bản nháp riêng**, nên app chính của bạn không bị ảnh hưởng. Hết mỗi chặng, Claude tự kiểm, tự chạy app thử, chụp màn hình, rồi dừng lại cho bạn thử.

**Bạn cần đưa gì**
- Một kế hoạch đã duyệt.
- Lần đầu: đồng ý cho Claude sao lưu bản nháp lên GitHub. Từ lần sau Claude tự làm.

**Bạn nhận được gì**
- Tiến độ dạng "Chặng 1/2 · bước 3/7 — …".
- Ở mỗi điểm dừng:
  - Ảnh chụp app.
  - Danh sách các bước để thử.
  - Những gì máy đã tự kiểm, những rủi ro còn treo.
- Khi xong: tính năng nằm trong app chính, kèm bộ kiểm tra tự động để sau này sửa gì cũng không làm hỏng nó.

**Bạn cần làm gì** (chỉ 3 việc)
1. **Thử ở mỗi điểm dừng**: làm theo danh sách. Đúng hết thì gõ **ổn**; thấy lạ thì kể lại hoặc chụp màn hình gửi Claude.
2. **Trả lời khi được hỏi**: Claude chỉ hỏi khi phải đổi điều đã thống nhất trong đề xuất.
3. **Nghiệm thu cuối**: xác nhận mọi dòng trong danh sách tự thử. Sau đó bản nháp mới được gộp vào app chính.

### 6. Kiểm thử độc lập — `kiem-thu-doc-lap`

Một "người kiểm thử" chỉ đọc tài liệu và dùng app như người dùng, **không đọc code**. Nhờ vậy họ thấy những lỗi mà người viết code dễ bỏ sót, ví dụ chuyện gì xảy ra khi mất mạng. Nên làm trước mỗi lần đưa lên mạng.

> Mẹo: mở **một cuộc trò chuyện Claude mới** để chạy skill này. Người kiểm thử chưa từng thấy code thì mới khách quan.

**Bạn cần đưa gì**
- Chọn kiểm cái gì: tính năng vừa làm, cả phiên bản sắp đưa lên, hay cả app.
- Trả lời khi tài liệu thiếu hoặc mâu thuẫn. Những chỗ đó cũng được ghi lại như một phát hiện.

**Bạn nhận được gì**
- Báo cáo trong `docs/kiem-thu/` gồm:
  - Những rủi ro đã kiểm.
  - Các lỗi tìm ra, xếp theo mức nghiêm trọng.
  - Kết luận **có nên đưa lên mạng chưa**.
- Bản tóm tắt 5 dòng bằng lời thường.

**Bạn cần làm gì**
- **Thử nghiệm thu (UAT)**: làm theo bảng các bước thử, nói **đạt** hoặc **chưa đạt** cho từng dòng. Kết luận đạt hay chưa là của bạn, không phải của Claude.
- Quyết lỗi nào cần sửa. Lỗi nhỏ thì sửa ngay; lỗi lớn thì quay lại bước 3.

### 7. Đưa phiên bản mới lên mạng — `trien-khai-phien-ban-moi`

Đưa bản đã nghiệm thu tới người dùng thật. Không bao giờ có ai đưa lên thay bạn: lần nào cũng phải có chữ **đồng ý** của bạn.

**Bạn cần đưa gì**
- **Lần đầu, mỗi dự án một lần:**
  - Mã dự án Firebase. Mã này nằm trong địa chỉ web, ví dụ `spa-hoa-mai.web.app`.
  - **Nơi đặt dữ liệu**. Chỗ này **không đổi được về sau**; với người dùng ở Việt Nam, Claude gợi ý Singapore.
  - Bật đăng nhập trên trang Firebase. Claude hướng dẫn từng bước.
  - App điện thoại thêm: tài khoản Expo, và tài khoản Apple / Google nếu lên store.
- **Mỗi lần đưa lên:** đọc **phiếu triển khai** rồi gõ **đồng ý** hoặc **để sau**.

**Bạn nhận được gì**
- Trước khi đưa lên, **phiếu triển khai** cho biết:
  - Có gì mới.
  - Ai thấy, khi nào.
  - Dữ liệu có thay đổi không.
  - Có tốn tiền không.
  - Lùi lại được không.
  - Kết luận của lần kiểm thử gần nhất.
- Sau khi đưa lên:
  - Đường link bản thật.
  - Ảnh Claude chụp lúc mở thử.
  - Danh sách để bạn tự thử trên bản thật.
- `docs/phien-ban.md`: lịch sử các phiên bản, ghi rõ bản nào đang chạy.

**Bạn cần làm gì**
- Quyết **có đưa lên không, và khi nào**.
- Thử trên bản thật. Đây là dữ liệu thật, nên thử xong nhớ xoá dữ liệu thử của bạn.
- Thấy lỗi thì nói **"lùi về bản trước"** rồi gõ **đồng ý**. Dữ liệu người dùng đã tạo vẫn được giữ.
  - Với web, lùi lại mất khoảng 1 phút.
  - App đã lên store thì không rút lại được, chỉ gửi được bản sửa.

---

## Bạn không bao giờ phải

- Đọc hay viết code, đọc log lỗi.
- Tự chọn công nghệ hay cấu hình kỹ thuật.
- Thử bằng tay những gì máy kiểm tự động được.
- Đưa mật khẩu, mã xác minh hay "token" cho Claude. Lỡ dán vào khung chat thì **đổi mật khẩu ngay**.

## Claude luôn hỏi bạn trước khi

- Xoá hay ghi đè file, dữ liệu.
- Đưa code lên GitHub (lần đầu) hoặc đưa app lên mạng (mọi lần).
- Cài phần mềm, đổi cài đặt máy.
- Làm bất cứ việc gì có thể tốn tiền.

## Khi bí

- Không biết đang ở bước nào → hỏi "Dự án đang dở ở đâu?". Claude đọc ghi chép của dự án và trả lời.
- Thấy lỗi về máy (thiếu phần mềm, lệnh không chạy) → nói "Thiết lập môi trường cho tôi".
- Thấy gì lạ → chụp màn hình gửi Claude, kể bằng lời của bạn là đủ.
