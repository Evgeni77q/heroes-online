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

| Version | Game System |
|---------|-------------|
| v0.2 | Economy |
| v0.3 | Army |
| v0.4 | World & Territory |
| v0.5 | Combat |
| v0.6 | Social |

All systems use the same pipeline — no core rewrites.
