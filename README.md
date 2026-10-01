# non-tech-engineering

Bộ **skills** và **agents** giúp người không chuyên kỹ thuật (non-tech) có thể *vibe coding* với AI coding agent (Claude Code, sau này là Codex) một cách an toàn và có quy trình.

## Cấu trúc thư mục

```
.
├── .claude/          # Cấu hình Claude Code cho chính repo này (settings, skills được link vào)
├── agents/           # Định nghĩa subagent (vai trò chuyên biệt: reviewer, planner, ...)
├── docs/             # Tài liệu hướng dẫn: cách dùng, cách viết skill, quy ước
├── scripts/          # Script tiện ích: cài skills, tạo skill mới, ...
├── skills/           # Nguồn chính của các skill
│   ├── claude/       # Skill cho Claude Code (mỗi skill là 1 thư mục có SKILL.md)
│   └── codex/        # Skill cho Codex (sẽ bổ sung sau)
├── .gitignore
├── CHANGELOG.md
└── README.md
```

## Bắt đầu nhanh

1. Clone repo về máy.
2. Cài skills cho Claude Code (link vào `~/.claude/skills`):
   ```bash
   ./scripts/install-skills.sh claude
   ```
3. Mở Claude Code và gõ `/` để thấy các skill vừa cài.

## Tạo skill mới

```bash
./scripts/new-skill.sh claude ten-skill-moi
```

Sau đó chỉnh file `skills/claude/ten-skill-moi/SKILL.md`. Xem hướng dẫn chi tiết tại [docs/skill-authoring.md](docs/skill-authoring.md).
