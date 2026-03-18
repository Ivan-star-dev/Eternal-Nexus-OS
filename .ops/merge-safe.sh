#!/usr/bin/env bash
set -euo pipefail

target="${1:-origin/main}"

git config --local rerere.enabled true
git config --local rerere.autoupdate true
git config --local merge.conflictStyle zdiff3

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree suja; a criar snapshot antes do merge"
  ./.ops/snapshot.sh "before merge $(echo "$target" | tr '/' '-')"
fi

git fetch --all --prune || true

set +e
git merge "$target"
status=$?
set -e

if [ "$status" -ne 0 ]; then
  echo
  echo "Merge com conflitos. Lista:"
  git diff --name-only --diff-filter=U || true
  echo
  echo "Depois de resolver:"
  echo "  git add <ficheiros>"
  echo "  git commit -m 'resolve merge conflicts'"
  exit 1
fi

echo "Merge concluído"
