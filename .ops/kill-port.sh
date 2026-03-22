#!/usr/bin/env bash
set -euo pipefail
port="${1:?usa: ./.ops/kill-port.sh 5173}"

if command -v lsof >/dev/null 2>&1; then
  pids="$(lsof -tiTCP:$port -sTCP:LISTEN || true)"
elif command -v fuser >/dev/null 2>&1; then
  pids="$(fuser "$port"/tcp 2>/dev/null || true)"
else
  echo "Nem lsof nem fuser disponíveis"
  exit 1
fi

if [ -z "${pids:-}" ]; then
  echo "Nenhum processo a ouvir na porta $port"
  exit 0
fi

echo "A terminar PID(s): $pids"
kill -9 $pids
