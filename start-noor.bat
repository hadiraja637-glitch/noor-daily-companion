@echo off
setlocal
cd /d "%~dp0"
if exist "C:\Program Files\nodejs\npm.cmd" (
  set "PATH=C:\Program Files\nodejs;%PATH%"
)
if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
  set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
)
echo Starting Noor development server...
npm run dev -- --host 127.0.0.1
pause
