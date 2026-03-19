# .ops/branch-guard.ps1
# Manual branch discipline validator.
# Mirrors .githooks/pre-commit logic exactly.
#
# Usage:
#   pwsh .ops/branch-guard.ps1
#   pwsh .ops/branch-guard.ps1 -Branch C6-foo
#   pwsh .ops/branch-guard.ps1 -Branch main

param(
  [string]$Branch = ""
)

if (-not $Branch) {
  $Branch = git symbolic-ref --short HEAD 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $Branch) {
    Write-Host "[branch-guard] Detached HEAD -- skipping check." -ForegroundColor Yellow
    exit 0
  }
}
$Branch = $Branch.Trim()

function Show-Blocked([string]$Reason, [string]$Fix) {
  Write-Host ""
  Write-Host "=== BRANCH GUARD: COMMIT BLOCKED ===" -ForegroundColor Red
  Write-Host "  Branch : $Branch"   -ForegroundColor Yellow
  Write-Host "  Reason : $Reason"   -ForegroundColor Yellow
  Write-Host "  Fix    : $Fix"      -ForegroundColor Cyan
  Write-Host ""
  Write-Host "  Emergency bypass: " -NoNewline -ForegroundColor DarkGray
  Write-Host '$env:SKIP_BRANCH_GUARD=1; git commit ...' -ForegroundColor DarkGray
  Write-Host ""
  exit 1
}

function Show-Allowed([string]$Class) {
  Write-Host ""
  Write-Host "=== BRANCH GUARD: OK ===" -ForegroundColor Green
  Write-Host "  Branch : $Branch" -ForegroundColor White
  Write-Host "  Class  : $Class"  -ForegroundColor White
  Write-Host ""
  exit 0
}

# Rule 1: main is protected
if ($Branch -eq "main") {
  Show-Blocked `
    "Direct commits to main are forbidden." `
    "git checkout -b C<N>-<literal-task-name>"
}

# Rule 2: agent/* are parking branches
if ($Branch -match "^agent/") {
  Show-Blocked `
    "agent/* branches are parking -- no implementation commits." `
    "git checkout -b C<N>-<literal-task-name>"
}

# Rule 3: Random-name single-level platform branches
if ($Branch -match "^(claude|copilot|codex|antigravity|cursor|framer)/[^/]+$") {
  Show-Blocked `
    "Random-name platform branches are forbidden." `
    "Use lab/<platform>/<topic> or <TASKID>-<name> instead."
}

# Rule 4: Validate allowed class
$Valid = $false
$Class = "unknown"

if ($Branch -match "^lab/[a-z][a-z0-9-]*/[a-z0-9].+") {
  $Valid = $true; $Class = "lab/<platform>/<topic>"
}
if ($Branch -match "^(feat|fix|ops|docs|chore|hotfix)/.+") {
  $Valid = $true; $Class = "prefix/<name>"
}
if ($Branch -match "^[A-Za-z]+[0-9]+[a-z]?-.+") {
  $Valid = $true; $Class = "TASKID-<literal-name>"
}

if (-not $Valid) {
  Show-Blocked `
    "Branch '$Branch' does not match any allowed class." `
    "Use: <TASKID>-name | feat/* | fix/* | ops/* | lab/*/*"
}

Show-Allowed -Class $Class
