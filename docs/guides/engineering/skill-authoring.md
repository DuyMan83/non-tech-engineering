# Hướng dẫn viết skill

Skill là một thư mục chứa file `SKILL.md`, dạy AI cách làm một việc cụ thể theo quy trình bạn muốn.

## Cấu trúc một skill

```
skills/claude/ten-skill/
├── SKILL.md        # Bắt buộc: frontmatter + hướng dẫn
└── ...             # Tuỳ chọn: file mẫu, script, tài liệu tham khảo
```

## Frontmatter

```yaml
---
name: ten-skill            # chữ thường, nối bằng gạch ngang, trùng tên thư mục
description: Làm gì + KHI NÀO dùng. Đây là phần AI đọc để quyết định có gọi skill hay không.
---
```

## Quy tắc chung nằm ở AGENTS.md

Giọng nói, mẫu trình bày yêu cầu, việc phải hỏi trước, việc không bao giờ làm... đã có trong `templates/user/AGENTS.md` (cài cho mọi dự án). Skill **không cần lặp lại**, chỉ ghi phần riêng của mình — trừ hai trường hợp:
- Ràng buộc an toàn liên quan trực tiếp tới skill → **viết lặp lại** trong skill (lặp an toàn không sao, thiếu mới nguy).
- Skill có thể chạy **trước khi** AGENTS.md được cài (như `thiet-lap-moi-truong`) → tự mang đủ quy tắc.

## Nguyên tắc cho người non-tech

1. **Một skill = một việc.** Tránh skill "làm mọi thứ".
2. **Mô tả bằng ngôn ngữ đời thường** — người dùng sẽ gọi skill bằng câu nói tự nhiên.
3. **Chia bước rõ ràng**, có điểm dừng để người dùng xác nhận trước khi AI làm việc khó hoàn tác.
4. **Mọi yêu cầu người dùng làm gì đều kèm 1 câu ngắn "để làm gì"** (bấm nút, dán lệnh, nhập mật khẩu, tạo tài khoản...). Người non-tech làm theo tự tin hơn khi hiểu lý do, và dừng lại đúng lúc khi thấy điều gì không khớp.
5. **Trình bày yêu cầu theo mẫu chung**: **tiêu đề in đậm nói việc này để làm gì** → chữ thường giải thích ngắn why (vì sao cần) và how (sẽ làm thế nào) → lệnh (khối code riêng, có nút copy, 1 lệnh/khối) hoặc các bước (danh sách đánh số). Xem ví dụ trong `skills/claude/thiet-lap-moi-truong/SKILL.md`.
6. **Giải thích kết quả** bằng ngôn ngữ dễ hiểu, không chỉ in log kỹ thuật.
7. **An toàn trước**: không xoá dữ liệu, không push, không deploy khi chưa hỏi.
