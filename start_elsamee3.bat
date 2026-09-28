@echo off
title elsamee3 (السميع) Launcher
echo ===================================================
echo           Starting elsamee3 (السميع)
echo    Copyright Guardian for Musicians & Artists
echo ===================================================

cd /d "e:\elsamee3"

:: Check & Start Backend on port 8000 if not already running
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Starting FastAPI Backend on http://127.0.0.1:8000 ...
    start /min "elsamee3-backend" powershell -WindowStyle Hidden -Command "cd 'e:\elsamee3\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
) else (
    echo [*] Backend is already running on port 8000.
)

:: Check & Start Frontend on port 5173 if not already running
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Starting Vite Frontend on http://127.0.0.1:5173 ...
    start /min "elsamee3-frontend" powershell -WindowStyle Hidden -Command "cd 'e:\elsamee3\frontend'; npm run dev -- --host 127.0.0.1 --port 5173"
) else (
    echo [*] Frontend is already running on port 5173.
)

:: Wait 2 seconds and open the web browser
timeout /t 2 /nobreak >nul
echo [*] Opening elsamee3 in your browser...
start http://localhost:5173

echo ===================================================
echo elsamee3 is running!
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ===================================================
timeout /t 3 >nul
exit
