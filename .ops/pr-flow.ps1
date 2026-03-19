<#
.SYNOPSIS
  PR/branch workflow helper for Eternal Nexus OS.

.DESCRIPTION
  Simplifies the common git+GitHub CLI flow:
  status, sync-main, start, commit, push, pr, automerge, cleanup.

.PARAMETER Action
  One of: status, sync-main, start, commit, push, pr, automerge, cleanup

.PARAMETER TaskId
  Task identifier (e.g. C6). Used by 'start' to name the branch.

.PARAMETER Title
  Used by 'start' (branch slug), 'commit' (message), 'pr' (PR title).

.PARAMETER Body
  Optional path to a markdown file used as PR body. PR action only.

.PARAMETER Base
  Base branch. Defaults to 'main'.

.EXAMPLE
  .\.ops\pr-flow.ps1 status
  .\.ops\pr-flow.ps1 sync-main
  .\.ops\pr-flow.ps1 start -TaskId C6 -Title "streams organ"
  .\.ops\pr-flow.ps1 commit -Title "feat(C6): add streams type contract"
  .\.ops\pr-flow.ps1 push
  .\.ops\pr-flow.ps1 pr -Title "C6: Streams organ" -Body docs/pr-body.md
  .\.ops\pr-flow.ps1 automerge
  .\.ops\pr-flow.ps1 cleanup -TaskId C6 -Title "streams organ"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet('status','sync-main','start','commit','push','pr','automerge','cleanup')]
    [string]$Action,

    [string]$TaskId,
    [string]$Title,
    [string]$Body,
    [string]$Base = 'main'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── helpers ──────────────────────────────────────────────────────────

function Assert-GitRepo {
    if (-not (Test-Path .git) -and -not (git rev-parse --is-inside-work-tree 2>$null)) {
        throw "Not inside a git repository."
    }
}

function Assert-CleanTree {
    $status = git status --porcelain
    if ($status) {
        Write-Host "Dirty working tree:" -ForegroundColor Red
        git status --short
        throw "Working tree is not clean. Commit or stash changes first."
    }
}

function Assert-GitInstalled {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git is not installed or not on PATH."
    }
}

function Assert-GhInstalled {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "GitHub CLI (gh) is not installed or not on PATH. Install from https://cli.github.com"
    }
}

function Get-BranchSlug {
    param([string]$Id, [string]$Name)
    $slug = $Name.ToLower() -replace '[^a-z0-9]+', '-' -replace '^-|-$', ''
    if ($Id) { return "$Id-$slug" }
    return $slug
}

function Get-CurrentBranch {
    return (git branch --show-current).Trim()
}

function Write-Step {
    param([string]$Msg)
    Write-Host "`n==> $Msg" -ForegroundColor Cyan
}

# ── actions ──────────────────────────────────────────────────────────

function Invoke-Status {
    Assert-GitRepo
    Write-Step "Repository status"
    Write-Host "Root:   $(git rev-parse --show-toplevel)"
    Write-Host "Branch: $(Get-CurrentBranch)"
    Write-Host "Remotes:"
    git remote -v
    Write-Host "`nWorking tree:"
    git status --short
    if (-not (git status --porcelain)) {
        Write-Host "(clean)" -ForegroundColor Green
    }
}

function Invoke-SyncMain {
    Assert-GitRepo
    Assert-CleanTree
    Write-Step "Syncing $Base from origin"
    git fetch --all --prune
    git checkout $Base
    git pull --ff-only origin $Base
    Write-Host "$Base is up to date." -ForegroundColor Green
}

function Invoke-Start {
    if (-not $TaskId -and -not $Title) {
        throw "start requires -TaskId and/or -Title"
    }
    Assert-GitRepo
    Assert-CleanTree

    $branchName = Get-BranchSlug -Id $TaskId -Name $Title
    if (-not $branchName -or $branchName -eq '-') {
        throw "Could not generate branch name from TaskId='$TaskId' Title='$Title'"
    }

    Write-Step "Creating branch: $branchName from $Base"
    git checkout $Base
    git pull --ff-only origin $Base
    git checkout -b $branchName
    Write-Host "On new branch: $branchName" -ForegroundColor Green
}

function Invoke-Commit {
    if (-not $Title) {
        throw "commit requires -Title 'your commit message'"
    }
    Assert-GitRepo

    Write-Step "Staging and committing"
    git add -A
    $staged = git diff --cached --name-only
    if (-not $staged) {
        throw "Nothing staged to commit."
    }

    Write-Host "Staged files:"
    git diff --cached --name-status
    git commit -m $Title
    Write-Host "Committed." -ForegroundColor Green
}

function Invoke-Push {
    Assert-GitRepo
    $branch = Get-CurrentBranch
    Write-Step "Pushing $branch to origin"
    git push -u origin $branch
    Write-Host "Pushed." -ForegroundColor Green
}

function Invoke-Pr {
    Assert-GitRepo
    Assert-GhInstalled

    $branch = Get-CurrentBranch
    if ($branch -eq $Base) {
        throw "Cannot open PR from $Base against $Base."
    }

    Write-Step "Opening PR: $branch -> $Base"

    $prArgs = @('pr', 'create', '--base', $Base)

    if ($Title) {
        $prArgs += '--title'
        $prArgs += $Title
    }

    if ($Body -and (Test-Path $Body)) {
        $prArgs += '--body-file'
        $prArgs += $Body
    } elseif (-not $Title) {
        $prArgs += '--fill'
    }

    & gh @prArgs
    Write-Host "PR created." -ForegroundColor Green
}

function Invoke-Automerge {
    Assert-GitRepo
    Assert-GhInstalled

    Write-Step "Enabling auto-merge (squash + delete branch)"
    gh pr merge --auto --squash --delete-branch
    Write-Host "Auto-merge enabled." -ForegroundColor Green
}

function Invoke-Cleanup {
    Assert-GitRepo
    Assert-CleanTree

    $branch = Get-CurrentBranch
    if (-not $TaskId -and -not $Title -and $branch -eq $Base) {
        throw "cleanup requires -TaskId/-Title or must be on a task branch."
    }

    $taskBranch = if ($branch -ne $Base) { $branch } else { Get-BranchSlug -Id $TaskId -Name $Title }

    Write-Step "Cleaning up: $taskBranch"

    if ($branch -ne $Base) {
        git checkout $Base
    }
    git pull --ff-only origin $Base
    git branch -d $taskBranch 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Branch $taskBranch already deleted or not fully merged. Use -D manually if needed." -ForegroundColor Yellow
    } else {
        Write-Host "Deleted local branch: $taskBranch" -ForegroundColor Green
    }
    git remote prune origin
    Write-Host "Cleanup done." -ForegroundColor Green
}

# ── dispatch ─────────────────────────────────────────────────────────

Assert-GitInstalled

switch ($Action) {
    'status'     { Invoke-Status }
    'sync-main'  { Invoke-SyncMain }
    'start'      { Invoke-Start }
    'commit'     { Invoke-Commit }
    'push'       { Invoke-Push }
    'pr'         { Invoke-Pr }
    'automerge'  { Invoke-Automerge }
    'cleanup'    { Invoke-Cleanup }
}
