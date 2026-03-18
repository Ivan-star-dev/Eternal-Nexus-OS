[CmdletBinding()]
param(
    [string]$TaskName = "EternalNexus_CodexTaskScan",
    [string]$OwnerTag = "@codex",
    [int]$IntervalMinutes = 2
)

$ErrorActionPreference = "Stop"

Import-Module ScheduledTasks -ErrorAction Stop

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$scanScriptPath = (Resolve-Path (Join-Path $PSScriptRoot "check-codex-task.ps1")).Path
$outputRoot = Join-Path $repoRoot "NEXUS_CONTEXT\_private\task-scan"

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null

$userId = if ($env:USERDOMAIN) {
    "$($env:USERDOMAIN)\$($env:USERNAME)"
} else {
    $env:USERNAME
}

$actionArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$scanScriptPath`" -OwnerTag `"$OwnerTag`" -OutputRoot `"$outputRoot`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $actionArgs
$startAt = (Get-Date).AddMinutes(1)
$trigger = New-ScheduledTaskTrigger -Once -At $startAt -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) -RepetitionDuration (New-TimeSpan -Days 3650)
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 4)

$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($null -ne $existingTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description "Scans Eternal Nexus for the next Codex task every $IntervalMinutes minutes." `
    | Out-Null

& $scanScriptPath -OwnerTag $OwnerTag -OutputRoot $outputRoot | Out-Null

$taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName

Write-Host "Scheduled task registered: $TaskName"
Write-Host "Next run time: $($taskInfo.NextRunTime)"
Write-Host "Output root: $outputRoot"
