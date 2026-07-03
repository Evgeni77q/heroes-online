# Release Plan

**Target:** `v0.1.0-alpha`  
**Status:** Blocked on [Fresh Clone Gate](10_Fresh_Clone_Gate.md) on real Docker/PostgreSQL

See [Release Stabilization Sprint](08_Release_Stabilization.md).

---

# 1. Why This Release

Heroes Online completes its first full vertical slice:

```
Player → Command → Validation → Timed Job → Game Loop
  → Domain Event → Realtime → Store → UI
```

This is the first **architecturally stable** milestone — not feature-complete, but foundation-complete.

---

# 2. What v0.1.0-alpha Includes

- Auth + Onboarding + Dashboard
- City, Resources, Buildings (view)
- Building upgrade: HTTP command → timed job → game loop → WebSocket sync
- `DomainEventBus` + subscriber pattern
- `GameJobRepository` (timed jobs)
- Game loop metrics
- `GET /health` diagnostics endpoint
- `npm run seed:dev` — Europe-1 world bootstrap
- E2E + resilience smoke scripts
- Architectural rules documented

---

# 3. Tag Checklist

**One gate matters:** [Fresh Clone Gate](10_Fresh_Clone_Gate.md) (`fresh clone → docker → seed → release:gate`).

CI (`.github/workflows/release-gate.yml`) runs the same logic on every push to `main`.

---

# 4. After Alpha — Game System Roadmap

**Rule:** No new infrastructure without a proven need. Build game systems on the core.

| Version | Game System | Doc |
|---------|-------------|-----|
| v0.2 | Economy — production, storage, player trade-offs | [11_v0.2_Economy](11_v0.2_Economy.md) |
| v0.3 | Army | planned |
| v0.4 | World & Territory | planned |
| v0.5 | Combat | planned |
| v0.6 | Social | planned |

All systems use the same pipeline — no core rewrites.

### v0.1.0-alpha tag criterion

Tag when **both** are true:

1. `release-gate.yml` passes fully on GitHub Actions (clean environment).
2. No expired stuck jobs after smoke (`check-stuck-jobs`).

Then stop touching infrastructure unless a real problem appears.

### Engineering → Game Design

| Phase | Question |
|-------|----------|
| v0.1 (done) | How does the engine work? |
| v0.2+ | What should the player do? |

Alpha tag is no longer "can we?" — it is **"when is CI green?"**

After alpha: turn simulation into a game. Architecture changes only when load proves it necessary.
