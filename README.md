# non-tech-engineering

Bộ **skills** và **agents** giúp người không chuyên kỹ thuật (non-tech) có thể *vibe coding* với AI coding agent (Claude Code, sau này là Codex) một cách an toàn và có quy trình.

## Cấu trúc thư mục

```
.
├── .claude/          # Cấu hình Claude Code cho chính repo này (settings, skills được link vào)
├── agents/           # Định nghĩa subagent (vai trò chuyên biệt: reviewer, planner, ...)
├── docs/
│   ├── architectures/    # Kiến trúc mẫu, mỗi kiến trúc 1 thư mục: <ten-kien-truc>/
│   └── guides/
│       ├── engineering/  # Hướng dẫn kỹ thuật
│       └── operational/  # Hướng dẫn vận hành
├── scripts/          # Script tiện ích: cài skills, tạo skill mới, ...
├── skills/           # Nguồn chính của các skill
│   ├── claude/       # Skill cho Claude Code (mỗi skill là 1 thư mục có SKILL.md)
│   └── codex/        # Skill cho Codex (sẽ bổ sung sau)
├── .gitignore
├── CHANGELOG.md
└── README.md
```

## Bắt đầu nhanh

**Người dùng non-tech:** làm theo [docs/guides/operational/getting-started.md](docs/guides/operational/getting-started.md) (cài Claude → cài Git → cài bộ skill → "Thiết lập môi trường cho tôi").

**Người phát triển:**
```bash
git clone https://github.com/DuyMan83/non-tech-engineering.git
cd non-tech-engineering && ./scripts/install-skills.sh claude
```
Trên Windows, chạy trong **Git Bash**. Lưu ý: Git Bash mặc định *copy* thay vì tạo symlink, nên sửa skill trong repo xong phải chạy lại script.

## Tạo skill mới

```bash
./scripts/new-skill.sh claude ten-skill-moi
```

Sau đó chỉnh file `skills/claude/ten-skill-moi/SKILL.md`. Xem hướng dẫn chi tiết tại [docs/guides/engineering/skill-authoring.md](docs/guides/engineering/skill-authoring.md).
