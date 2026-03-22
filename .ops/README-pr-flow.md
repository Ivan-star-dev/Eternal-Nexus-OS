# pr-flow.ps1 — Branch & PR workflow helper

Simplifies the git+GitHub CLI loop for task branches.

## Actions

| Action | What it does |
|--------|-------------|
| `status` | Show repo root, branch, remotes, working tree |
| `sync-main` | Fetch all, checkout main, pull --ff-only |
| `start` | Create task branch from main (`-TaskId C6 -Title "streams organ"` → `C6-streams-organ`) |
| `commit` | Stage all, commit with `-Title "message"` |
| `push` | Push current branch with `-u` |
| `pr` | Open PR via `gh` (`-Title`, optional `-Body path/to/body.md`) |
| `automerge` | Enable auto-merge (squash + delete-branch) via `gh` |
| `cleanup` | Switch to main, delete local task branch, prune remotes |

## Requirements

- `git` on PATH
- `gh` (GitHub CLI) on PATH — required only for `pr` and `automerge`
- Works on Windows PowerShell 5.1+ and PowerShell Core 7+ (`pwsh`)

## Examples

```powershell
# If pwsh (PS Core 7+) is available:
pwsh -NoProfile -File .\.ops\pr-flow.ps1 status

# If only Windows PowerShell 5.1 is available:
powershell -NoProfile -NoLogo -ExecutionPolicy Bypass -File .\.ops\pr-flow.ps1 status

# All actions:
.\.ops\pr-flow.ps1 status
.\.ops\pr-flow.ps1 sync-main
.\.ops\pr-flow.ps1 start -TaskId C6 -Title "streams organ"
.\.ops\pr-flow.ps1 commit -Title "feat(C6): add streams type contract"
.\.ops\pr-flow.ps1 push
.\.ops\pr-flow.ps1 pr -Title "C6: Streams organ"
.\.ops\pr-flow.ps1 automerge
.\.ops\pr-flow.ps1 cleanup
```
