[CmdletBinding()]
param(
    [string]$OwnerTag = "@codex",
    [string]$OutputRoot
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
    return (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}

function Parse-TaskSequence {
    param(
        [string]$Path
    )

    $tasks = @()
    $current = $null

    foreach ($line in Get-Content -Path $Path) {
        if ($line -match '^###\s+(T-\d+)$') {
            if ($null -ne $current) {
                $tasks += [pscustomobject]$current
            }

            $current = [ordered]@{
                Id       = $matches[1]
                Status   = ""
                Owner    = ""
                Backup   = ""
                Labels   = ""
                Triage   = ""
                Branch   = ""
                Task     = ""
                WhyNow   = ""
                Evidence = ""
                Blocker  = ""
            }

            continue
        }

        if ($null -eq $current) {
            continue
        }

        if ($line -match '^- Status:\s+`?(.+?)`?$') {
            $current.Status = $matches[1]
            continue
        }

        if ($line -match '^- Owner:\s+`?(.+?)`?$') {
            $current.Owner = $matches[1]
            continue
        }

        if ($line -match '^- Backup:\s+`?(.+?)`?$') {
            $current.Backup = $matches[1]
            continue
        }

        if ($line -match '^- Labels:\s+(.+)$') {
            $current.Labels = $matches[1]
            continue
        }

        if ($line -match '^- Triage:\s+(.+)$') {
            $current.Triage = $matches[1]
            continue
        }

        if ($line -match '^- Branch:\s+`?(.+?)`?$') {
            $current.Branch = $matches[1]
            continue
        }

        if ($line -match '^- Task:\s+(.+)$') {
            $current.Task = $matches[1]
            continue
        }

        if ($line -match '^- Why now:\s+(.+)$') {
            $current.WhyNow = $matches[1]
            continue
        }

        if ($line -match '^- Evidence:\s+(.+)$') {
            $current.Evidence = $matches[1]
            continue
        }

        if ($line -match '^- Blocker:\s+(.+)$') {
            $current.Blocker = $matches[1]
            continue
        }
    }

    if ($null -ne $current) {
        $tasks += [pscustomobject]$current
    }

    return $tasks
}

function Get-UnresolvedPredecessors {
    param(
        [object[]]$Tasks,
        [int]$Index
    )

    $unresolved = @()

    for ($i = 0; $i -lt $Index; $i++) {
        if ($Tasks[$i].Status -notin @("done", "blocked")) {
            $unresolved += $Tasks[$i]
        }
    }

    return $unresolved
}

function Get-HandoffReportPath {
    param(
        [string]$Path
    )

    foreach ($line in Get-Content -Path $Path) {
        if ($line -match '^- Path:\s+`(.+?)`$') {
            return $matches[1]
        }
    }

    return ""
}

$repoRoot = Get-RepoRoot
$taskSequencePath = Join-Path $repoRoot "NEXUS_CONTEXT\TASK_SEQUENCE.md"
$handoffPath = Join-Path $repoRoot "NEXUS_CONTEXT\HANDOFF.md"

if (-not $OutputRoot) {
    $OutputRoot = Join-Path $repoRoot "NEXUS_CONTEXT\_private\task-scan"
}

New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null

$tasks = Parse-TaskSequence -Path $taskSequencePath

if ($tasks.Count -eq 0) {
    throw "No tasks were parsed from $taskSequencePath"
}

$branch = (git -C $repoRoot branch --show-current).Trim()
$timestamp = Get-Date
$timestampUtc = $timestamp.ToUniversalTime().ToString("o")
$latestReportPath = Get-HandoffReportPath -Path $handoffPath

$globalFrontTask = $tasks | Where-Object { $_.Status -ne "done" } | Select-Object -First 1
$currentOwnerTask = $null
$currentOwnerTaskIndex = -1
$actionableTask = $null

for ($i = 0; $i -lt $tasks.Count; $i++) {
    $task = $tasks[$i]

    if (($null -eq $currentOwnerTask) -and $task.Owner -eq $OwnerTag -and $task.Status -ne "done") {
        $currentOwnerTask = $task
        $currentOwnerTaskIndex = $i
    }

    if ($task.Owner -eq $OwnerTag -and $task.Status -in @("queued", "in-progress")) {
        $unresolvedPredecessors = Get-UnresolvedPredecessors -Tasks $tasks -Index $i

        if ($unresolvedPredecessors.Count -eq 0) {
            $actionableTask = $task
            break
        }
    }
}

$blockingTasks = @()

if ($currentOwnerTaskIndex -ge 0) {
    $blockingTasks = Get-UnresolvedPredecessors -Tasks $tasks -Index $currentOwnerTaskIndex
}

$mode = "idle"
$summary = "No Codex task found in the queue."

if ($null -ne $actionableTask) {
    $mode = "actionable"
    $summary = "$($actionableTask.Id) is actionable for ${OwnerTag}: $($actionableTask.Task)"
} elseif ($null -ne $currentOwnerTask) {
    switch ($currentOwnerTask.Status) {
        "in-review" {
            $mode = "waiting-review"
            $summary = "$($currentOwnerTask.Id) is still in review for ${OwnerTag}: $($currentOwnerTask.Blocker)"
        }
        "blocked" {
            $mode = "blocked"
            $summary = "$($currentOwnerTask.Id) is blocked for ${OwnerTag}: $($currentOwnerTask.Blocker)"
        }
        "queued" {
            $mode = "waiting-queue"
            $summary = "$($currentOwnerTask.Id) is queued for ${OwnerTag} but earlier tasks must clear first."
        }
        default {
            $mode = "waiting"
            $summary = "$($currentOwnerTask.Id) is the current ${OwnerTag} task with status $($currentOwnerTask.Status)."
        }
    }
}

$result = [ordered]@{
    scan_time_local         = $timestamp.ToString("yyyy-MM-dd HH:mm:ss")
    scan_time_utc           = $timestampUtc
    repo_root               = $repoRoot
    branch                  = $branch
    owner_tag               = $OwnerTag
    mode                    = $mode
    summary                 = $summary
    latest_handoff_report   = $latestReportPath
    global_front_task       = $globalFrontTask
    current_owner_task      = $currentOwnerTask
    actionable_task         = $actionableTask
    blocking_tasks          = @($blockingTasks)
}

$latestJsonPath = Join-Path $OutputRoot "latest.json"
$latestMarkdownPath = Join-Path $OutputRoot "latest.md"
$historyPath = Join-Path $OutputRoot "history.log"

$result | ConvertTo-Json -Depth 6 | Set-Content -Path $latestJsonPath -Encoding UTF8

$markdown = @(
    "# Codex Task Scan"
    ""
    "- Scan time: $($result.scan_time_local)"
    "- UTC: $($result.scan_time_utc)"
    "- Repo: $($result.repo_root)"
    "- Branch: $($result.branch)"
    "- Owner tag: $($result.owner_tag)"
    "- Mode: $($result.mode)"
    "- Summary: $($result.summary)"
)

if ($latestReportPath) {
    $markdown += "- Latest handoff report: $latestReportPath"
}

if ($null -ne $globalFrontTask) {
    $markdown += ""
    $markdown += "## Global front task"
    $markdown += "- Id: $($globalFrontTask.Id)"
    $markdown += "- Status: $($globalFrontTask.Status)"
    $markdown += "- Owner: $($globalFrontTask.Owner)"
    $markdown += "- Task: $($globalFrontTask.Task)"
    if ($globalFrontTask.Blocker) {
        $markdown += "- Blocker: $($globalFrontTask.Blocker)"
    }
}

if ($null -ne $currentOwnerTask) {
    $markdown += ""
    $markdown += "## Current Codex task"
    $markdown += "- Id: $($currentOwnerTask.Id)"
    $markdown += "- Status: $($currentOwnerTask.Status)"
    $markdown += "- Branch: $($currentOwnerTask.Branch)"
    $markdown += "- Task: $($currentOwnerTask.Task)"
    if ($currentOwnerTask.Blocker) {
        $markdown += "- Blocker: $($currentOwnerTask.Blocker)"
    }
}

if ($null -ne $actionableTask) {
    $markdown += ""
    $markdown += "## Actionable now"
    $markdown += "- Id: $($actionableTask.Id)"
    $markdown += "- Task: $($actionableTask.Task)"
    $markdown += "- Why now: $($actionableTask.WhyNow)"
}

if ($blockingTasks.Count -gt 0) {
    $markdown += ""
    $markdown += "## Upstream unresolved tasks"

    foreach ($blockingTask in $blockingTasks) {
        $markdown += "- $($blockingTask.Id) [$($blockingTask.Status)] $($blockingTask.Owner): $($blockingTask.Task)"
    }
}

$markdown | Set-Content -Path $latestMarkdownPath -Encoding UTF8

"$timestampUtc | $mode | $summary" | Add-Content -Path $historyPath -Encoding UTF8

Write-Host $summary
Write-Host "Snapshot: $latestMarkdownPath"
