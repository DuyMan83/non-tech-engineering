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
fi

echo "Đã cài $count skill vào $DEST/skills"
