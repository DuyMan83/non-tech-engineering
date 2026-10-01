# Rules riêng: Web Next.js + Firebase

**Đọc trước:** [`../_chung/clean-rules.md`](../_chung/clean-rules.md). File này chỉ ghi phần riêng cho web.

## Cấu trúc

```
.
├── src/
│   ├── app/              # Next.js App Router: page.tsx, layout.tsx — mỏng
│   ├── ui/               # Component React ("use client" khi cần state / Firebase qua services)
│   ├── services/         # Use case + interface repository
│   ├── domain/           # Quy tắc nghiệp vụ thuần
│   ├── data/             # Firebase SDK (web): firebase.ts khởi tạo + các repository
│   └── composition.ts    # Nối data → services
├── firestore.rules
├── firestore.indexes.json
├── firebase.json         # Hosting trỏ tới out/
├── .env.development      # Chạy trên máy: Emulator + dự án demo (commit được, không có bí mật)
├── .env.production.example  # Mẫu cấu hình thật
├── .env.production.local # Cấu hình Firebase thật cho build/deploy — KHÔNG commit
├── AGENTS.md / CLAUDE.md
└── package.json          # scripts: dev, build, check, deploy
```

## W1. Xuất tĩnh (bắt buộc với gói miễn phí)
- `next.config` có `output: 'export'` và `images: { unoptimized: true }`.
- **Không dùng**: Server Actions, Route Handlers (`app/api/...`), `cookies()`, `headers()`, middleware, ISR/revalidate, `next/image` tối ưu phía server.
- **Đường dẫn động** (`/booking/[id]`): ưu tiên dùng query (`/booking?id=...`) và đọc dữ liệu phía trình duyệt. Chỉ dùng `[id]` khi biết trước danh sách id lúc build (`generateStaticParams`).
- Muốn dùng tính năng cần máy chủ → **dừng, hỏi người dùng** (chuyển lên App Hosting = gói Blaze, cần thẻ).

## W2. Client vs Server component
- Trang trong `app/` có thể là server component (chỉ chạy lúc build), nhưng **không gọi Firebase** ở đó.
- Component cần dữ liệu người dùng / Firebase → `"use client"` trong `ui/`, lấy dữ liệu qua `services/` (thông qua `composition.ts`).

## W3. Firebase
- Khởi tạo SDK **một lần** trong `src/data/firebase.ts`, đọc cấu hình từ `process.env.NEXT_PUBLIC_FIREBASE_*`.
- `npm run dev` dùng `.env.development` (Emulator, dự án `demo-...`) — **không bao giờ đụng dữ liệu thật**.
- `npm run build` / `deploy` dùng `.env.production.local` (không commit), tạo từ `.env.production.example`.
- Phát triển và test dùng **Firebase Emulator** (Auth + Firestore), không đụng dữ liệu thật. Emulator cần **Java 21+** (skill `thiet-lap-moi-truong` cài).

## W4. Ranh giới bằng ESLint
Cấu hình `no-restricted-imports` theo thư mục (ví dụ):

| Thư mục | Cấm import |
|---|---|
| `src/domain/**` | `@/app/*`, `@/ui/*`, `@/services/*`, `@/data/*`, `react`, `next/*`, `firebase/*` |
| `src/services/**` | `@/app/*`, `@/ui/*`, `@/data/*`, `react`, `next/*`, `firebase/*` |
| `src/ui/**`, `src/app/**` | `@/data/*`, `firebase/*` |
| `src/data/**` | `@/app/*`, `@/ui/*`, `react`, `next/*` |

## W5. Lệnh
| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy thử trên máy (cùng Emulator) |
| `npm run check` | `tsc --noEmit` → ESLint → Vitest → test `firestore.rules` trên Emulator |
| `npm run build` | Xuất tĩnh ra `out/` |
| `npm run deploy` | `build` rồi `firebase deploy --only hosting,firestore:rules` — **hỏi người dùng trước** |

## W6. PWA (cài lên màn hình chính)
- Có `manifest.webmanifest` + icon. Không thêm service worker phức tạp khi chưa cần offline.
