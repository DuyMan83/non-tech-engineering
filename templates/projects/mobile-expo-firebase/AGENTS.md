# {{TEN_DU_AN}}

Sổ tay dự án — AI đọc file này đầu mỗi phiên và **cập nhật sau mỗi thay đổi lớn**, trước khi lưu điểm.

## App làm gì
{{MO_TA}}

## Kiến trúc
- App điện thoại Expo (React Native) + Firebase, gói Spark miễn phí. Build / phát hành / cập nhật qua EAS.
- **Rules bắt buộc:** [`docs/kien-truc/clean-rules.md`](docs/kien-truc/clean-rules.md) và [`docs/kien-truc/rules.md`](docs/kien-truc/rules.md).
- 4 lớp: `src/domain` → `src/services` → `src/data` (Firebase) / `src/ui` → `src/app` (Expo Router). Nối ở `src/composition.ts`.
- **Expo thay đổi nhiều qua từng bản SDK** — trước khi dùng API Expo/EAS, đọc tài liệu đúng phiên bản (`expo` trong `package.json`): https://docs.expo.dev/versions/ và https://docs.expo.dev/llms.txt. Không viết theo trí nhớ.
- Cài thư viện bằng `npx expo install <tên>` (không `npm install`). Không commit / sửa tay `android/`, `ios/`.

## Môi trường (`config/`)
| File | Môi trường | Dữ liệu |
|---|---|---|
| `config/dev.env` | **dev** (mặc định) | Bộ giả lập trên máy tính — dữ liệu thử |
| `config/production.env` | **production** | Firebase thật + mã dự án EAS — dữ liệu THẬT. Điền khi phát hành lần đầu |

`app.config.ts` đọc `config/<APP_ENV>.env` (scripts và `eas.json` tự đặt `APP_ENV`). Tên app, mã định danh store (`APP_ID`) nằm ở đầu `app.config.ts` — **`APP_ID` không đổi sau khi đã lên store**.

## Lệnh
| Lệnh | Việc |
|---|---|
| `npm start` | Chạy **dev**: bộ giả lập + Expo — mở **Expo Go** trên điện thoại, quét mã QR (cùng Wi-Fi với máy tính) |
| `npm start production` | Chạy trên điện thoại với **dữ liệu thật** — cần xác nhận |
| `npm run build` | Đóng gói thử trên máy (miễn phí) — chắc chắn app build được |
| `npm run build production [android\|ios\|all]` | Build app thật trên EAS — **tốn lượt build**, cần xác nhận |
| `npm run check` | Kiểm tra toàn bộ: kiểu dữ liệu → ranh giới lớp → unit test → test trên bộ giả lập (luật bảo mật + tích hợp). **Phải pass trước khi lưu điểm.** |
| `npm run deploy` | Gửi bản cập nhật (EAS Update) tới **người dùng thật** + ghi đè luật Firestore — cần xác nhận |
| `npm run deploy production store` | Build app mới + gửi lên App Store / Google Play — cần xác nhận |

**Xác nhận:** các lệnh nguy hiểm tự dừng và in cảnh báo nếu chưa xác nhận. AI phải **trình bày cảnh báo cho người dùng, chờ họ đồng ý**, rồi mới chạy lại với `-- --xac-nhan`. Không bao giờ tự thêm `--xac-nhan` khi người dùng chưa đồng ý.
Muốn xem trước các lệnh sẽ chạy mà không chạy thật: thêm `-- --thu`.

## Use case (`src/services/`)
| File | Việc |
|---|---|
| `addTask.ts` | Thêm việc cần làm (mẫu có sẵn trong khung) |
| `listMyTasks.ts` | Lấy danh sách việc của người dùng hiện tại (mẫu) |
| `toggleTask.ts` | Đánh dấu xong / chưa xong (mẫu) |

## Collection Firestore (`firestore.rules`)
| Collection | Ai đọc/ghi | Test |
|---|---|---|
| `tasks` | Chỉ chủ việc (`ownerId`) | `tests/firestore.rules.test.ts` |

## Quyết định đã chốt
| Ngày | Quyết định | Lý do |
|---|---|---|
| {{NGAY_TAO}} | Tạo từ khung dự án `mobile-expo-firebase` | — |

## Đề xuất (`docs/de-xuat/`) và kế hoạch (`docs/ke-hoach/`)
Tính năng mới → viết đề xuất (skill `de-xuat-tinh-nang`) → lập kế hoạch (skill `lap-ke-hoach`), người dùng duyệt cả hai rồi mới code (skill `thuc-thi-ke-hoach`: nhánh `de-xuat/<ten>`, test trước, dừng cho người dùng thử hết mỗi chặng, nghiệm thu xong mới gộp vào `main`). Test theo rủi ro, ưu tiên test tích hợp (`tests/*.integration.test.ts`). "Xong" = `npm run check` pass + người dùng thử hết checklist trong đề xuất.

| Ngày | Đề xuất / kế hoạch | Trạng thái |
|---|---|---|
| — | — | — |

## Kiểm thử độc lập (`docs/kiem-thu/`)
Skill `kiem-thu-doc-lap`: chỉ đọc tài liệu + chạy app, không đọc code (hook trong `.claude/settings.json` chặn khi có file `.kiem-thu-dang-chay`). Nên chạy trong một phiên Claude mới, trước khi triển khai.

## Phiên bản (`docs/phien-ban.md`)
Đưa lên cho người dùng thật / lùi về bản trước → skill `trien-khai-phien-ban-moi`. Phiên bản đang chạy: **chưa triển khai**.

## Đang dở / bước tiếp theo
- Khung dự án vừa tạo, chưa có tính năng riêng.
