#!/usr/bin/env bash
# Cài (symlink) skills và agents vào thư mục cấu hình của công cụ.
# Dùng: ./scripts/install-skills.sh [claude|codex]
set -euo pipefail

TOOL="${1:-claude}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

case "$TOOL" in
  claude) DEST="$HOME/.claude" ;;
  codex)  DEST="$HOME/.codex" ;;
  *) echo "Công cụ không hỗ trợ: $TOOL (chọn claude hoặc codex)"; exit 1 ;;
esac

SRC="$ROOT/skills/$TOOL"
mkdir -p "$DEST/skills"

count=0
for dir in "$SRC"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  [[ "$name" == _* ]] && continue   # bỏ qua template
  ln -sfn "${dir%/}" "$DEST/skills/$name"
  echo "  ✓ skill: $name"
  count=$((count + 1))
done

if [ "$TOOL" = "claude" ]; then
  mkdir -p "$DEST/agents"
  for f in "$ROOT"/agents/*.md; do
    [ -f "$f" ] || continue
    [ "$(basename "$f")" = "README.md" ] && continue
    ln -sfn "$f" "$DEST/agents/$(basename "$f")"
    echo "  ✓ agent: $(basename "$f" .md)"
  done

  # AGENTS.md tầng người dùng: link vào ~/.claude và import từ CLAUDE.md
  AGENTS_SRC="$ROOT/templates/user/AGENTS.md"
  if [ -e "$DEST/AGENTS.md" ] && [ ! -L "$DEST/AGENTS.md" ]; then
    echo "  ! $DEST/AGENTS.md đã có sẵn và không phải do bộ skill tạo — giữ nguyên, bỏ qua."
  else
    ln -sfn "$AGENTS_SRC" "$DEST/AGENTS.md"
    touch "$DEST/CLAUDE.md"
    if ! grep -qxF "@AGENTS.md" "$DEST/CLAUDE.md"; then
      [ -s "$DEST/CLAUDE.md" ] && printf '\n' >> "$DEST/CLAUDE.md"
      printf '@AGENTS.md\n' >> "$DEST/CLAUDE.md"
    fi
    echo "  ✓ AGENTS.md (đã import trong CLAUDE.md)"
  fi
fi

echo "Đã cài $count skill vào $DEST/skills"
