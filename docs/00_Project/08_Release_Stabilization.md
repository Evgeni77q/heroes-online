# Release Stabilization Sprint

**Goal:** Verify v0.1.0-alpha readiness — no new features.

See [Alpha Readiness Checklist](09_Alpha_Readiness.md) for the full tag gate.

---

# 1. Release Gate (standard)

If any step fails, the release is **not ready**.

```
Backend startup
    ↓
GET /health == 200
    ↓
seed:dev
    ↓
smoke:e2e
    ↓
smoke:resilience
    ↓
check-stuck-jobs
```

```bash
# backend running with GAME_SMOKE_FAST_BUILD=true
cd backend
npm run release:gate
```

CI runs the same gate on every push/PR to `main` (`.github/workflows/release-gate.yml`).

---

# 2. Quick Start (new developer)

```bash
docker compose up -d postgres
cd backend
npx prisma db push
npm run seed:dev
$env:GAME_LOOP_TICK_MS="1000"
$env:GAME_SMOKE_FAST_BUILD="true"
$env:ACCOUNT_AUTO_ACTIVATE="true"
npm run start:dev
# another terminal:
npm run release:gate
```

---

# 3. E2E Smoke (`smoke:e2e`)

- [x] Register → onboarding → dashboard
- [x] Resources & buildings visible
- [x] Upgrade → UPGRADING → Game Loop → `building.updated`
- [x] Dashboard correct after refresh (F5)

---

# 4. Resilience (`smoke:resilience`)

| Scenario | Expected |
|----------|----------|
| Duplicate Upgrade | 409 |
| No resources | 422 or 409 |
| Multiple buildings | parallel jobs |
| Backend restart | jobs complete on next tick (manual) |

---

# 5. Stuck Jobs (`check-stuck-jobs`)

Fails when expired jobs (`finishAt <= now`) remain `PENDING` or `RUNNING`.

---

# 6. Metrics

`GET /api/v1/admin/metrics` → `gameLoop` block.

---

# 7. Versioning Policy

WebSocket events, domain events, and REST paths use explicit versioning. Breaking changes → new version.

---

# 8. Game System Stabilization Rule (post-alpha)

Every major mechanic ships with: unit tests, integration tests, E2E smoke, resilience tests, metrics, documentation.

---

# 9. Health

`GET /health` — no auth, no `/api` prefix. HTTP 503 when degraded.

---

# 10. Seed

`npm run seed:dev` — idempotent Europe-1 + 32×32 map.

---

# 11. Post-Alpha Roadmap

| Version | Focus |
|---------|-------|
| v0.2 | Economy |
| v0.3 | Army |
| v0.4 | World & Territory |
| v0.5 | Combat |
| v0.6 | Social |

Same pipeline for all: **Command → Timed Job → Game Loop → Domain Event → WebSocket → UI**.

---

# 12. No Manual State Dependency

Any game world state MUST be recoverable through `seed` + Game Loop.

Manual database edits MUST NOT be a required step to start or verify the system.
