# Agents

Mỗi file `.md` ở đây định nghĩa một **subagent** — một "trợ lý chuyên vai" mà agent chính có thể giao việc (ví dụ: lập kế hoạch, review code, viết test).

## Định dạng (Claude Code)

```markdown
---
name: ten-agent
description: Khi nào nên dùng agent này (viết rõ để Claude tự chọn đúng lúc).
tools: Read, Grep, Glob
---

Hướng dẫn chi tiết cho agent...
```

Cài đặt: `./scripts/install-skills.sh claude` cũng sẽ link các agent vào `~/.claude/agents`.
