# Fresh-clone alpha gate — the only real risk check before v0.1.0-alpha.
#
# Usage (from repo root):
#   .\scripts\fresh-clone-gate.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "[fresh-clone] 1/4 docker compose up"
docker compose up -d postgres

Write-Host "[fresh-clone] waiting for postgres..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  try {
    docker compose exec -T postgres pg_isready -U heroes -d heroes_online | Out-Null
    $ready = $true
    break
  } catch {
    Start-Sleep -Seconds 2
  }
}
if (-not $ready) {
  throw "PostgreSQL did not become ready in time"
}

Write-Host "[fresh-clone] 2/4 install + schema + seed"
Set-Location "$Root\backend"
npm ci
npx prisma generate
npx prisma db push
npm run seed:dev

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "[fresh-clone] created backend/.env from .env.example"
}

$env:GAME_LOOP_TICK_MS = if ($env:GAME_LOOP_TICK_MS) { $env:GAME_LOOP_TICK_MS } else { "1000" }
$env:GAME_SMOKE_FAST_BUILD = if ($env:GAME_SMOKE_FAST_BUILD) { $env:GAME_SMOKE_FAST_BUILD } else { "true" }
$env:ACCOUNT_AUTO_ACTIVATE = if ($env:ACCOUNT_AUTO_ACTIVATE) { $env:ACCOUNT_AUTO_ACTIVATE } else { "true" }

Write-Host "[fresh-clone] 3/4 start backend"
npm run build
$backend = Start-Process -FilePath "npm" -ArgumentList "run", "start:prod" -PassThru -WindowStyle Hidden

try {
  Write-Host "[fresh-clone] 4/4 release:gate"
  npm run release:gate
  Write-Host "[fresh-clone] PASSED — safe to tag v0.1.0-alpha"
} finally {
  if ($backend -and -not $backend.HasExited) {
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
  }
}
