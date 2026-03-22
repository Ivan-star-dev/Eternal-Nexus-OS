# .ops/install-hooks.ps1
# Wires .githooks/ as Git's active hooks directory.
# Run once after cloning or setting up a new worktree.
#
# Usage: pwsh .ops/install-hooks.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or -not $RepoRoot) {
  Write-Error "Not inside a git repository."
  exit 1
}

git config core.hooksPath .githooks
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to set core.hooksPath."
  exit 1
}

$HookFile = Join-Path $RepoRoot ".githooks/pre-commit"
if (Test-Path $HookFile) {
  git update-index --chmod=+x ".githooks/pre-commit" 2>$null
  Write-Host "[install-hooks] pre-commit marked executable" -ForegroundColor Green
} else {
  Write-Warning ".githooks/pre-commit not found."
}

$HooksPath = git config core.hooksPath
Write-Host ""
Write-Host "=== BRANCH GUARD INSTALLED ===" -ForegroundColor Green
Write-Host "  core.hooksPath : $HooksPath"
Write-Host "  Repo root      : $RepoRoot"
Write-Host ""
Write-Host "Test: pwsh .ops/branch-guard.ps1" -ForegroundColor Cyan
Write-Host "Test blocked: pwsh .ops/branch-guard.ps1 -Branch main" -ForegroundColor Cyan
Write-Host ""
