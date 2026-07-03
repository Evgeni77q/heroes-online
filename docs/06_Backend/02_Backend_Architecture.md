# Backend Architecture

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03

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

HTTP modifies state.

Realtime distributes state changes.

Business logic must not depend on WebSocket transport.

---

# 9. Game Loop Integration

Game Loop is the only component responsible for autonomous world simulation:

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

# 15. Future Extensions

The architecture reserves space for:

- microservices (if needed);
- analytics;
- anti-cheat;
- admin panel;
- public API;
- mobile client.
