# Tech Bible

How Heroes Online stays maintainable for 10+ years.

This document complements:
- `docs/PROJECT_CONSTITUTION.md` (non‑negotiable conventions)
- `docs/GAME_BIBLE.md` (player-experience contract)
- `docs/PROJECT_MASTER_CONTEXT.md` (current status + rules)

---

## 1) Architecture Map (Dependency Direction)

Use this direction to reason about ownership and coupling:

```text
Frontend (Next.js)
    │
    ▼
API Gateway (controllers / REST)
    │
    ▼
Application Layer (use-cases / orchestration services)
    │
    ▼
Domain Layer (rules, invariants, deterministic transitions)
    │
    ▼
Infrastructure (repositories, external services)
    │
    ▼
PostgreSQL / Redis / Storage
```

Rules:
- Frontend depends on API contracts and receives data snapshots/state.
- Backend domain rules must not depend on frontend shape.
- Repositories and external systems are isolated in infrastructure.

---

## 2) Ownership Matrix (Source of Truth)

| What | System that owns it | Notes |
|---|---|---|
| Coordinates of buildings & plots | Backend | Backend authors the field: `backend/src/capital-city/build-field.config.ts` |
| Persistent game state | Backend | DB is the authoritative source for the current persistent state |
| Balance & economy rules | Backend | Keep rules deterministic and testable |
| Timers & construction queue progression | Game Loop | `backend/src/game-loop/*` drives progression |
| Real-time updates / WebSocket events | Backend (Realtime) | Push events after state changes |
| Rendering & UI state (camera/overlays) | Frontend | Frontend renders what it receives (data-driven) |
| Building composition appearance | Frontend | Composition is determined by part ids + composition layout |
| Asset resolution (final URLs) | Asset Resolver config | `frontend/src/features/capital-city/config/city-assets.config.ts` |
| Part ids and compositional domain identity | Frontend domain configs | Part ids are stable domain entities; format is implementation detail |

---

## 3) Event Flow (Lifecycle of an Action)

Example: Player clicks “Upgrade Building”.

1. Player clicks Upgrade (Frontend)
2. REST API call (Backend: controllers)
3. Validation (DTOs + domain guards)
4. Enqueue construction / set upgrade intent (Application Layer)
5. Game loop tick advances progress (Game Loop)
6. Building complete (Domain transition)
7. Database update (Infrastructure / repositories)
8. Publish realtime event (Realtime / Domain Events)
9. Frontend receives event (WebSocket)
10. Frontend animation / UI update (Composition + overlays)

Rules:
- UI should never perform domain transitions; it triggers requests and renders state.
- The server decides when something is complete; the client reacts.

---

## 4) Performance Budget (Decide Up Front)

Treat these as *engineering constraints* for each sprint.

### City Scene
- Hard cap: scene contains at most the designed maximum number of plots (currently 48) and one castle composition.
- Keep main-thread work low:
  - target: `city-scene` interactions < 30ms scripting per frame on a mid-range machine
- Avoid layout thrash:
  - prefer absolute-positioned sprites (already done) and memoization for plot/road lists.

### API / Latency
- API response target:
  - REST endpoints used by UI: aim for < 300ms p95 in dev/prod with DB warm.
- WebSocket event size:
  - send minimal deltas/events needed to update UI.

### Rendering / Assets
- Limit the number of layered images per composition:
  - every additional part adds DOM + image decode cost.
- Keep image sizes consistent:
  - cutout silhouettes should be shipped as implementation details (resolver enforces URLs).

Verification:
- Use Lighthouse / Web Vitals for frontend budgets.
- Add perf smoke checks for city scene interaction hotspots.

---

## 5) Asset Pipeline (From Art to Runtime)

Visual Production Pipeline is defined in:
- `docs/00_Project/18_Visual_Production_Pipeline.md`

Bridge it to code:

```text
Artist / Export
    │
    ▼
Review (internal QA / style match)
    │
    ▼
Export (PNG/WebP/AVIF cutouts)
    │
    ▼
Asset Resolver (city-assets.config.ts)
    │
    ▼
Composition (part ids + layout)
    │
    ▼
Runtime (ComposedBuilding + CityScene)
    │
    ▼
QA (visual checks in /city)
```

Rules:
- Part ids define domain identity; file names are implementation details.
- Composite fallback is temporary and must be removed when structural required part assets are available.

---

## 6) Testing Strategy (What “Done” Means)

We test by intent and risk area:

### Unit Tests
- Domain rules, deterministic transitions, cost calculations
- Examples: building effects, unlock logic, validators (backend)

### Integration Tests
- API + DB + repositories
- Example: construction queue affects persisted building state

### Gameplay Tests / Harnesses
- Simulation runs / scenario harnesses for long-running correctness
- Examples already present in backend scripts and `*.harness.ts`

### Visual Regression
- City scene screenshots and diff:
  - castle composition view
  - barracks composition view
  - layering correctness (z-index)

### Smoke Tests
- Basic endpoints respond
- Frontend can load key pages (`/city`, `/login`)

### Performance Tests (Budget checks)
- Track city scene render time under designed worst-case composition
- Ensure memory/decoding does not degrade over repeated renders

DoD verification:
- Every new vertical slice must include at least:
  - backend unit tests OR integration test
  - a smoke verification step for `/city` (manual or automated screenshot)

---

## 7) Sprint Protocol (How we build like a studio)

For every sprint / merged feature:
1. Design Review
   - confirm it fits `docs/GAME_BIBLE.md` and `docs/PROJECT_CONSTITUTION.md`
2. Technical Review
   - identify impacted systems
   - verify no duplicated logic / no coordinate remaps / correct ownership boundaries
3. Implementation
   - implement full vertical slice
4. Verification
   - confirm Definition of Done and update docs only when needed to keep SSOT consistent

