# Release Stabilization Sprint

**Goal:** Verify v0.1.0-alpha readiness — no new features.

---

# 1. E2E Smoke Test (required)

Run against a live backend with fast build enabled:

```bash
docker compose up -d postgres
cd backend
npx prisma db push
$env:GAME_LOOP_TICK_MS="1000"
$env:GAME_SMOKE_FAST_BUILD="true"
$env:ACCOUNT_AUTO_ACTIVATE="true"
npm run start:dev
```

In another terminal:

```bash
cd backend
npm run smoke:e2e
```

### Checklist

- [x] Register
- [x] Auto onboarding
- [x] Dashboard
- [x] Resources visible
- [x] Buildings visible
- [x] Upgrade → UPGRADING
- [x] Game Loop completes job
- [x] `building.updated` via WebSocket
- [x] Dashboard correct after refresh (F5)

**Do not tag `v0.1.0-alpha` until smoke is green.**

---

# 2. Resilience Tests

```bash
npm run smoke:resilience
```

| Scenario | Expected |
|----------|----------|
| Duplicate Upgrade | 409 `ALREADY_UPGRADING` |
| No resources | 422 `INSUFFICIENT_RESOURCES` |
| Multiple buildings | parallel PENDING jobs |
| Backend restart | pending RUNNING/PENDING jobs complete on next tick |

---

# 3. Metrics

`GET /api/v1/admin/metrics` → `gameLoop`:

| Field | Meaning |
|-------|---------|
| `ticks` | Total game loop ticks |
| `avgTickDurationMs` | Average tick wall time |
| `jobsCompleted` | Timed jobs completed |
| `avgJobCompletionLagMs` | Average delay after `finishAt` |
| `domainEventsPublished` | Domain events emitted |

---

# 4. Versioning Policy

All contracts use explicit `version` where evolution is expected:

| Contract | Version field |
|----------|---------------|
| WebSocket events | `version: 1` |
| Domain events | `version: 1` |
| REST API | `/api/v1/...` path |
| View API | evolves with `/api/v1/dashboard` until breaking change |

New breaking shapes → increment version, never mutate v1 in place.

---

# 5. Post-Alpha Roadmap (game systems, not modules)

| Version | Focus |
|---------|-------|
| v0.2 | Economy — production, storage, resource ticks |
| v0.3 | Army — training, upkeep, movement |
| v0.4 | World & Territory — map, capture, ownership |
| v0.5 | Combat — PvE / PvP |
| v0.6 | Social — alliances, chat, diplomacy |

Each system reuses: **Command → Timed Job → Game Loop → Domain Event → WebSocket → UI**.
