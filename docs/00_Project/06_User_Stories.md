# User Stories & Development Process

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03

---

# 1. Core Rule

Heroes Online is developed through **User Stories**, not isolated modules.

Every Story must deliver a **working player scenario** — not just files, APIs, or UI fragments.

## Infrastructure Freeze (post v0.1.0-alpha)

**Do not add new infrastructure until a real problem forces it.**

Focus shifts from architecture to **game systems**. Reuse Command → Timed Job → Game Loop → Domain Event → WebSocket → UI.

Next epic: [v0.2 Economy](11_v0.2_Economy.md).

---

# 2. Story Template

Each User Story MUST define:

| Section | Description |
|---------|-------------|
| **Player Goal** | What new capability the player gains |
| **Domain Logic** | Which game rules are implemented |
| **Backend** | API endpoints and business logic |
| **Frontend** | UI and interaction |
| **Integration** | Game Loop, WebSocket, events (if required) |
| **Definition of Done** | Verifiable end-to-end scenario |
| **Release Gate** | Extend smoke / `release:gate` when behavior is player-visible |

A Story is **not complete** until the Definition of Done passes in a real environment (no mocks, no TODO placeholders) **and** the release gate stays green.

### Vertical Slice Checklist (every major story)

```
User Story → Backend → Frontend → Game Loop → Realtime → E2E → Release Gate
```

---

# 3. API Types

## 3.1 Domain API

Operates on specific entities. Used by internal screens and game systems.

Examples:

```
/api/v1/players
/api/v1/cities
/api/v1/buildings
/api/v1/armies
```

## 3.2 View API

Aggregates data for a specific screen. Minimizes HTTP requests and simplifies the frontend.

Examples:

```
/api/v1/dashboard      — main screen
/api/v1/world-map      — map view (future)
/api/v1/city-overview  — full city screen (future)
```

**Rule:** Prefer extending an existing View API over adding redundant endpoints for the same screen.

---

# 4. Epic Backlog (Current)

| Epic | Goal | Priority |
|------|------|----------|
| City Management | City, buildings, resources | ⭐⭐⭐⭐⭐ |
| Building System | Construction and upgrades | ⭐⭐⭐⭐⭐ |
| World Map | Map and movement | ⭐⭐⭐⭐ |
| Army | Recruitment and upkeep | ⭐⭐⭐⭐ |
| Territory | Tile capture | ⭐⭐⭐ |
| Alliance | Alliances | ⭐⭐⭐ |
| Chat | In-game chat | ⭐⭐ |
| Rankings | Player leaderboards | ⭐⭐ |

---

# 5. Sprint 3 — City Management

## Story 1: Dashboard → City Card

### Player Goal

After registration, the player opens Dashboard and sees a meaningful city overview — not placeholders.

### Domain Logic

- Town Hall level = `city.level`
- Population, storage capacity, and production rates derived from `BalanceService` formulas
- All values reflect PostgreSQL state

### Backend

Extend existing **View API** `GET /api/v1/dashboard` (do **not** add `GET /api/v1/city` yet).

Target `data` payload (inside API Contract envelope):

```json
{
  "account": {
    "id": "...",
    "username": "Evgeniy"
  },
  "player": {
    "id": "...",
    "worldId": "...",
    "cityId": "...",
    "world": "Europe-1"
  },
  "resources": {
    "wood": 500,
    "stone": 500,
    "gold": 500,
    "food": 250
  },
  "city": {
    "id": "...",
    "name": "New Haven",
    "level": 1,
    "population": 25,
    "storage": {
      "wood": 1000,
      "stone": 1000,
      "gold": 1000,
      "food": 1000
    },
    "production": {
      "wood": 12,
      "stone": 10,
      "gold": 4,
      "food": 15
    }
  }
}
```

### Frontend

- `features/city/components/city-card.tsx` (or `features/dashboard`)
- Render city name, Town Hall level, population, storage, production
- Data from `GET /api/v1/dashboard` only — single request

### Integration

None for Story 1 (static load; WebSocket in Story 4).

### Definition of Done

- [x] Player opens Dashboard after registration
- [x] City name is visible
- [x] Town Hall level is visible
- [x] Population is visible
- [x] Storage capacity per resource is visible
- [x] Production rate per resource is visible
- [x] All values come from backend (no mocks)
- [x] After F5, data reloads correctly
- [x] No TODOs or hardcoded placeholders

---

## Story 2: Resources Panel

**Status:** Completed

### Player Goal

The player sees current resource balances and production rates on Dashboard in a clear, readable format.

### Frontend

`features/resources/`:

```
components/
  resource-icon.tsx
  resource-item.tsx
  resources-panel.tsx
types/resource.types.ts
utils/format-resource.ts
```

### Definition of Done

- [x] Unified `ResourceType` and `ResourceAmounts`
- [x] `ResourceItem` component
- [x] Resource icons (🌲 🪨 🪙 🌾)
- [x] Number formatting (`12 500`)
- [x] Production display (`+N/min`)
- [x] `ResourcesPanel` accepts `amounts` + `production` props (WebSocket-ready, no Dashboard type coupling)
- [x] Single dashboard API request
- [x] Unit tests for `format-resource` utils
- [x] No mocks or TODOs

---

## Story 3: Buildings List

**Status:** Completed

### Player Goal

The player sees all city buildings with levels, status, and upgrade costs.

### Backend

Extended `GET /api/v1/dashboard` with `buildings[]`. Upgrade costs via `BalanceService.getUpgradeCost()`. Starter buildings seeded on onboarding.

### Frontend

`features/buildings/` with `BuildingCard`, `BuildingsList`, `UpgradeButton`, `BuildingStatus` enum, Zustand store ready for WebSocket.

### Definition of Done

- [x] Dashboard displays buildings list
- [x] Each building uses `BuildingCard`
- [x] Typed `BuildingStatus` (IDLE, UPGRADING, LOCKED)
- [x] Upgrade cost from BalanceService
- [x] Upgrade button visible (full cycle in Story 4)
- [x] Single dashboard API request
- [x] WebSocket-ready store and `BuildingUpdatedEvent` type
- [x] Build and tests pass

---

## Story 4: Upgrade (First Game Loop)

**Status:** Completed (ready for v0.1.0-alpha)

### 4.1 Upgrade Request — Done

- `building_upgrade_queue` table + `TimedGameJob` interface
- `POST /api/v1/building/upgrade` — command acceptance only
- Resources consumed on request; level unchanged until Game Loop (4.2)
- No WebSocket events yet (4.3)

This is the first **complete game cycle** — not a single feature.

### Architecture Rule

Game Loop MUST NOT call WebSocket Gateway directly.

```
BuildingUpgraded (domain event)
        ↓
Domain Event Bus
        ↓
WebSocket Publisher
        ↓
Clients
```

Use existing `EventBusService` / `EventService` as the transport layer. Game logic emits domain events only.

### Versioned Event Contracts

All realtime game events MUST be versioned:

```typescript
interface BuildingUpdatedEventV1 {
  event: "building.updated";
  version: 1;
  payload: {
    buildingId: string;
    level: number;
    status: BuildingStatus;
  };
}
```

### 4.1 Upgrade Request

```
UpgradeButton → POST /api/v1/building/upgrade
```

**DoD:** request succeeds; cost validated; resources consumed/reserved; construction task created; building status → UPGRADING.

**Response contract** — command acceptance only, not final state:

```json
{
  "success": true,
  "data": {
    "buildingId": "...",
    "status": "UPGRADING",
    "finishAt": "2026-07-03T18:42:10Z"
  }
}
```

Final level and `upgradeCost` arrive via `BuildingUpdatedEventV1` (4.3–4.4).

**Command errors** (examples): `INSUFFICIENT_RESOURCES`, `ALREADY_UPGRADING`, `MAX_LEVEL_REACHED`, `FORBIDDEN`.

### Pre-implementation Rules

1. **Commands vs Events** — HTTP commands may fail; WebSocket events only describe completed facts.
2. **Game Loop owns time** — no `setTimeout`, `sleep`, or delayed controller logic; only Queue → Tick → Complete.
3. **Golden Rule** — HTTP initiates; WebSocket synchronizes UI.

### 4.2 Game Loop — Done

```
findExpiredJobs → markRunning (atomic) → complete (transaction) → BuildingUpgradedEventV1
```

- `GameJobRepository` — generic timed job access (`findExpired`, `markRunning`, `complete`, `cancel`)
- Jobs created as `PENDING`; lock via atomic `PENDING → RUNNING`
- Completion in single transaction: level++, `currentUpgradeId = null`, job `COMPLETED`
- `DomainEventBus` publishes `BuildingUpgradedEventV1` — no WebSocket in Game Loop

### 4.3 WebSocket — Done

```
BuildingUpgradedEventV1 → DomainEventBus → BuildingUpdatedRealtimeSubscriber → emitToPlayer()
```

- `DomainEventBus` with `subscribe` / `publish` (0..N subscribers)
- `BuildingUpdatedRealtimeSubscriber` maps domain → `building.updated` v1
- Game Loop does not know about WebSocket

### 4.4 Frontend Sync — Done

```
Socket → building.updated → buildingsStore → BuildingCard
```

- `useBuildingRealtime` — no HTTP on completion
- Level and `upgradeCost` update from WebSocket only

### 4.3 WebSocket (reference)

```
Game Loop → building.updated → Gateway → owner only
```

**DoD:** event sent to city owner; format matches `BuildingUpdatedEventV1`. ✅

### 4.4 Frontend Sync (reference)

```
Socket → buildingsStore → BuildingCard → UI
```

**DoD:** no F5; no extra HTTP; level and next upgrade cost update automatically. ✅

### Release Milestone

After Story 4.4, tag **v0.1.0-alpha** — first stable vertical slice (Command → Timed Job → Game Loop → Domain Event → Realtime → Store → UI). See [Release Plan](07_Release_Plan.md).

```
Player → UpgradeButton → HTTP API → Game Logic → Game Loop
  → Domain Event → WebSocket → Store → React UI
```

Story is **not done** until all four sub-tasks pass end-to-end.

---

# 6. Component Strategy

Build Story 1–3 with composable components:

- `CityCard`
- `ResourcesPanel`
- `BuildingsList`

This allows Story 4 to add WebSocket subscriptions with minimal refactoring.

---

# 7. Feature Completion Rule

A feature is **complete** only when it:

1. Has its own directory under `features/`
2. Has its own types
3. Does not depend directly on another feature's implementation (shared utils/types are allowed)
4. Can be reused across screens
5. Includes basic tests when it contains business logic

Examples:

| Feature | Tests required |
|---------|----------------|
| `resources/utils/format-resource` | Yes |
| `resources/components/resource-item` | No (presentation only) |
| `dashboard/dashboard.service` | Yes |

---

# 8. References

- [API Contract](../06_Backend/01_API_Contract.md)
- [Backend Architecture](../06_Backend/02_Backend_Architecture.md)
