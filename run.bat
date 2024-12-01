@echo off
start "" /b tsc src/index.ts --outDir out --watch --target ES2017 --module nodenext --moduleResolution nodenext
start "" /b npx sass src/style.sass out/style.css --watch

:loop
cls
echo Waiting for a key press...
pause >nul

start "" /b npx electron . >nul
pause >nul

taskkill /f /im electron.exe >nul 2>&1
goto loop