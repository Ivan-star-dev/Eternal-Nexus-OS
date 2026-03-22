[CmdletBinding()]
param(
    [string]$TaskName = "EternalNexus_CodexTaskScan"
)

$ErrorActionPreference = "Stop"

Import-Module ScheduledTasks -ErrorAction Stop

$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($null -eq $existingTask) {
    Write-Host "Scheduled task not found: $TaskName"
    exit 0
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Scheduled task removed: $TaskName"
