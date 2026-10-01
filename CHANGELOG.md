# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi lại ở đây.
Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/).

## [Unreleased]

### Added
- Khung thư mục ban đầu: `.claude/`, `agents/`, `docs/`, `scripts/`, `skills/claude/`, `skills/codex/`.
- Template skill cho Claude (`skills/claude/_template`).
- Script `install-skills.sh` và `new-skill.sh`.
- `docs/guides/engineering`, `docs/guides/operational` cho tài liệu hướng dẫn theo mảng.
- Skill `thiet-lap-moi-truong` (`SKILL.md` + `tools.yaml`): cài Git, Node.js, VS Code, Claude extension, GitHub CLI, Firebase CLI; hướng dẫn tạo tài khoản GitHub, đăng nhập GitHub qua HTTPS, Firebase.
- Hướng dẫn thiết lập trong `docs/guides/operational/`, gồm `getting-started.md` (cài Claude → Git → bộ skill).
- `docs/architectures/` chứa kiến trúc mẫu, kèm `_template`.
