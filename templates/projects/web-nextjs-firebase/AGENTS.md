# {{TEN_DU_AN}}

Sổ tay dự án — AI đọc file này đầu mỗi phiên và **cập nhật sau mỗi thay đổi lớn**, trước khi lưu điểm.

## App làm gì
{{MO_TA}}

## Kiến trúc
- Web Next.js + Firebase, xuất tĩnh, gói Spark miễn phí.
- **Rules bắt buộc:** [`docs/kien-truc/clean-rules.md`](docs/kien-truc/clean-rules.md) và [`docs/kien-truc/rules.md`](docs/kien-truc/rules.md).
- 4 lớp: `src/domain` → `src/services` → `src/data` (Firebase) / `src/ui` → `src/app`. Nối ở `src/composition.ts`.

## Môi trường (`config/`)
| File | Môi trường | Dữ liệu |
|---|---|---|
| `config/dev.env` | **dev** (mặc định) | Bộ giả lập trên máy — dữ liệu thử |
| `config/production.env` | **production** | Firebase thật — dữ liệu THẬT. Điền từ Firebase console khi đưa lên mạng lần đầu |

## Lệnh
| Lệnh | Việc |
|---|---|
| `npm start` | Chạy **dev** trên máy — mở http://localhost:3000 |
| `npm start production` | Chạy trên máy với **dữ liệu thật** — cần xác nhận |
| `npm run build` / `npm run build production` | Build bản dev (mặc định) / production → thư mục `out/` |
| `npm run check` | Kiểm tra toàn bộ: kiểu dữ liệu → ranh giới lớp → test → luật bảo mật. **Phải pass trước khi lưu điểm.** |
| `npm run deploy` | Đưa bản **production** lên mạng, **ghi đè** bản đang chạy — cần xác nhận |

**Xác nhận:** `npm start production` và `npm run deploy` tự dừng và in cảnh báo nếu chưa xác nhận. AI phải **trình bày cảnh báo cho người dùng, chờ họ đồng ý**, rồi mới chạy lại với `-- --xac-nhan`. Không bao giờ tự thêm `--xac-nhan` khi người dùng chưa đồng ý.

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

## Đề xuất (`docs/de-xuat/`)
Tính năng mới → viết đề xuất trước (skill `de-xuat-tinh-nang`), người dùng duyệt rồi mới code. "Xong" = `npm run check` pass + người dùng thử hết checklist trong đề xuất.

| Ngày | Đề xuất | Trạng thái |
|---|---|---|
| — | — | — |

## Đang dở / bước tiếp theo
- Khung dự án vừa tạo, chưa có tính năng riêng.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
