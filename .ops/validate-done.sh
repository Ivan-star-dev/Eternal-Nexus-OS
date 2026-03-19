#!/usr/bin/env bash
set -euo pipefail
#
# validate-done.sh — Verify done-state evidence when tasks are moved to done/
#
# Rules:
# 1. Any task file in docs/task-queue/done/ must have acceptance criteria
# 2. Done task must have all criteria checked (- [x])
# 3. Warns if no execution log exists in NEXUS_CONTEXT/LOGS/
#
# Exit 0 = pass (or no done tasks in this PR), Exit 1 = fail
#

DONE_DIR="docs/task-queue/done"

if [ ! -d "$DONE_DIR" ]; then
  echo "✅ No done/ directory — skip"
  exit 0
fi

# Get files added/modified in this PR (or current diff against main)
if [ -n "${GITHUB_BASE_REF:-}" ]; then
  CHANGED=$(git diff --name-only "origin/${GITHUB_BASE_REF}...HEAD" -- "$DONE_DIR" 2>/dev/null || echo "")
else
  CHANGED=$(git diff --name-only main...HEAD -- "$DONE_DIR" 2>/dev/null || echo "")
fi

if [ -z "$CHANGED" ]; then
  echo "✅ No tasks moved to done/ in this change — skip"
  exit 0
fi

FAIL=0

for file in $CHANGED; do
  [ -f "$file" ] || continue
  echo "🔍 Checking done evidence: $file"

  # Must have acceptance criteria section
  if ! grep -qi 'acceptance.criteria\|## Acceptance\|## Done' "$file"; then
    echo "❌ FAIL: $file has no acceptance criteria section"
    FAIL=1
    continue
  fi

  # Count checked vs unchecked boxes
  CHECKED=$(grep -c '\- \[x\]' "$file" 2>/dev/null || echo 0)
  UNCHECKED=$(grep -c '\- \[ \]' "$file" 2>/dev/null || echo 0)
  TOTAL=$((CHECKED + UNCHECKED))

  if [ "$TOTAL" -eq 0 ]; then
    echo "⚠️  WARNING: $file has no checkbox criteria — cannot verify done-state"
  elif [ "$UNCHECKED" -gt 0 ]; then
    echo "❌ FAIL: $file has $UNCHECKED unchecked acceptance criteria ($CHECKED/$TOTAL passed)"
    FAIL=1
  else
    echo "✅ $file: all $CHECKED criteria checked"
  fi

  # Extract task ID for log check
  TASK_ID=$(grep -oEi 'id:\s*(C|U|A|R|X)[0-9]+' "$file" | head -1 | sed 's/id:\s*//' | tr -d ' ')
  if [ -n "$TASK_ID" ]; then
    LOG_FOUND=$(find NEXUS_CONTEXT/LOGS/ -name "*${TASK_ID}*" 2>/dev/null | head -1)
    if [ -z "$LOG_FOUND" ]; then
      echo "⚠️  WARNING: No execution log found for $TASK_ID in NEXUS_CONTEXT/LOGS/"
    fi
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo ""
  echo "❌ Done-state validation failed. Fix unchecked criteria before merging."
  exit 1
fi

echo "✅ Done-state validation passed"
exit 0
