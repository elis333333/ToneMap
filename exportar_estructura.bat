@echo off
setlocal enabledelayedexpansion

set "OUTPUT=estructura_completa.txt"

> "%OUTPUT%" echo ===== TONEMAP PROJECT STRUCTURE =====
>> "%OUTPUT%" echo.

>> "%OUTPUT%" echo ===== DIRECTORY TREE =====
>> "%OUTPUT%" echo.

for /f "delims=" %%D in ('
  dir /s /b /ad ^| findstr /V /I "\\node_modules\\ \\node_modules$ \\.next\\ \\.next$ \\.git\\ \\.git$"
') do (
  >> "%OUTPUT%" echo [DIR] %%D
)

>> "%OUTPUT%" echo.
>> "%OUTPUT%" echo ===== FILES + CONTENT =====
>> "%OUTPUT%" echo.

for /f "delims=" %%F in ('
  dir /s /b /a-d *.ts *.tsx *.js *.jsx *.json *.css *.md *.html *.mjs *.mts *.d.ts ^| findstr /V /I "\\node_modules\\ \\.next\\ \\.git\\ package-lock.json yarn.lock pnpm-lock.yaml estructura_completa.txt"
') do (
  >> "%OUTPUT%" echo ======================================
  >> "%OUTPUT%" echo FILE: %%F
  >> "%OUTPUT%" echo ======================================
  type "%%F" >> "%OUTPUT%"
  >> "%OUTPUT%" echo.
  >> "%OUTPUT%" echo.
)

echo Export completado en %OUTPUT%
pause