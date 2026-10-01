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
- Hướng dẫn thiết lập trong `docs/guides/operational/`, gồm `getting-started.md` (cài Claude → Git → tài khoản GitHub + lời mời → tải ZIP → cài bộ skill; repo đang private).
- `docs/architectures/` chứa kiến trúc mẫu, kèm `_template`.
