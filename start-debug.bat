@echo off
cd /d "%~dp0"

rem Debug: runs the local service in this window with request logs and opens the page in the default browser.
rem Close this window to stop it. Not for everyday use; use start.bat for that.

where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js first.
  pause
  exit /b 1
)

set SHUPIAN_DEBUG=1
set SHUPIAN_OPEN=1
node toolspp-server.mjs

echo.
echo The service stopped.
pause
