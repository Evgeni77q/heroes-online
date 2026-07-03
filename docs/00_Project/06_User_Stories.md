# User Stories & Development Process

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03

---

# 1. Core Rule

Heroes Online is developed through **User Stories**, not isolated modules.

Every Story must deliver a **working player scenario** — not just files, APIs, or UI fragments.

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

A Story is **not complete** until the Definition of Done passes in a real environment (no mocks, no TODO placeholders).

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

- [ ] Player opens Dashboard after registration
- [ ] City name is visible
- [ ] Town Hall level is visible
- [ ] Population is visible
- [ ] Storage capacity per resource is visible
- [ ] Production rate per resource is visible
- [ ] All values come from backend (no mocks)
- [ ] After F5, data reloads correctly
- [ ] No TODOs or hardcoded placeholders

---

## Story 2: Resources Panel

Live resource values with production rates `(+12/min)`. Reuse component structure for future WebSocket updates.

---

## Story 3: Buildings List

Town Hall, Barracks, Farm, Sawmill, Quarry — from backend.

---

## Story 4: Upgrade (First Game Loop)

```
Upgrade → Backend → Game Loop → WebSocket → UI
```

Story is **not done** until the full cycle works without page reload.

---

# 6. Component Strategy

Build Story 1–3 with composable components:

- `CityCard`
- `ResourcesPanel`
- `BuildingsList`

This allows Story 4 to add WebSocket subscriptions with minimal refactoring.

---

# 7. References

- [API Contract](../06_Backend/01_API_Contract.md)
- [Backend Architecture](../06_Backend/02_Backend_Architecture.md)
