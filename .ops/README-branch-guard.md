# Branch Guard — GRAND RESET v1

Minimal branch discipline system. Blocks commits on forbidden branches.
Zero dependencies. Pure bash hook + PowerShell manual validator.

---

## Install (once per clone)

```powershell
pwsh .ops/install-hooks.ps1
```

This sets `core.hooksPath = .githooks` so Git runs `.githooks/pre-commit` on every commit.

---

## Branch Policy

| Class | Pattern | Commits allowed |
|-------|---------|-----------------|
| Production | `main` | ❌ BLOCKED — merge via PR only |
| Parking | `agent/<platform>` | ❌ BLOCKED — no implementation commits |
| Random names | `claude/*` `copilot/*` `codex/*` (single-level) | ❌ BLOCKED |
| Lab/scratch | `lab/<platform>/<topic>` | ✅ allowed |
| Feature | `feat/<name>` | ✅ allowed |
| Fix | `fix/<name>` | ✅ allowed |
| Ops | `ops/<name>` | ✅ allowed |
| Docs | `docs/<name>` | ✅ allowed |
| Chore | `chore/<name>` | ✅ allowed |
| Task branch | `<TASKID>-<literal-name>` | ✅ allowed |

**TASKID format:** letter(s) + digit(s) + optional letter — e.g. `C6`, `U1`, `A2`, `C4b`

### Valid examples
```
C6-streams-organ
A2-ci-baseline-gate
U1-dark-glassmorphism
feat/r3f-v9-upgrade
fix/replay-cursor-types
ops/grand-reset-v1-normalization
lab/claude/yjs-evaluation
```

### Blocked examples
```
main
agent/claude
claude/cranky-ride        ← random name
copilot/do-all-tasks      ← meta-task name
fix-all-issues            ← no class prefix
merge-everything          ← no class prefix
```

---

## Test the guard manually

```powershell
# Test current branch
pwsh .ops/branch-guard.ps1

# Simulate a blocked branch
pwsh .ops/branch-guard.ps1 -Branch main
pwsh .ops/branch-guard.ps1 -Branch "claude/cranky-ride"
pwsh .ops/branch-guard.ps1 -Branch "copilot/do-all-tasks"

# Simulate valid branches
pwsh .ops/branch-guard.ps1 -Branch "C6-streams-organ"
pwsh .ops/branch-guard.ps1 -Branch "feat/my-feature"
pwsh .ops/branch-guard.ps1 -Branch "lab/claude/yjs-eval"
```

---

## Switch to a valid branch

```bash
# From main or a blocked branch:
git checkout -b C7-your-task-name
git checkout -b feat/your-feature-name
git checkout -b fix/your-fix-name
```

---

## Emergency bypass

For rare ops commits that must bypass the guard (e.g. session logs directly to a branch):

```powershell
# PowerShell
$env:SKIP_BRANCH_GUARD = "1"; git commit -m "..."
$env:SKIP_BRANCH_GUARD = ""   # unset after
```

```bash
# Bash
SKIP_BRANCH_GUARD=1 git commit -m "..."
```

Use sparingly. Every bypass should be justified in the commit message.

---

## How it works

1. `pwsh .ops/install-hooks.ps1` → sets `git config core.hooksPath .githooks`
2. Every `git commit` runs `.githooks/pre-commit`
3. The hook checks:
   - conflict markers (original check)
   - branch class (GRAND RESET v1 addition)
4. Blocked = non-zero exit → Git aborts the commit and shows instructions
5. `.ops/branch-guard.ps1` mirrors the same logic for manual testing

---

## Files

| File | Purpose |
|------|---------|
| `.githooks/pre-commit` | Bash hook — runs on every `git commit` |
| `.ops/branch-guard.ps1` | PowerShell validator — manual testing |
| `.ops/install-hooks.ps1` | One-time installer — sets `core.hooksPath` |
| `.ops/README-branch-guard.md` | This file |
