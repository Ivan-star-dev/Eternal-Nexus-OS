#!/usr/bin/env bash
set -euo pipefail

echo "### Unmerged files"
git diff --name-only --diff-filter=U || true

echo
echo "### Conflict markers in tracked files"
git ls-files | while IFS= read -r f; do
  [ -f "$f" ] || continue
  grep -nE '^(<<<<<<<|=======|>>>>>>>)' "$f" && echo "-- $f" || true
done
