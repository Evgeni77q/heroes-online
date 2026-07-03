# Backend Architecture

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03 (Game Communication Model)

---

# 1. Purpose

This document defines the target architecture of the Heroes Online backend.

Goals:

- high cohesion;
- low coupling;
- scalability;
- testability;
- production readiness.

---

# 2. Technology Stack

- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- Socket.IO
- JWT
- Docker
- GitHub Actions

---

# 3. Architectural Principles

- Feature-first modular architecture.
- Dependency Injection via NestJS.
- No direct module-to-module database access.
- Business logic belongs to services.
- Controllers contain no business logic.
- Repositories are responsible only for persistence.
- Shared infrastructure belongs in `common/`.

---

# 4. Module Structure

Each feature module follows the same layout:

```text
feature/
├── controller/
├── service/
├── repository/
├── dto/
├── entities/
├── types/
├── feature.module.ts
```

---

# 5. Layer Responsibilities

## Controller

- HTTP endpoints
- Validation
- Authentication
- Delegates work to services

## Service

- Business rules
- Transactions
- Domain orchestration

## Repository

- Database access
- Prisma queries only

---

# 6. Shared Infrastructure (`common/`)

Contains reusable components:

- middleware
- filters
- interceptors
- decorators
- guards
- pipes
- interfaces
- utils

Feature modules MUST NOT duplicate shared functionality.

---

# 7. Cross-Cutting Services

Global services:

- BalanceService
- RealtimeService
- EventBusService
- GameLoop
- ConfigService
- Logger

These services may be injected into feature modules but should remain independent of domain-specific logic.

---

# 8. Realtime Integration

## Golden Rule

**HTTP initiates changes. WebSocket reports results.**

| Transport | Role |
|-----------|------|
| HTTP | Player commands — request an action |
| WebSocket | Game events — report what already happened |

`POST /building/upgrade` MUST NOT become a UI synchronization mechanism. The client applies final state only from WebSocket events.

View APIs (`GET /dashboard`) load initial screen state. Ongoing gameplay sync flows through events.

## Transport Independence

Business logic must not depend on WebSocket transport.

```
Domain Event → DomainEventBus → Subscribers (Realtime, Analytics, …) → Clients
```

Game Loop and completion services publish to `DomainEventBus` only. `BuildingUpdatedRealtimeSubscriber` bridges to `EventBusService`.

See also: [Game Communication Model](#15-game-communication-model).

## Single Source of Truth

**Game Loop is the only source of truth for game state changes.**

HTTP creates commands (enqueue jobs, reserve resources). It never applies final world state (level changes, battle outcomes, research completion).

| Layer | May change final game state? |
|-------|---------------------------|
| HTTP Command | No — enqueue only |
| Game Loop | Yes |
| WebSocket | No — read-only notification |

This rule applies to PvP, research, market, alliances, and sieges.

---

# 9. Game Loop Integration

Game Loop is the **only owner of game time**.

All autonomous progress — building completion, research, production, army movement, sieges, world events — advances exclusively through Game Loop ticks.

## Forbidden Patterns

```
HTTP → setTimeout → upgrade complete     ❌
HTTP → sleep() → upgrade                 ❌
Controller → delay → change level        ❌
```

## Required Pattern

```
HTTP → Queue → Game Loop Tick → Complete → Domain Event
```

HTTP accepts a command and enqueues work. The tick completes it and emits an event.

Game Loop responsibilities:

- resource production;
- building completion;
- army upkeep;
- scheduled world events.

---

# 10. Error Handling

Errors are processed only through the global exception filter.

Controllers and services should throw typed exceptions instead of constructing HTTP responses manually.

---

# 11. API Contract

All endpoints MUST comply with:

`docs/06_Backend/01_API_Contract.md`

---

# 12. Testing Strategy

- Unit tests for services.
- Integration tests for repositories.
- E2E tests for public API.

Critical gameplay systems require automated tests before release.

---

# 13. Logging

Every request includes a Request ID.

Structured logging is required.

Sensitive information must never be written to logs.

---

# 14. Scalability

The architecture must support:

- multiple game worlds;
- horizontal backend scaling;
- worker processes;
- background jobs;
- independent frontend deployment.

---

# 15. Game Communication Model

Two categories of messages exist. They MUST NOT be mixed.

## 15.1 Commands (HTTP)

A **command** is the player asking the game to do something.

Examples:

| Command | Endpoint (example) |
|---------|-------------------|
| `UpgradeBuildingCommand` | `POST /api/v1/building/upgrade` |
| `TrainUnitsCommand` | `POST /api/v1/army/train` |
| `AttackTerritoryCommand` | `POST /api/v1/territory/attack` |
| `ResearchTechnologyCommand` | `POST /api/v1/research/start` |

Commands:

- MAY fail with a business error (insufficient resources, already upgrading, no access, limit exceeded);
- MUST NOT complete long-running work inline;
- SHOULD return minimal acceptance data, not final game state.

## 15.2 Events (WebSocket)

An **event** is the game reporting that something already happened.

Examples:

| Event | Contract |
|-------|----------|
| `BuildingUpdatedEventV1` | `building.updated` v1 |
| `ResourcesUpdatedEventV1` | `resources.updated` v1 |
| `ArmyUpdatedEventV1` | `army.updated` v1 |
| `TerritoryCapturedEventV1` | `territory.captured` v1 |

Events:

- NEVER contain business decisions;
- ONLY describe facts that already occurred;
- MUST be versioned (`version: 1`).

## 15.3 Standard Game Cycle

Every gameplay mechanic SHOULD follow:

```
Command → Queue → Game Loop Tick → Domain Event → WebSocket → UI
```

Timed jobs (`BuildingUpgradeQueue`, future job types) implement the shared `TimedGameJob` contract via `GameJobRepository`. Game Loop processors MUST NOT query job tables directly.

`GameJobRepository` API:

| Method | Purpose |
|--------|---------|
| `findExpired(now)` | Jobs ready to complete (`finishAt <= now`) |
| `markRunning(id)` | Atomic `PENDING → RUNNING` lock |
| `claimCompletion(id, tx)` | Atomic `RUNNING → COMPLETED` inside transaction |
| `cancel(id)` | Cancel pending/running job |

New mechanics add new `GameJobKind` values and completion handlers — not new queue interaction patterns.

Story 4 establishes this pattern for building upgrades.

---

# 16. Future Extensions

The architecture reserves space for:

- microservices (if needed);
- analytics;
- anti-cheat;
- admin panel;
- public API;
- mobile client.
