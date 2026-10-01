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

## Nguyên tắc cho người non-tech

1. **Một skill = một việc.** Tránh skill "làm mọi thứ".
2. **Mô tả bằng ngôn ngữ đời thường** — người dùng sẽ gọi skill bằng câu nói tự nhiên.
3. **Chia bước rõ ràng**, có điểm dừng để người dùng xác nhận trước khi AI làm việc khó hoàn tác.
4. **Mọi yêu cầu người dùng làm gì đều kèm 1 câu ngắn "để làm gì"** (bấm nút, dán lệnh, nhập mật khẩu, tạo tài khoản...). Người non-tech làm theo tự tin hơn khi hiểu lý do, và dừng lại đúng lúc khi thấy điều gì không khớp.
5. **Giải thích kết quả** bằng ngôn ngữ dễ hiểu, không chỉ in log kỹ thuật.
6. **An toàn trước**: không xoá dữ liệu, không push, không deploy khi chưa hỏi.
