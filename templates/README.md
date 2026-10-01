# Templates

File mẫu được cài vào máy người dùng hoặc vào từng dự án.

| Thư mục | Cài vào | Nội dung |
|---------|---------|----------|
| `user/` | `~/.claude/` (bằng `scripts/install-skills.sh claude`) | `AGENTS.md`: quy tắc chung khi làm việc với người non-tech, áp dụng cho mọi dự án |

## Claude Code đọc AGENTS.md thế nào?

Claude Code đọc `CLAUDE.md`, không tự đọc `AGENTS.md`. Script cài sẽ:
1. Link `templates/user/AGENTS.md` → `~/.claude/AGENTS.md`.
2. Thêm dòng `@AGENTS.md` vào `~/.claude/CLAUDE.md` (tạo file nếu chưa có; **không xoá nội dung có sẵn**).

Nhờ vậy nội dung chỉ viết một nơi. Codex (đọc `AGENTS.md` trực tiếp) sẽ có bản riêng khi bổ sung.
