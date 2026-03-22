#!/usr/bin/env bash
set -euo pipefail
source ./.ops/_common.sh

[ -f package.json ] || { echo "package.json ausente"; exit 1; }

for script in format:check lint; do
  if has_script "$script"; then
    say "running $script"
    run_script "$script"
  fi
done

if has_script "typecheck"; then
  say "running typecheck"
  run_script "typecheck"
elif ls tsconfig*.json >/dev/null 2>&1; then
  say "running fallback tsc --noEmit"
  run_exec tsc --noEmit
fi

if has_script "test"; then
  say "running test"
  run_script "test"
fi

if has_script "build"; then
  say "running build"
  run_script "build"
fi
