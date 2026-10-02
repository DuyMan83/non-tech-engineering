#!/usr/bin/env bash
# Cài skills, agents và AGENTS.md vào thư mục cấu hình của công cụ.
# Dùng: ./scripts/install-skills.sh [claude|codex]
#
# macOS/Linux: tạo symlink (sửa trong repo là máy dùng bản mới ngay).
# Windows (Git Bash): COPY, vì Git Bash không tạo symlink thật — sửa repo xong phải chạy lại script.
# Chỉ ghi đè những gì do bộ skill này cài (symlink, hoặc có dấu MARKER); của người dùng thì giữ nguyên.
set -euo pipefail

TOOL="${1:-claude}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MARKER="non-tech-engineering"          # file .non-tech-engineering trong thư mục / chuỗi trong file

case "$TOOL" in
  claude) DEST="$HOME/.claude" ;;
  codex)  DEST="$HOME/.codex" ;;
  *) echo "Công cụ không hỗ trợ: $TOOL (chọn claude hoặc codex)"; exit 1 ;;
esac

COPY_MODE=0
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) COPY_MODE=1 ;; esac
[ "${NTE_COPY_MODE:-}" = "1" ] && COPY_MODE=1   # để thử chế độ Windows trên máy khác

# Có phải do bộ skill này cài không?
is_ours() {
  local dst="$1"
  [ -L "$dst" ] && return 0
  [ -d "$dst" ] && [ -f "$dst/.$MARKER" ] && return 0
  [ -f "$dst" ] && grep -q "$MARKER" "$dst" && return 0
  return 1
}

# Cài 1 thư mục hoặc 1 file. Trả về 1 nếu bỏ qua vì đụng đồ của người dùng.
install_item() {
  local src="$1" dst="$2"
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    if ! is_ours "$dst"; then
      echo "  ! $dst đã có sẵn và không phải do bộ skill tạo — giữ nguyên, bỏ qua."
      return 1
    fi
    rm -rf "$dst"
  fi
  if [ "$COPY_MODE" = "1" ]; then
    cp -R "$src" "$dst"
    if [ -d "$dst" ]; then touch "$dst/.$MARKER"; fi
  else
    ln -s "$src" "$dst"
  fi
  return 0
}

mkdir -p "$DEST/skills"
count=0
for dir in "$ROOT/skills/$TOOL"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  [[ "$name" == _* ]] && continue   # bỏ qua template
  if install_item "${dir%/}" "$DEST/skills/$name"; then
    echo "  ✓ skill: $name"
    count=$((count + 1))
  fi
done

if [ "$TOOL" = "claude" ]; then
  mkdir -p "$DEST/agents"
  for f in "$ROOT"/agents/*.md; do
    [ -f "$f" ] || continue
    [ "$(basename "$f")" = "README.md" ] && continue
    install_item "$f" "$DEST/agents/$(basename "$f")" && echo "  ✓ agent: $(basename "$f" .md)"
  done

  # AGENTS.md tầng người dùng + import từ CLAUDE.md (không xoá nội dung có sẵn)
  if install_item "$ROOT/templates/user/AGENTS.md" "$DEST/AGENTS.md"; then
    touch "$DEST/CLAUDE.md"
    if ! grep -qxF "@AGENTS.md" "$DEST/CLAUDE.md"; then
      [ -s "$DEST/CLAUDE.md" ] && printf '\n' >> "$DEST/CLAUDE.md"
      printf '@AGENTS.md\n' >> "$DEST/CLAUDE.md"
    fi
    echo "  ✓ AGENTS.md (đã import trong CLAUDE.md)"
  fi
fi

mode="link"; [ "$COPY_MODE" = "1" ] && mode="copy — sửa repo xong nhớ chạy lại script"
echo "Đã cài $count skill vào $DEST/skills ($mode)"
