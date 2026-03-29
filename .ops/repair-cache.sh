#!/usr/bin/env bash
set -euo pipefail
source ./.ops/_common.sh

case "$(pm)" in
  pnpm)
    pnpm store prune
    ;;
  npm)
    npm cache verify || true
    ;;
  yarn)
    echo "Yarn cache cleanup manual não incluído"
    ;;
esac

rm -rf node_modules/.vite .vite
echo "Cache local limpa"
