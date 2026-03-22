#!/bin/bash
# branch-guard.sh — PreToolUse hook · Eternal Nexus OS
# Bloqueia execução de tools de escrita em branch errado.
# Emite triage automática com pillar + branch correto.
#
# Protocolo: BRANCH-GUARD-PROTOCOL-001 | 2026-03-22

set -euo pipefail

# ── Ler input do Claude Code (JSON via stdin) ──────────────────────────────
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' | head -1 | cut -d'"' -f4 2>/dev/null || echo "")

# ── Só actua em tools de escrita ──────────────────────────────────────────
WRITE_TOOLS="Write Edit Bash NotebookEdit"
IS_WRITE_TOOL=false
for t in $WRITE_TOOLS; do
  if [ "$TOOL_NAME" = "$t" ]; then
    IS_WRITE_TOOL=true
    break
  fi
done

if [ "$IS_WRITE_TOOL" = "false" ]; then
  echo '{"decision":"allow"}'
  exit 0
fi

# ── Para Bash, só actua se o comando contém git commit/push/add ou escrita ─
if [ "$TOOL_NAME" = "Bash" ]; then
  CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4 2>/dev/null || echo "")
  # Só bloqueia se for commit/push — reads/runs são livres
  if ! echo "$CMD" | grep -qE '(git (add|commit|push)|rm |mv |mkdir |tee |>\s)'; then
    echo '{"decision":"allow"}'
    exit 0
  fi
fi

# ── Detectar branch atual ──────────────────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CURRENT_BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")

# ── Ler branch canónico de LIVE_STATE.md ──────────────────────────────────
LIVE_STATE="$PROJECT_DIR/ops/LIVE_STATE.md"
CANONICAL_BRANCH=""

if [ -f "$LIVE_STATE" ]; then
  # Extrai valor entre backticks na linha que contém 'Branch' e tem 'claude/'
  CANONICAL_BRANCH=$(grep 'Branch' "$LIVE_STATE" | grep -o '`[^`]*`' | tr -d '`' | grep 'claude/' | head -1 || true)
fi

# Se não conseguiu ler, usar valor hardcoded do sprint atual
if [ -z "$CANONICAL_BRANCH" ]; then
  CANONICAL_BRANCH="claude/rebuild-bastion-core-rihGX"
fi

# ── Comparar ───────────────────────────────────────────────────────────────
if [ "$CURRENT_BRANCH" = "$CANONICAL_BRANCH" ]; then
  echo '{"decision":"allow"}'
  exit 0
fi

# ── BLOQUEIO — branch errado ───────────────────────────────────────────────
TRIAGE_MSG="BRANCH-GUARD ACTIVADO

Branch atual   : $CURRENT_BRANCH
Branch canónico: $CANONICAL_BRANCH

NÃO PODES ESCREVER NESTE BRANCH.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRIAGE RÁPIDA — identifica o teu pillar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O que esta task produz?
  [S] doc / protocolo / config / governança  → WorkStructure → @claude/@copilot
  [F] feature / fluxo / dado / API           → WorkFunction  → @cursor/@claude
  [V] design / UI / UX / motion / visual     → WorkVisual    → @framer/@antigravity

Gate aberto no BASTION?
  → ops/BASTION.md — verificar STATUS: elegível + NEXT_ACTOR: tu

CORRECÇÃO AUTOMÁTICA:
  git fetch origin $CANONICAL_BRANCH
  git checkout $CANONICAL_BRANCH

Sem esta correcção, nenhuma escrita é permitida."

# Escapar para JSON (substituir newlines e aspas)
JSON_MSG=$(echo "$TRIAGE_MSG" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null \
  || echo "$TRIAGE_MSG" | sed 's/\\/\\\\/g; s/"/\\"/g; s/$/\\n/g' | tr -d '\n' | sed 's/\\n$//')

echo "{\"decision\":\"block\",\"reason\":$JSON_MSG}"
exit 0
