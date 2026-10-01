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
- Khung dự án web `templates/projects/web-nextjs-firebase/`: Next.js 16 xuất tĩnh + Firebase 12, 4 lớp có ESLint chặn import sai lớp, tính năng mẫu "việc cần làm" (đăng nhập ẩn danh), `npm run check` (tsc → ESLint → Vitest → test luật Firestore trên Emulator). Đã chạy thử trên cloud: check pass, build xuất tĩnh được, thử trên trình duyệt pass.
- Kiến trúc: rules chung clean architecture 4 lớp (`docs/architectures/_chung/clean-rules.md`), `web-nextjs-firebase` (xuất tĩnh, gói miễn phí), `mobile-expo-firebase` (Expo + EAS Build/Submit/Update).
- `docs/architectures/` chứa kiến trúc mẫu, kèm `_template`.
