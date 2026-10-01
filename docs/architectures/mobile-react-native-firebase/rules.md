# Rules riêng: Mobile React Native (bare) + Firebase

**Đọc trước:** [`../_chung/clean-rules.md`](../_chung/clean-rules.md). File này chỉ ghi phần riêng cho mobile.

## Cấu trúc

```
.
├── src/
│   ├── app/              # Màn hình + khai báo React Navigation — mỏng
│   ├── ui/               # Component React Native
│   ├── services/         # Use case + interface repository
│   ├── domain/           # Quy tắc nghiệp vụ thuần
│   ├── data/             # @react-native-firebase/* + các repository
│   └── composition.ts    # Nối data → services
├── android/              # Native Android — xem M2
├── ios/                  # Native iOS — xem M2
├── firestore.rules
├── firebase.json         # Cấu hình Emulator + rules
├── AGENTS.md / CLAUDE.md
└── package.json          # scripts: android, ios, check
```

## M1. Firebase
- Dùng **`@react-native-firebase/*`** (bản native), không dùng Firebase JS SDK cho web.
- File cấu hình: `android/app/google-services.json`, `ios/<App>/GoogleService-Info.plist`. Không phải bí mật thật nhưng **chỉ commit khi repo private**; repo public → không commit, có hướng dẫn tạo lại.
- Phát triển và test dùng **Firebase Emulator**, không đụng dữ liệu thật.

## M2. Thư mục native (`android/`, `ios/`)
- **Không sửa tay** `android/` và `ios/` trừ khi thư viện yêu cầu, và phải **nói với người dùng** trước: sửa gì, để làm gì.
- Thêm thư viện có code native → báo người dùng: "cần build lại app, mất vài phút"; iOS chạy `pod install` trong `ios/`.
- **Không nâng cấp React Native** khi chưa hỏi — nâng cấp bản bare rất dễ vỡ, phải làm có kế hoạch riêng.

## M3. Khoá ký app (signing) — rủi ro lớn nhất
- Khoá ký Android (`*.keystore`, mật khẩu) và chứng chỉ iOS **không bao giờ commit**, không in ra chat.
- Khi tạo khoá ký: hướng dẫn người dùng **sao lưu ở nơi an toàn** (ngoài máy), giải thích: *mất khoá thì có thể không cập nhật được app trên store*.
- Bật **Play App Signing** trên Google Play để Google giữ khoá phát hành.

## M4. Ranh giới bằng ESLint
Giống web, thay `next/*` bằng `react-native`:

| Thư mục | Cấm import |
|---|---|
| `src/domain/**` | `@/app/*`, `@/ui/*`, `@/services/*`, `@/data/*`, `react`, `react-native`, `@react-native-firebase/*` |
| `src/services/**` | `@/app/*`, `@/ui/*`, `@/data/*`, `react`, `react-native`, `@react-native-firebase/*` |
| `src/ui/**`, `src/app/**` | `@/data/*`, `@react-native-firebase/*` |
| `src/data/**` | `@/app/*`, `@/ui/*`, `react`, `react-native` |

## M5. Lệnh
| Lệnh | Việc |
|---|---|
| `npm run android` | Build + chạy trên máy ảo / điện thoại Android cắm dây |
| `npm run ios` | Build + chạy trên máy ảo iPhone (chỉ Mac) |
| `npm run check` | `tsc --noEmit` → ESLint → Jest → test `firestore.rules` trên Emulator |

Phát hành lên store là quy trình riêng (skill sau) — **luôn hỏi người dùng trước**, nói rõ chi phí tài khoản store.

## M6. Cho người dùng xem kết quả
- Ưu tiên chạy trên **máy ảo** và chụp màn hình gửi người dùng.
- Chạy trên điện thoại thật (Android): hướng dẫn bật *Chế độ nhà phát triển* + *Gỡ lỗi USB*, theo mẫu trình bày (tiêu đề = để làm gì, why/how, các bước).
