#!/usr/bin/env bash
set -euo pipefail
target="${1:-HEAD~1}"

git reset --hard "$target"
git clean -fd
echo "Rollback feito para $target"
