@echo off
cd /d "%~dp0"

rem Starts the desktop helper: the tray version if it was built, otherwise the Node version.
rem Press Ctrl+Alt+S afterwards to open the small window.

if exist "web\download\prompt-plan-helper.exe" (
  start "" "web\download\prompt-plan-helper.exe"
  echo Started the tray version. Press Ctrl+Alt+S to open the small window.
  goto done
)

where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js was not found and the tray version is not built. Run build-exe first, or install Node.js.
  goto done
)

node tools\shupian.mjs app hub

:done
echo.
pause
