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
├── config/
│   ├── dev.env           # Môi trường dev: Emulator + dự án demo-... (mặc định)
│   └── production.env    # Môi trường production: cấu hình Firebase thật (không phải bí mật, được commit)
├── scripts/              # build.mjs, run.mjs, deploy.mjs — đọc config/<môi trường>.env
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
- Mỗi môi trường là **một file `config/<tên>.env`**. Thêm môi trường (vd `staging`) = thêm file `config/staging.env`.
- Không dùng file `.env*` của Next.js (bị `.gitignore` chặn) — để tránh hai nguồn cấu hình.
- `config/*.env` chỉ chứa cấu hình Firebase phía web (không phải bí mật). **Bí mật thật không bao giờ ghi vào đây.**
- `dev` luôn dùng bộ giả lập (`NEXT_PUBLIC_USE_EMULATORS=true`, dự án `demo-...`) — **không bao giờ đụng dữ liệu thật**.
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
| Lệnh | Mặc định | Việc |
|---|---|---|
| `npm start [môi trường]` | `dev` | `dev`: Next.js + Emulator, http://localhost:3000. Môi trường thật: build rồi chạy trên máy (http://localhost:5002) với **dữ liệu thật** — cần xác nhận |
| `npm run build [môi trường]` | `dev` | Xuất tĩnh ra `out/` với cấu hình `config/<môi trường>.env` |
| `npm run deploy [môi trường]` | `production` | `check` → `build` → `firebase deploy --only hosting,firestore`. **Ghi đè** bản trên mạng — cần xác nhận. Không deploy được `dev` |
| `npm run check` | — | `tsc --noEmit` → ESLint → Vitest → test `firestore.rules` trên Emulator |

**Xác nhận việc nguy hiểm** (`start <thật>`, `deploy`): script tự in cảnh báo và dừng nếu chưa có `--xac-nhan`.
AI **trình bày cảnh báo cho người dùng theo mẫu trình bày, chờ họ đồng ý**, rồi mới chạy lại với `-- --xac-nhan` (vd `npm run deploy -- --xac-nhan`). Người dùng tự gõ lệnh trong Terminal → script hỏi họ gõ lại mã dự án.
**Xem trước**: thêm `-- --thu` để in cảnh báo + các lệnh sẽ chạy mà không chạy thật.
Triển khai / lùi bản: theo skill `trien-khai-phien-ban-moi` (chỉ từ `main`, có phiếu triển khai, ghi `docs/phien-ban.md`).

## W6. PWA (cài lên màn hình chính)
- Có `manifest.webmanifest` + icon. Không thêm service worker phức tạp khi chưa cần offline.
