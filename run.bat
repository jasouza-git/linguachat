@echo off
start "" /b tsc src/index.ts --outDir out --watch --target ES2017 --module nodenext --moduleResolution nodenext
start "" /b npx sass src/style.sass out/style.css --watch

:loop
echo Press any key to clear
pause >nul
cls
rem echo Waiting for a key press...
rem pause >nul

rem start "" /b npx electron . >nul
rem pause >nul

rem taskkill /f /im electron.exe >nul 2>&1
goto loop