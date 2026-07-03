# v0.1.0-alpha Readiness Checklist

**Do not tag `v0.1.0-alpha` until every item is green.**

---

## Build & Unit Tests

- [ ] Backend builds (`cd backend && npm run build`)
- [ ] Frontend builds (`cd frontend && npm run build`)
- [ ] Unit tests pass (`cd backend && npm test` — 20 tests)

---

## Release Gate (live backend required)

Standard gate — same as CI:

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

One command (backend must already be running):

```bash
cd backend
npm run release:gate
```

Or step by step:

```bash
curl http://localhost:8080/health          # status: ok
npm run seed:dev                           # idempotent
npm run smoke:e2e
npm run smoke:resilience
node scripts/check-stuck-jobs.mjs          # no expired PENDING/RUNNING
```

---

## Stuck Jobs Rule

After smoke, the database MUST NOT contain jobs where:

- `status` is `PENDING` or `RUNNING`, **and**
- `finishAt <= now` (expired but not completed)

Active upgrades with `finishAt` in the future are allowed (e.g. after resilience tests).

---

## Tag

Only when all checks pass:

```bash
git tag v0.1.0-alpha
git push origin v0.1.0-alpha
```

---

## Post-Alpha Focus

No further infrastructure unless required. Build game systems on the existing pipeline:

| Version | System |
|---------|--------|
| v0.2 | Economy — production, storage, city balance |
| v0.3 | Army — training, upkeep, movement |
| v0.4 | World & Territory — interactive map, capture |
| v0.5 | Combat — PvE/PvP via Game Loop + Domain Events |
| v0.6 | Social — alliances, diplomacy, chat |

**Pipeline (unchanged):** Command → Timed Job → Game Loop → Domain Event → WebSocket → UI

Each new system follows the [Game System Stabilization Rule](08_Release_Stabilization.md#6-game-system-stabilization-rule-post-alpha).
