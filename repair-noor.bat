@echo off
setlocal
cd /d "%~dp0"
title Noor - Clean Install and Start
echo ========================================
echo Noor - Clean dependency repair
echo ========================================
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Please reinstall Node.js LTS.
  pause
  exit /b 1
)
if exist node_modules (
  echo Removing old node_modules...
  rmdir /s /q node_modules
)
if exist package-lock.json del /f /q package-lock.json
if exist pnpm-lock.yaml del /f /q pnpm-lock.yaml
if exist yarn.lock del /f /q yarn.lock
echo.
echo Installing stable dependencies...
npm install --no-audit --no-fund --prefer-online
if errorlevel 1 goto :install_failed
node scripts\ensure-dependencies.cjs
:install_failed
echo.
echo INSTALL FAILED. Send me a screenshot of this window.
pause
exit /b 1
echo.
echo Starting Noor...
npm run dev -- --host 0.0.0.0
pause
