# Release Plan

**Target:** `v0.1.0-alpha`  
**Status:** Ready after Story 4.4

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
- Architectural rules documented

---

# 3. What It Does Not Include

- Town Hall upgrade
- Army, territory, alliances
- Production tick for resources
- Admin panel, mobile client

---

# 4. Tag Checklist

- [ ] Story 4.1–4.4 pass end-to-end smoke test (Docker + backend + frontend)
- [ ] `npm test` passes (backend)
- [ ] `npm run build` passes (frontend + backend)
- [ ] `git tag v0.1.0-alpha`
- [ ] GitHub Release notes with architecture diagram

---

# 5. After Alpha

New mechanics reuse the same pipeline:

| Mechanic | Command | Job kind | Domain event | Realtime subscriber |
|----------|---------|----------|--------------|---------------------|
| Building upgrade | ✅ | `BUILDING_UPGRADE` | `building.upgraded` | ✅ |
| Army training | planned | `ARMY_TRAINING` | `army.trained` | planned |
| Research | planned | `RESEARCH` | `research.completed` | planned |

No core rewrites — new `GameJobKind`, handler, subscriber.
