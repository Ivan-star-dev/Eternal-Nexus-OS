#!/usr/bin/env bash
set -euo pipefail
#
# validate-queue.sh — Detect stale queue state
#
# Rules:
# 1. If a lease exists and is not expired, the task must be in in-progress/
# 2. If a task is in in-progress/ it must have a lease
# 3. Tasks in done/ must not also exist in ready/ or in-progress/
#
# Exit 0 = pass, Exit 1 = fail
#

echo "🔍 Validating task queue coherence..."

FAIL=0
WARN=0

# ── Rule 1: Active leases must have matching in-progress task ──
for lease in docs/task-leases/*_lease.md docs/task-leases/*_claude_lease.md; do
  [ -f "$lease" ] || continue

  # Skip expired leases
  if grep -qi 'status:.*expired\|status:.*released\|status:.*done' "$lease" 2>/dev/null; then
    continue
  fi

  # Extract task ID from lease
  TASK_ID=$(grep -oEi 'task-id:\s*(C|U|A|R|X)[0-9]+' "$lease" 2>/dev/null | head -1 | sed 's/task-id:\s*//' | tr -d ' ' || true)
  if [ -z "$TASK_ID" ]; then
    TASK_ID=$(grep -oEi 'task:\s*(C|U|A|R|X)[0-9]+' "$lease" 2>/dev/null | head -1 | sed 's/task:\s*//' | tr -d ' ' || true)
  fi
  [ -z "$TASK_ID" ] && continue

  # Check task is in in-progress (not still in ready)
  STILL_IN_READY=$(find docs/task-queue/ready/ -name "${TASK_ID}_*" -o -name "${TASK_ID}-*" 2>/dev/null | head -1 || true)
  IN_PROGRESS=$(find docs/task-queue/in-progress/ -name "${TASK_ID}_*" -o -name "${TASK_ID}-*" 2>/dev/null | head -1 || true)

  if [ -n "$STILL_IN_READY" ] && [ -z "$IN_PROGRESS" ]; then
    echo "⚠️  WARN: Task $TASK_ID has active lease but is still in ready/ (not moved to in-progress/)"
    WARN=$((WARN + 1))
  fi
done

# ── Rule 2: In-progress tasks must have a lease ──
if [ -d "docs/task-queue/in-progress" ]; then
  for task in docs/task-queue/in-progress/*.md; do
    [ -f "$task" ] || continue
    TASK_ID=$(grep -oEi 'id:\s*(C|U|A|R|X)[0-9]+' "$task" 2>/dev/null | head -1 | sed 's/id:\s*//' | tr -d ' ' || true)
    [ -z "$TASK_ID" ] && continue

    LEASE=$(find docs/task-leases/ -name "${TASK_ID}_*" 2>/dev/null | head -1 || true)
    if [ -z "$LEASE" ]; then
      echo "❌ FAIL: Task $TASK_ID is in-progress but has no lease"
      FAIL=1
    fi
  done
fi

# ── Rule 3: Done tasks must not also be in ready or in-progress ──
if [ -d "docs/task-queue/done" ]; then
  for task in docs/task-queue/done/*.md; do
    [ -f "$task" ] || continue
    TASK_ID=$(grep -oEi 'id:\s*(C|U|A|R|X)[0-9]+' "$task" 2>/dev/null | head -1 | sed 's/id:\s*//' | tr -d ' ' || true)
    [ -z "$TASK_ID" ] && continue

    GHOST_READY=$(find docs/task-queue/ready/ -name "${TASK_ID}_*" -o -name "${TASK_ID}-*" 2>/dev/null | head -1 || true)
    GHOST_IP=$(find docs/task-queue/in-progress/ -name "${TASK_ID}_*" -o -name "${TASK_ID}-*" 2>/dev/null | head -1 || true)

    if [ -n "$GHOST_READY" ]; then
      echo "❌ FAIL: Task $TASK_ID is in done/ but also in ready/ — ghost state"
      FAIL=1
    fi
    if [ -n "$GHOST_IP" ]; then
      echo "❌ FAIL: Task $TASK_ID is in done/ but also in in-progress/ — ghost state"
      FAIL=1
    fi
  done
fi

if [ "$FAIL" -ne 0 ]; then
  echo ""
  echo "❌ Queue coherence check failed."
  exit 1
fi

if [ "$WARN" -gt 0 ]; then
  echo "⚠️  $WARN warning(s) — queue state has drift but is not blocking."
fi

echo "✅ Queue coherence check passed"
exit 0
