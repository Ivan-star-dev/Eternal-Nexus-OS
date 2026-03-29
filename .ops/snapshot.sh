#!/usr/bin/env bash
set -euo pipefail
msg="${1:-snapshot}"
stamp="$(date +%Y%m%d-%H%M%S)"

git add -A
if git diff --cached --quiet; then
  echo "Nada para snapshot"
  exit 0
fi

git commit -m "snapshot: ${msg} @ ${stamp}"
