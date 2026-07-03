# v0.1.0-alpha Readiness Checklist

**Do not tag `v0.1.0-alpha` until the [Fresh Clone Gate](10_Fresh_Clone_Gate.md) passes.**

The only remaining risk is **real-environment stability** (Docker, PostgreSQL, WebSocket, tick timing) — not code.

---

## Primary Gate (required)

```
1. fresh clone
2. docker compose up
3. seed
4. release:gate
```

```bash
bash scripts/fresh-clone-gate.sh      # Linux/macOS
.\scripts\fresh-clone-gate.ps1        # Windows
```

If this is green, the tag is **justified** — not ceremonial.

---

## Secondary Checks (CI covers these)

- [ ] Backend builds
- [ ] Frontend builds
- [ ] 20 unit tests pass
- [ ] GitHub Actions `Release Gate` workflow green

---

## Release Gate Internals

```
GET /health == 200 → seed:dev → smoke:e2e → smoke:resilience → check-stuck-jobs
```

```bash
cd backend && npm run release:gate   # when backend already running
```

### Stuck Jobs Rule

No jobs with `status IN (PENDING, RUNNING)` and `finishAt <= now`.

---

## Tag

```bash
git tag v0.1.0-alpha
git push origin v0.1.0-alpha
```

---

## After Alpha — Engine Operations Mode

Stop adding architecture. Add **game systems** on the core:

| Version | System | Stresses |
|---------|--------|----------|
| v0.2 | Economy | BalanceService, production ticks, storage, WS frequency |
| v0.3 | Army | Timed jobs, upkeep, movement |
| v0.4 | World & Territory | Map state, ownership events |
| v0.5 | Combat | Domain events at scale |
| v0.6 | Social | Multi-player realtime |

**Pipeline:** Command → Timed Job → Game Loop → Domain Event → WebSocket → UI
