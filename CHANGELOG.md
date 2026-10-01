# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi lại ở đây.
Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/).

## [Unreleased]

### Added
- Khung thư mục ban đầu: `.claude/`, `agents/`, `docs/`, `scripts/`, `skills/claude/`, `skills/codex/`.
- Template skill cho Claude (`skills/claude/_template`).
- Script `install-skills.sh` và `new-skill.sh`.
- `docs/guides/engineering`, `docs/guides/operational` cho tài liệu hướng dẫn theo mảng.
- Skill `thiet-lap-moi-truong` (`SKILL.md` + `tools.yaml`): cài Git, Node.js, VS Code, Claude extension, GitHub CLI (không dùng Homebrew; Firebase chạy qua npx); hướng dẫn tạo tài khoản GitHub, đăng nhập GitHub qua HTTPS, Firebase.
- `templates/user/AGENTS.md`: quy tắc chung cho mọi dự án (giọng nói, mẫu trình bày yêu cầu, việc phải hỏi trước, việc không bao giờ làm). `install-skills.sh` link vào `~/.claude/AGENTS.md` và thêm `@AGENTS.md` vào `~/.claude/CLAUDE.md`.
- `install-skills.sh` hỗ trợ Windows (chế độ copy, chạy lại an toàn) và không ghi đè skill / `AGENTS.md` của người dùng.
- `thiet-lap-moi-truong` cài thêm Java 21 cho Firebase Emulator; trên Windows kiểm tra winget trước, thiếu thì hướng dẫn cài App Installer từ Microsoft Store.
- Hướng dẫn thiết lập trong `docs/guides/operational/`, gồm `getting-started.md` (cài Claude → Git → tài khoản GitHub + lời mời → tải ZIP → cài bộ skill; repo đang private).
- Skill `lap-ke-hoach`: từ đề xuất đã duyệt → chặng (Làm được · Chưa có · Bạn tự thử · Máy tự kiểm), thứ tự và điểm dừng, rủi ro (Triệu chứng · Ngưỡng · Kiểm bằng · Lùi về), chiến lược kiểm thử dựa trên rủi ro (người dùng chỉ thử thứ cần mắt; máy kiểm phần còn lại; ưu tiên rủi ro → tích hợp → luật → unit cho ca rủi ro → giao diện; ma trận phủ mọi dòng nghiệm thu). Có mẫu, ví dụ, `kiem-tra-ke-hoach.mjs` đối chiếu với đề xuất.
- Test tích hợp trong cả hai khung (`tests/tasks.integration.test.ts`: services → data thật → Firestore Emulator có luật); `npm run test:rules` đổi thành `npm run test:emulator`. Đã thử: làm hỏng lớp data thì unit vẫn xanh nhưng test tích hợp đỏ.
- Skill `de-xuat-tinh-nang`: viết đề xuất trước khi code — Hiện trạng → Mục tiêu → Khoảng cách → Giải pháp (người dùng thấy gì; thành phần / dữ liệu / luồng nhìn từ người dùng; quyết định sản phẩm; cách kiểm chứng gồm checklist người dùng tự thử + test tự động) → Rủi ro & chi phí → Phạm vi → Hỏi đáp → Phụ lục nguồn quyết định. Có mẫu, ví dụ và `kiem-tra-de-xuat.mjs` kiểm tra đủ mục. Nối vào clean-rules (bước 0 khi thêm tính năng) và các `AGENTS.md`.
- Khung mobile `templates/projects/mobile-expo-firebase/`: Expo SDK 57 + Expo Router + Firebase JS SDK (giữ phiên đăng nhập bằng AsyncStorage, kết nối bộ giả lập qua Wi-Fi), domain/services giống khung web, `config/dev.env` / `config/production.env`, `eas.json`. Lệnh: `npm start [môi trường]`, `npm run build [môi trường] [android|ios|all]` (dev = đóng gói thử miễn phí, production = EAS build có xác nhận), `npm run deploy [môi trường] [update|store]` (EAS Update tới người dùng thật hoặc lên store, có xác nhận), `--thu` để xem trước lệnh. Đã thử trên cloud: check pass, Metro đóng gói Android + iOS được, tạo dự án mới từ khung pass. Chưa chạy trên điện thoại thật / EAS thật.
- Khung web có sẵn cấu hình môi trường `config/dev.env`, `config/production.env` và lệnh `npm start [môi trường]` (mặc định dev), `npm run build [môi trường]` (mặc định dev), `npm run deploy [môi trường]` (mặc định production, bắt buộc xác nhận vì ghi đè bản đang chạy). Script Node chạy được trên macOS/Windows.
- Skill `tao-khung-du-an`: hỏi tên/mô tả app → `tao-du-an.mjs` copy khung + điền thông tin → `npm install` → `npm run check` → lưu điểm đầu tiên → (hỏi) tạo repo GitHub riêng tư → chạy thử cho người dùng xem. Đã chạy thử trọn quy trình trên cloud.
- Khung dự án web `templates/projects/web-nextjs-firebase/`: Next.js 16 xuất tĩnh + Firebase 12, 4 lớp có ESLint chặn import sai lớp, tính năng mẫu "việc cần làm" (đăng nhập ẩn danh), `npm run check` (tsc → ESLint → Vitest → test luật Firestore trên Emulator). Đã chạy thử trên cloud: check pass, build xuất tĩnh được, thử trên trình duyệt pass.
- Kiến trúc: rules chung clean architecture 4 lớp (`docs/architectures/_chung/clean-rules.md`), `web-nextjs-firebase` (xuất tĩnh, gói miễn phí), `mobile-expo-firebase` (Expo + EAS Build/Submit/Update).
- `docs/architectures/` chứa kiến trúc mẫu, kèm `_template`.
