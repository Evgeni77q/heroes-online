# Fresh Clone Gate

**The only remaining risk before `v0.1.0-alpha` is real-environment stability** — not code.

Docker, PostgreSQL, WebSocket, tick timing. If this passes, the tag is justified.

---

## The Gate (4 steps)

```
1. fresh clone
2. docker compose up
3. seed
4. release:gate
```

Everything else (unit tests, builds) is secondary — CI already covers them.

---

## One Command

From a **fresh clone** of the repository:

### Linux / macOS

```bash
cp backend/.env.example backend/.env
bash scripts/fresh-clone-gate.sh
```

### Windows (PowerShell)

```powershell
.\scripts\fresh-clone-gate.ps1
```

The script:

1. Starts PostgreSQL (`docker compose up -d postgres`)
2. Runs `npm ci`, `prisma db push`, `npm run seed:dev`
3. Starts backend (`GAME_SMOKE_FAST_BUILD=true`, tick 1s)
4. Runs `npm run release:gate` (health → seed → smoke → resilience → stuck-jobs)

On success:

```
release gate result:
  ✔ health
  ✔ seed
  ✔ e2e
  ✔ resilience
  ✔ no stuck jobs
```

```bash
git tag v0.1.0-alpha
git push origin v0.1.0-alpha
```

---

## Two Levels of Trust

| Level | Mechanism | Role |
|-------|-----------|------|
| Local | `fresh-clone-gate` | Development verification |
| System | CI `release-gate.yml` | **Source of truth** |

Both run the **same** `release:gate` contract. If CI is green on GitHub, the tag is formally justified — even without local Docker.

```
clean environment → build → start backend → full game lifecycle
```

CI is not “test CI” — it is a **game runtime simulator**.

---

## No Manual State Dependency

**Rule:** Any game world state MUST be recoverable through `seed` + Game Loop.

| Allowed | Forbidden |
|---------|-----------|
| `npm run seed:dev` | Manual SQL fixes as required startup step |
| Game Loop ticks | Hand-editing rows to “fix” dev environment |
| Idempotent re-seed | Hidden local-only DB state |

If the world cannot be reproduced from seed + runtime, the gate is broken.

---

## Runtime Model

```
Before:  code → features → testing
Now:     runtime → game world → verification
```

The system verifies itself. World state is reproducible. Behavior is deterministic through the gate.

---

| Layer | Verified |
|-------|----------|
| Database | schema + seed + job completion |
| Game Loop | ticks complete upgrades |
| WebSocket | `building.updated` delivered |
| HTTP | command acceptance |
| Idempotency | seed + gate re-runnable |

---

## Project Stage

```
❌ "разработка игры"        → adding architecture
✅ "эксплуатация движка"    → adding game systems on the core
```

After the tag, **do not add infrastructure** unless a real need appears.

Next focus: **v0.2 Economy** — first stress test of BalanceService, Game Loop load, WebSocket frequency, UI reactivity, and job queue under continuous production.

**Pipeline (fixed):** Command → Timed Job → Game Loop → Domain Event → WebSocket → UI

---

## References

- [Alpha Readiness Checklist](09_Alpha_Readiness.md)
- [Release Stabilization](08_Release_Stabilization.md)
- CI: `.github/workflows/release-gate.yml`
