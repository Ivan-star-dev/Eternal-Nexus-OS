#!/usr/bin/env bash
set -euo pipefail
#
# validate-branch.sh — Enforce branch naming + lease discipline on PRs
#
# Rules:
# 1. Branch name must start with a valid task-id pattern or known prefix
# 2. Catch-all branches are rejected
# 3. If branch contains a task ID, a lease must exist
#
# Exit 0 = pass, Exit 1 = fail
#

BRANCH="${GITHUB_HEAD_REF:-$(git branch --show-current 2>/dev/null || echo '')}"

if [ -z "$BRANCH" ] || [ "$BRANCH" = "main" ]; then
  echo "✅ Branch: main (skip validation)"
  exit 0
fi

echo "🔍 Validating branch: $BRANCH"

# ── Rule 1: Reject catch-all / scope-less branch names ──
REJECT_PATTERNS=(
  "fix-all"
  "fix-twelve"
  "do-all"
  "finish-and-commit-all"
  "execute-tasks"
  "execute-new-tasks"
  "merge-correct"
  "install-npm"
  "read-repository"
)

BRANCH_LOWER=$(echo "$BRANCH" | tr '[:upper:]' '[:lower:]')

for pattern in "${REJECT_PATTERNS[@]}"; do
  if [[ "$BRANCH_LOWER" == *"$pattern"* ]]; then
    echo "❌ FAIL: Branch name matches catch-all pattern '$pattern'"
    echo "   Branch names must be task-scoped (e.g., C6-streams-organ, fix/specific-bug)"
    echo "   Catch-all branches like 'fix-all-issues' or 'do-all-tasks' are rejected."
    exit 1
  fi
done

# ── Rule 2: Valid branch prefixes ──
# Accepted formats:
#   C6-streams-organ, U1-dark-map, A2-ci-gate     (task-id prefix)
#   feat/..., fix/..., chore/..., refactor/...     (conventional)
#   agent/claude, agent/codex, agent/antigravity    (long-lived agent branches)
#   codex/..., claude/...                           (agent worktrees)
#   lab/...                                         (lab experiments)
VALID_PREFIX="^(C[0-9]|U[0-9]|A[0-9]|R[0-9]|X[0-9]|feat/|fix/|chore/|refactor/|agent/|codex/|claude/|lab/|copilot/(c|u|a|r|x)[0-9])"

if ! echo "$BRANCH" | grep -qEi -- "$VALID_PREFIX"; then
  echo "❌ FAIL: Branch '$BRANCH' does not match any valid prefix"
  echo "   Valid prefixes: C#, U#, A#, R#, X# (task), feat/, fix/, chore/, refactor/, agent/, lab/"
  echo "   Copilot branches must include task ID: copilot/c6-streams-organ (not copilot/fix-all-issues)"
  exit 1
fi

# ── Rule 3: If branch contains a task ID, verify lease exists ──
TASK_ID=""
# Extract from start: C6-streams-organ
TASK_ID=$(echo "$BRANCH" | grep -oEi '^(C|U|A|R|X)[0-9]+' | head -1 | tr '[:lower:]' '[:upper:]' || true)

# Also extract from path: copilot/c6-... or feat/C6-...
if [ -z "$TASK_ID" ]; then
  TASK_ID=$(echo "$BRANCH" | grep -oEi '/(C|U|A|R|X)[0-9]+' | head -1 | sed 's/\///' | tr '[:lower:]' '[:upper:]' || true)
fi

if [ -n "$TASK_ID" ]; then
  echo "📋 Detected task ID: $TASK_ID"

  # Check lease exists
  LEASE_FOUND=0
  for lease in docs/task-leases/${TASK_ID}_*.md; do
    if [ -f "$lease" ]; then
      LEASE_FOUND=1
      echo "✅ Lease found: $lease"

      # Check lease is not expired
      if grep -qi 'status:.*expired' "$lease" 2>/dev/null; then
        echo "⚠️  WARNING: Lease is expired. Update lease before merging."
      fi
    fi
  done

  if [ "$LEASE_FOUND" -eq 0 ]; then
    echo "❌ FAIL: No lease found for task $TASK_ID"
    echo "   Create docs/task-leases/${TASK_ID}_lease.md before opening a PR."
    echo "   Use template: docs/templates/lease.md"
    exit 1
  fi
fi

echo "✅ Branch validation passed: $BRANCH"
exit 0
