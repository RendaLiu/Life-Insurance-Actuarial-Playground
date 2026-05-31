#!/bin/bash
# ============================================================
# 寿险精算 Playground — 开发模式一键启动 (Linux/macOS)
# ============================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo " 寿险精算 Playground — 开发模式"
echo "========================================"
echo ""

# Install engine
echo "[1/4] Installing actuarial-engine..."
cd "$DIR/actuarial-engine"
pip install -e . -q

# Install API
echo "[2/4] Installing actuarial-api..."
cd "$DIR/actuarial-api"
pip install -e . -q

# Install frontend
echo "[3/4] Installing frontend dependencies..."
cd "$DIR/actuarial-playground"
npm install --silent

# Start backend
echo "[4/4] Starting servers..."
echo "[backend] Starting FastAPI on http://localhost:8000 ..."
cd "$DIR/actuarial-api"
uvicorn actuarial_api.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend
echo "[backend] Waiting for API..."
until curl -s http://localhost:8000/api/health > /dev/null 2>&1; do
  sleep 1
done
echo "[backend] API is ready!"

# Start frontend
echo "[frontend] Starting Vite on http://localhost:5173 ..."
cd "$DIR/actuarial-playground"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo " Backend:  http://localhost:8000/docs"
echo " Frontend: http://localhost:5173"
echo "========================================"
echo " Press Ctrl+C to stop all servers"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
