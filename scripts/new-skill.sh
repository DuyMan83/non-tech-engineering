#!/usr/bin/env bash
# Tạo skill mới từ template.
# Dùng: ./scripts/new-skill.sh <claude|codex> <ten-skill>
set -euo pipefail

TOOL="${1:?Thiếu tên công cụ (claude|codex)}"
NAME="${2:?Thiếu tên skill}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$ROOT/skills/$TOOL/$NAME"

if [ -e "$TARGET" ]; then
  echo "Skill đã tồn tại: $TARGET"; exit 1
fi

mkdir -p "$TARGET"
sed "s/^name: _template$/name: $NAME/" "$ROOT/skills/claude/_template/SKILL.md" > "$TARGET/SKILL.md"
echo "Đã tạo $TARGET/SKILL.md"
