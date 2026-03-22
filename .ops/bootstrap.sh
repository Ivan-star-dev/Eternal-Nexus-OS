#!/usr/bin/env bash
set -euo pipefail
source ./.ops/_common.sh

say "bootstrap"

command -v node >/dev/null 2>&1 || { echo "Node não encontrado"; exit 1; }

if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
fi

case "$(pm)" in
  pnpm)
    command -v pnpm >/dev/null 2>&1 || { echo "pnpm não encontrado"; exit 1; }
    if [ -f pnpm-lock.yaml ]; then
      pnpm install --frozen-lockfile
    else
      pnpm install
    fi
    ;;
  npm)
    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install
    fi
    ;;
  yarn)
    if [ -f yarn.lock ]; then
      yarn install --frozen-lockfile || yarn install
    else
      yarn install
    fi
    ;;
esac
