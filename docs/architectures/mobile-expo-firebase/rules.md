# Rules riêng: Mobile Expo + Firebase

**Đọc trước:** [`../_chung/clean-rules.md`](../_chung/clean-rules.md). File này chỉ ghi phần riêng cho mobile.

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
├── app.config.ts         # Cấu hình app (tên, icon, bundle id, quyền máy, plugin)
├── eas.json              # Cấu hình build: development / preview / production
├── firestore.rules
├── firebase.json         # Cấu hình Emulator + rules
├── .env.example          # EXPO_PUBLIC_FIREBASE_* (mẫu)
├── .env                  # Giá trị thật — KHÔNG commit
├── AGENTS.md / CLAUDE.md
└── package.json          # scripts: start, check, build:*, submit:*, update
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
- Cấu hình đọc từ `process.env.EXPO_PUBLIC_FIREBASE_*`; `.env` không commit, `.env.example` liệt kê đủ biến.
- Cần tính năng chỉ có ở bản native (`@react-native-firebase/*`: Crashlytics, thông báo đẩy qua FCM...) → **hỏi người dùng**, giải thích phải chuyển sang development build (X3). Vì Firebase chỉ nằm trong `data/`, việc đổi SDK chỉ sửa `data/`.

## X3. Chạy thử
| Cách | Khi nào | Lệnh |
|---|---|---|
| **Expo Go** (mặc định) | Mọi thư viện đều có sẵn trong Expo Go | `npx expo start` → người dùng quét QR bằng Expo Go |
| **Development build** | Có thư viện native ngoài Expo Go | `eas build --profile development` một lần (vài phút, có thể tốn lượt build), sau đó `npx expo start --dev-client` |

- Trước khi thêm thư viện, **kiểm tra nó có chạy trong Expo Go không**. Không chạy → báo người dùng hệ quả (mất quét-QR-chạy-ngay, tốn lượt build) và hỏi trước.
- Cho người dùng xem: hướng dẫn quét QR theo mẫu trình bày (tiêu đề = để làm gì, why/how, các bước).

## X4. Build & phát hành (EAS)
- Lệnh EAS chạy qua `npx eas-cli@latest ...` (không cài global).
- `eas.json` có 3 profile: `development`, `preview` (bản cài thử, chia sẻ link), `production` (lên store).
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
| `src/domain/**` | `@/app/*`, `@/ui/*`, `@/services/*`, `@/data/*`, `react`, `react-native`, `expo*`, `firebase/*` |
| `src/services/**` | `@/app/*`, `@/ui/*`, `@/data/*`, `react`, `react-native`, `expo*`, `firebase/*` |
| `src/ui/**`, `src/app/**` | `@/data/*`, `firebase/*` |
| `src/data/**` | `@/app/*`, `@/ui/*`, `react`, `react-native` |

## X7. Lệnh
| Lệnh | Việc |
|---|---|
| `npm start` | `npx expo start` — chạy thử, hiện mã QR |
| `npm run check` | `tsc --noEmit` → ESLint → Jest → test `firestore.rules` trên Emulator |
| `npm run build:preview` / `build:production` | `eas build` — **hỏi trước** |
| `npm run submit` | `eas submit` lên store — **hỏi trước** |
| `npm run update` | `eas update` — **hỏi trước** |

## X8. Không dùng Expo cho web
Web dùng kiến trúc [`web-nextjs-firebase`](../web-nextjs-firebase/). Không bật Expo web để tránh hai bản web khác nhau.
