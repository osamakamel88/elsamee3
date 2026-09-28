@echo off
title Stop elsamee3 (السميع)
echo Stopping elsamee3 backend and frontend processes...

:: Stop backend (python on port 8000)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Stop frontend (node on port 5173)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo elsamee3 has been stopped.
timeout /t 2 >nul
exit
