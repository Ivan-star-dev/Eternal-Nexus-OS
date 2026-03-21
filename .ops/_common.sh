#!/usr/bin/env bash
set -euo pipefail

pm() {
  if [ -f pnpm-lock.yaml ]; then
    echo pnpm
  elif [ -f package-lock.json ]; then
    echo npm
  elif [ -f yarn.lock ]; then
    echo yarn
  elif [ -f package.json ] && command -v node >/dev/null 2>&1; then
    node -e "const fs=require('fs'); try { const p=JSON.parse(fs.readFileSync('package.json','utf8')); const v=p.packageManager||''; if (v.startsWith('pnpm@')) process.stdout.write('pnpm'); else if (v.startsWith('yarn@')) process.stdout.write('yarn'); else process.stdout.write('npm'); } catch { process.stdout.write('npm'); }"
  else
    echo npm
  fi
}

has_script() {
  local script="$1"
  [ -f package.json ] || return 1
  command -v node >/dev/null 2>&1 || return 1
  node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8')); process.exit(p.scripts && p.scripts['$script'] ? 0 : 1)"
}

run_script() {
  local script="$1"
  case "$(pm)" in
    pnpm) pnpm run "$script" ;;
    npm) npm run "$script" ;;
    yarn) yarn "$script" ;;
  esac
}

run_exec() {
  local cmd="$1"; shift || true
  case "$(pm)" in
    pnpm) pnpm exec "$cmd" "$@" ;;
    npm) npx "$cmd" "$@" ;;
    yarn) yarn "$cmd" "$@" ;;
  esac
}

say() {
  printf '\n==> %s\n' "$1"
}
