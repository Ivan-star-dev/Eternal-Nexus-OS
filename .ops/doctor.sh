#!/usr/bin/env bash
set -euo pipefail
source ./.ops/_common.sh

say "versions"
command -v git >/dev/null 2>&1 && git --version || true
command -v node >/dev/null 2>&1 && node -v || echo "node: ausente"
command -v pnpm >/dev/null 2>&1 && pnpm -v || echo "pnpm: ausente"

say "package manager"
echo "detetado: $(pm)"
if [ -f package.json ] && command -v node >/dev/null 2>&1; then
  node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8')); console.log('packageManager:', p.packageManager || '(não definido)')"
fi

say "lockfiles"
count=0
for f in pnpm-lock.yaml package-lock.json yarn.lock bun.lockb bun.lock; do
  if [ -f "$f" ]; then
    echo "found: $f"
    count=$((count+1))
  fi
done
if [ "$count" -gt 1 ]; then
  echo "ERRO: mais de um lockfile detetado"
fi

say "git status"
git status --short || true

say "unmerged files"
git diff --name-only --diff-filter=U || true

say "conflict markers"
grep -RInE '^(<<<<<<<|=======|>>>>>>>)' \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=coverage \
  . || true

say "common ports"
for p in 5173 4173 3000; do
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:$p -sTCP:LISTEN -n -P || true
  fi
done
