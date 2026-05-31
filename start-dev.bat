@echo off
REM ============================================================
REM 寿险精算 Playground — 开发模式一键启动
REM 启动 FastAPI 后端 (port 8000) + Vite 前端 (port 5173)
REM ============================================================

echo ========================================
echo  寿险精算 Playground — 开发模式
echo ========================================
echo.

REM Check Python
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found on PATH
    pause
    exit /b 1
)

REM Check Node
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found on PATH
    pause
    exit /b 1
)

echo [1/4] Installing actuarial-engine...
cd /d "%~dp0actuarial-engine"
python -m pip install -e . -q

echo [2/4] Installing actuarial-api...
cd /d "%~dp0actuarial-api"
python -m pip install -e . -q

echo [3/4] Installing frontend dependencies...
cd /d "%~dp0actuarial-playground"
call npm install --silent

echo [4/4] Starting servers...

REM Start backend in background
echo.
echo [backend] Starting FastAPI on http://localhost:8000 ...
start "Actuarial API" cmd /c "cd /d %~dp0actuarial-api && python -m uvicorn actuarial_api.main:app --reload --port 8000"

REM Wait for backend to be ready
echo [backend] Waiting for API to be ready...
:wait_api
timeout /t 2 /nobreak >nul
curl -s http://localhost:8000/api/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 goto wait_api
echo [backend] API is ready!

REM Start frontend
echo [frontend] Starting Vite on http://localhost:5173 ...
cd /d "%~dp0actuarial-playground"
call npm run dev
