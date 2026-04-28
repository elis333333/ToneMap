@echo off
setlocal enabledelayedexpansion

set "OUTPUT=estructura_completa.txt"

> "%OUTPUT%" echo ===== TONEMAP PROJECT STRUCTURE =====
>> "%OUTPUT%" echo.

:: =========================
:: DIRECTORY TREE
:: =========================
>> "%OUTPUT%" echo ===== DIRECTORY TREE =====
>> "%OUTPUT%" echo.

for /f "delims=" %%D in ('
  dir /s /b /ad ^
  ^| findstr /V /I "\\node_modules\\ \\node_modules$ \\.next\\ \\.next$ \\.git\\ \\.git$ \\.open-next\\ \\.open-next$"
') do (
  >> "%OUTPUT%" echo [DIR] %%D
)

>> "%OUTPUT%" echo.

:: =========================
:: FILES + CONTENT
:: =========================
>> "%OUTPUT%" echo ===== FILES + CONTENT =====
>> "%OUTPUT%" echo.

for /f "delims=" %%F in ('
  dir /s /b /a-d *.ts *.tsx *.js *.jsx *.json *.css *.md *.html *.mjs *.mts *.d.ts ^
  ^| findstr /V /I "\\node_modules\\ \\.next\\ \\.git\\ \\.open-next\\" ^
  ^| findstr /V /I "package-lock.json yarn.lock pnpm-lock.yaml bun.lockb bun.lock estructura_completa.txt" ^
  ^| findstr /V /I ".lock .env"
') do (
  >> "%OUTPUT%" echo ======================================
  >> "%OUTPUT%" echo FILE: %%F
  >> "%OUTPUT%" echo ======================================
  type "%%F" >> "%OUTPUT%" 2>nul
  >> "%OUTPUT%" echo.
  >> "%OUTPUT%" echo.
)

echo Export completado en %OUTPUT%
pause