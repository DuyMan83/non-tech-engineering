# {{TEN_DU_AN}}

Sổ tay dự án — AI đọc file này đầu mỗi phiên và **cập nhật sau mỗi thay đổi lớn**, trước khi lưu điểm.

## App làm gì
{{MO_TA}}

## Kiến trúc
- Web Next.js + Firebase, xuất tĩnh, gói Spark miễn phí.
- **Rules bắt buộc:** [`docs/kien-truc/clean-rules.md`](docs/kien-truc/clean-rules.md) và [`docs/kien-truc/rules.md`](docs/kien-truc/rules.md).
- 4 lớp: `src/domain` → `src/services` → `src/data` (Firebase) / `src/ui` → `src/app`. Nối ở `src/composition.ts`.

## Lệnh
| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy thử trên máy với Firebase Emulator (không đụng dữ liệu thật) — mở http://localhost:3000 |
| `npm run check` | Kiểm tra toàn bộ: kiểu dữ liệu → ranh giới lớp → test → luật bảo mật. **Phải pass trước khi lưu điểm.** |
| `npm run deploy` | Đưa lên mạng — **hỏi người dùng trước** |

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
| {{NGAY_TAO}} | Tạo từ khung dự án `web-nextjs-firebase` | — |

## Đang dở / bước tiếp theo
- Khung dự án vừa tạo, chưa có tính năng riêng.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
