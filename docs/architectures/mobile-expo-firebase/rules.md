# Rules riêng: Mobile Expo + Firebase

**Đọc trước:** [`../_chung/clean-rules.md`](../_chung/clean-rules.md). File này chỉ ghi phần riêng cho mobile.

**Expo thay đổi nhiều qua từng bản SDK** — trước khi dùng API Expo/EAS, đọc tài liệu đúng phiên bản `expo` trong `package.json`: https://docs.expo.dev/versions/ và https://docs.expo.dev/llms.txt.

## Cấu trúc

```
.
├── src/
│   ├── app/              # Expo Router: _layout.tsx, các màn hình — mỏng
│   ├── ui/               # Component React Native
│   ├── services/         # Use case + interface repository
│   ├── domain/           # Quy tắc nghiệp vụ thuần
│   ├── data/             # Firebase JS SDK: firebase.ts khởi tạo + các repository
│   └── composition.ts    # Nối data → services
├── app.config.ts         # Tên app, icon, mã định danh store (APP_ID), plugin; đọc config/<APP_ENV>.env
├── eas.json              # Profile build trên EAS: preview / production (đặt APP_ENV)
├── config/
│   ├── dev.env           # Môi trường dev: Emulator + dự án demo-... (mặc định)
│   └── production.env    # Môi trường production: Firebase thật + EAS_PROJECT_ID (không phải bí mật, được commit)
├── scripts/              # build.mjs, run.mjs, deploy.mjs — đọc config/<môi trường>.env
├── firestore.rules
├── firebase.json         # Emulator (host 0.0.0.0 để điện thoại kết nối được) + rules
├── AGENTS.md / CLAUDE.md
└── package.json          # scripts: start, build, deploy, check
```

## X1. Expo quản lý phần native
- **Không commit `android/` và `ios/`** (đưa vào `.gitignore`). Expo tự sinh khi build (Continuous Native Generation).
- Mọi cấu hình native (tên app, icon, quyền camera/thông báo, bundle id) nằm trong **`app.config.ts`** và config plugin — không sửa tay thư mục native.
- **Không chạy `npx expo prebuild` rồi commit kết quả**, không "eject" khi chưa hỏi người dùng.
- Cài thư viện bằng **`npx expo install <tên>`** (không `npm install`) để lấy đúng phiên bản hợp với Expo SDK.
- **Không nâng cấp Expo SDK** khi chưa hỏi; nâng cấp làm theo hướng dẫn chính thức, từng bản một.

## X2. Firebase
- Mặc định dùng **Firebase JS SDK** (`firebase/*`) — chạy được trong **Expo Go**.
- Auth phải cấu hình **lưu phiên đăng nhập bằng AsyncStorage**, nếu không người dùng bị đăng xuất mỗi lần mở app.
- Cấu hình nằm ở `config/<môi trường>.env`; `app.config.ts` đọc file theo `APP_ENV` và đưa vào `extra`, `src/data/firebase.ts` đọc qua `expo-constants`. Không dùng file `.env*` (bị `.gitignore` chặn).
- `initializeAuth` / `getReactNativePersistence` import từ **`@firebase/auth`** (kiểu dữ liệu bản React Native; `tsconfig` trỏ sẵn). Không đổi sang `firebase/auth` cho 2 hàm này.
- Bộ giả lập: điện thoại kết nối tới máy tính qua địa chỉ Expo đang chạy (`Constants.expoConfig.hostUri`), Emulator nghe trên `0.0.0.0`. Điện thoại và máy tính phải **cùng Wi-Fi**.
- Cần tính năng chỉ có ở bản native (`@react-native-firebase/*`: Crashlytics, thông báo đẩy qua FCM...) → **hỏi người dùng**, giải thích phải chuyển sang development build (X3). Vì Firebase chỉ nằm trong `data/`, việc đổi SDK chỉ sửa `data/`.

## X3. Chạy thử
| Cách | Khi nào | Lệnh |
|---|---|---|
| **Expo Go** (mặc định) | Mọi thư viện đều có sẵn trong Expo Go | `npm start` (dev + bộ giả lập) → người dùng quét QR bằng Expo Go |
| **Development build** | Có thư viện native ngoài Expo Go | `eas build --profile development` một lần (vài phút, có thể tốn lượt build), sau đó `npx expo start --dev-client` |

- Trước khi thêm thư viện, **kiểm tra nó có chạy trong Expo Go không**. Không chạy → báo người dùng hệ quả (mất quét-QR-chạy-ngay, tốn lượt build) và hỏi trước.
- Cho người dùng xem: hướng dẫn quét QR theo mẫu trình bày (tiêu đề = để làm gì, why/how, các bước).

## X4. Build & phát hành (EAS)
- Lệnh EAS chạy qua `npx eas-cli@latest ...` (không cài global).
- `eas.json` có profile `preview` (bản cài thử, chia sẻ link) và `production` (lên store); mỗi profile đặt `APP_ENV`. Cần development build → thêm profile `development` + `expo-dev-client` (hỏi trước).
- `EAS_PROJECT_ID` trong `config/production.env` lấy từ `npx eas-cli@latest init` (người dùng cần tài khoản Expo).
- **Khoá ký app do EAS quản lý** (`credentials` mặc định của EAS). Không tự tạo keystore / chứng chỉ trên máy, không commit file khoá.
- **Mỗi lần `eas build` hoặc `eas submit` đều phải hỏi người dùng trước**: nói rõ tốn 1 lượt build (gói miễn phí có giới hạn), mất bao lâu, có tốn tiền không.
- Phát hành store cần tài khoản Apple Developer ($99/năm) / Google Play ($25) — **người dùng tự đăng ký**, AI chỉ hướng dẫn.

## X5. EAS Update (cập nhật không qua store)
- Chỉ dùng cho thay đổi **phần JavaScript/giao diện**. Thay đổi native (thư viện native mới, quyền máy, `app.config.ts` phần native) → **phải build bản mới và gửi store**.
- Không dùng Update để thay đổi mục đích chính của app (vi phạm chính sách store).
- **Hỏi người dùng trước** mỗi lần gửi Update — nó tới máy người dùng thật ngay.

## X6. Ranh giới bằng ESLint

| Thư mục | Cấm import |
|---|---|
| `src/domain/**` | `@/app/*`, `@/ui/*`, `@/services/*`, `@/data/*`, `react`, `react-native*`, `expo*`, `firebase*`, `@firebase/*`, `@react-native-async-storage/*` |
| `src/services/**` | `@/app/*`, `@/ui/*`, `@/data/*`, `react`, `react-native*`, `expo*`, `firebase*`, `@firebase/*`, `@react-native-async-storage/*` |
| `src/ui/**`, `src/app/**` | `@/data/*`, `firebase*`, `@firebase/*`, `@react-native-async-storage/*` |
| `src/data/**` | `@/app/*`, `@/ui/*`, `react`, `react-native` |

## X7. Lệnh
| Lệnh | Mặc định | Việc |
|---|---|---|
| `npm start [môi trường]` | `dev` | `dev`: Emulator + `expo start` → quét QR bằng Expo Go. Môi trường thật: `expo start` với **dữ liệu thật** — cần xác nhận |
| `npm run build [môi trường] [android\|ios\|all]` | `dev` | `dev`: `expo export` trên máy (miễn phí, chỉ kiểm tra build được). Môi trường thật: `eas build` — **tốn lượt build**, cần xác nhận |
| `npm run deploy [môi trường] [update\|store]` | `production update` | `update`: `check` → `firebase deploy --only firestore` → `eas update` tới **người dùng thật**. `store`: `check` → rules → `eas build --auto-submit` lên store. Cả hai cần xác nhận. Không deploy được `dev` |
| `npm run check` | — | `tsc --noEmit` → ESLint → Vitest → test `firestore.rules` trên Emulator |

**Xác nhận việc nguy hiểm**: script tự in cảnh báo và dừng nếu chưa có `--xac-nhan`. AI **trình bày cảnh báo cho người dùng, chờ họ đồng ý**, rồi mới chạy lại với `-- --xac-nhan`. Người dùng tự gõ lệnh trong Terminal → script hỏi gõ lại mã dự án.
**Xem trước**: thêm `-- --thu` để in cảnh báo + các lệnh sẽ chạy mà không chạy thật.
Lệnh EAS chạy với `--non-interactive` khi không có Terminal thật; lần đầu cần đăng nhập/tạo khoá ký → người dùng tự chạy lệnh trong Terminal.

## X8. Không dùng Expo cho web
Web dùng kiến trúc [`web-nextjs-firebase`](../web-nextjs-firebase/). Không bật Expo web để tránh hai bản web khác nhau.
