@echo off
chcp 65001 >nul
cd /d "%~dp0"

rem Starts the desktop helper: the tray version if it was built, otherwise the Node version.
rem Press Ctrl+Alt+S afterwards to open the small window.

if exist "%~dp0web\download\prompt-plan-helper.exe" (
  start "" "%~dp0web\download\prompt-plan-helper.exe"
  echo Started the tray version. Press Ctrl+Alt+S to open the small window.
  ping -n 4 127.0.0.1 >nul
  exit /b 0
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found and the tray version is not built. Run build-exe first, or install Node.js.
  pause
  exit /b 1
)

node tools\shupian.mjs app hub
if errorlevel 1 (
  echo Could not start. See the message above.
  pause
  exit /b 1
)
exit /b 0
