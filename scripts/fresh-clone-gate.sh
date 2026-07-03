#!/usr/bin/env bash
# Fresh-clone alpha gate — the only real risk check before v0.1.0-alpha.
#
# Prerequisites: Docker, Node.js 22+, git clone of heroes-online
#
# Usage (from repo root):
#   cp backend/.env.example backend/.env   # if no .env yet
#   bash scripts/fresh-clone-gate.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[fresh-clone] 1/4 docker compose up"
docker compose up -d postgres

echo "[fresh-clone] waiting for postgres..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U heroes -d heroes_online >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "[fresh-clone] 2/4 install + schema + seed"
cd backend
npm ci
npx prisma generate
npx prisma db push
npm run seed:dev

if [ ! -f .env ]; then
  echo "[fresh-clone] copy backend/.env.example to backend/.env and set DATABASE_URL"
  cp .env.example .env
fi

export GAME_LOOP_TICK_MS="${GAME_LOOP_TICK_MS:-1000}"
export GAME_SMOKE_FAST_BUILD="${GAME_SMOKE_FAST_BUILD:-true}"
export ACCOUNT_AUTO_ACTIVATE="${ACCOUNT_AUTO_ACTIVATE:-true}"

echo "[fresh-clone] 3/4 start backend"
npm run build
npm run start:prod &
BACKEND_PID=$!
trap 'kill "$BACKEND_PID" 2>/dev/null || true' EXIT

echo "[fresh-clone] 4/4 release:gate"
npm run release:gate

echo "[fresh-clone] PASSED — safe to tag v0.1.0-alpha"
