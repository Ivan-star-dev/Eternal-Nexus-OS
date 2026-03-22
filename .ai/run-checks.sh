#!/bin/bash
# .ai/run-checks.sh
# Eternal Nexus — Post-Refactor Check Gate
# Run this after EVERY step of any refactor. 
# Must all pass before committing.

set -e

echo ""
echo "═══════════════════════════════════════════════"
echo "  ETERNAL NEXUS — Post-Refactor Check Suite"
echo "═══════════════════════════════════════════════"
echo ""

echo "▶ [1/3] Linting..."
npm run lint
echo "✅ Lint passed."

echo ""
echo "▶ [2/3] Typechecking..."
npm run typecheck
echo "✅ Typecheck passed."

echo ""
echo "▶ [3/3] Unit Tests..."
npm run test
echo "✅ Tests passed."

echo ""
echo "═══════════════════════════════════════════════"
echo "  ALL CHECKS PASSED — Safe to commit."
echo "═══════════════════════════════════════════════"
echo ""
