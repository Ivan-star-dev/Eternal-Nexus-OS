#!/usr/bin/env bash
set -euo pipefail

echo
echo "===== STATUS ====="
git status

echo
echo "===== DIFF STAT ====="
git diff --stat

echo
echo "===== FILES ALTERADOS ====="
git diff --name-only

echo
echo "===== UNMERGED ====="
git diff --name-only --diff-filter=U || true

echo
echo "===== CONFLICT MARKERS ====="
grep -RInE '^(<<<<<<<|=======|>>>>>>>)' \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=coverage \
  . || true

echo
echo "===== COMMITS RECENTES ====="
git --no-pager log --oneline --decorate -n 15
