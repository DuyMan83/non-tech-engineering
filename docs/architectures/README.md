# Architectures

Mỗi kiến trúc là một thư mục `docs/architectures/<ten-kien-truc>/`, bắt đầu từ bản sao của [`_template`](_template/).
Skill đọc thư mục này để biết dựng dự án theo kiến trúc nào.

| Kiến trúc | Dùng khi |
|---|---|
| [`_chung/clean-rules.md`](_chung/clean-rules.md) | Rules chung cho mọi kiến trúc: 4 lớp, ranh giới, `npm run check`, bảo mật, sổ tay dự án |
| [`web-nextjs-firebase`](web-nextjs-firebase/) | **Mặc định.** Web app (cài lên màn hình chính được — PWA), miễn phí |
| [`mobile-react-native-firebase`](mobile-react-native-firebase/) | Cần lên App Store / Google Play hoặc tính năng máy |
