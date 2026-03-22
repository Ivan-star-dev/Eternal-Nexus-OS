#!/usr/bin/env bash
set -euo pipefail
msg="${1:-guarded-change}"

./.ops/snapshot.sh "before ${msg}" || true
./.ops/check.sh
./.ops/review.sh
