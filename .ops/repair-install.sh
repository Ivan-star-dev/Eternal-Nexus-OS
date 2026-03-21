#!/usr/bin/env bash
set -euo pipefail
source ./.ops/_common.sh

echo "A limpar artefactos locais"
rm -rf node_modules dist coverage .turbo .vite

if [ -d .cache ]; then
  rm -rf .cache
fi

./.ops/bootstrap.sh
