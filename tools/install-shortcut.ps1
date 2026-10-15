# Creates a Desktop shortcut with a global hotkey that opens the small project window.
# The shortcut runs tools\launch.vbs (no console window), which starts the local service and the window.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\install-shortcut.ps1 [-Hotkey "CTRL+ALT+S"] [-Remove]
param(
  [string]$Hotkey = 'CTRL+ALT+S',
  [switch]$Remove
)
$ErrorActionPreference = 'Stop'

# Shortcut name: the Chinese name of the tool, written as code points to keep this file ASCII.
$name = -join ([char[]](0x70, 0x72, 0x6F, 0x6D, 0x70, 0x74, 0x20, 0x8BA1, 0x5212, 0x4E66, 0x52A9, 0x624B))
$desktop = [Environment]::GetFolderPath('Desktop')
$lnkPath = Join-Path $desktop ($name + '.lnk')
# Earlier names of the same shortcut
$oldName = -join ([char[]](0x85AF, 0x7247, 0x8BA1, 0x5212, 0x52A9, 0x624B))
foreach ($dir in @($desktop, [Environment]::GetFolderPath('Programs'))) {
  $old = Join-Path $dir ($oldName + '.lnk')
  if (Test-Path $old) { Remove-Item $old -Force }
}

if ($Remove) {
  if (Test-Path $lnkPath) { Remove-Item $lnkPath -Force; Write-Output "removed: $lnkPath" } else { Write-Output 'nothing to remove' }
  exit 0
}

$root = Split-Path -Parent $PSScriptRoot
$vbs = Join-Path $root 'tools\launch.vbs'
if (-not (Test-Path $vbs)) { throw "tools\launch.vbs not found: $vbs" }

$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut($lnkPath)
$lnk.TargetPath = Join-Path $env:SystemRoot 'System32\wscript.exe'
$lnk.Arguments = '//nologo "' + $vbs + '"'
$lnk.WorkingDirectory = $root
$lnk.IconLocation = (Join-Path $root 'web\shupian.ico') + ',0'
$lnk.Hotkey = $Hotkey
$lnk.Description = $name
$lnk.Save()

$check = $shell.CreateShortcut($lnkPath)
Write-Output "created: $lnkPath"
Write-Output "hotkey:  $($check.Hotkey)"
Write-Output "icon:    $($check.IconLocation)"
Write-Output "target:  $($check.TargetPath) $($check.Arguments)"
