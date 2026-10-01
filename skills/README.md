# Skills

Nguồn chính của tất cả skill, chia theo công cụ:

| Thư mục   | Công cụ     | Trạng thái     |
|-----------|-------------|----------------|
| `claude/` | Claude Code | Đang phát triển |
| `codex/`  | Codex       | Sẽ bổ sung     |

Thư mục bắt đầu bằng `_` (ví dụ `_template`) là mẫu, không được cài.

## Quy ước

- Mỗi skill **tự chứa** mọi file nó cần (ví dụ `tools.yaml`) trong thư mục của mình.
- Skill Claude và skill Codex **không dùng chung file dữ liệu**: môi trường mỗi công cụ có thể khác nhau, nên mỗi bên giữ bản riêng và tự điều chỉnh.
