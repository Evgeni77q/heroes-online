# API Contract

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03 (Game Commands & Events)

---

# 1. Purpose

This document defines the official API contract for the Heroes Online backend.

All HTTP endpoints, WebSocket events, background workers and future public APIs MUST follow this specification.

The goals are:

- predictable responses;
- strong typing;
- unified error handling;
- compatibility with frontend, mobile and admin panel;
- long-term maintainability.

---

# 2. API Versioning

All REST endpoints MUST be versioned.

Example:

```
/api/v1/account/login
/api/v1/account/register
/api/v1/city
/api/v1/buildings
```

Rules:

- Breaking changes require a new version.
- Old versions remain supported according to the deprecation policy.

---

# 3. Success Response

Every successful response MUST use the following envelope.

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-07-03T12:00:00Z",
    "requestId": "req_xxxxx"
  }
}
```

Definitions:

| Field | Description |
|-------|-------------|
| success | Always true |
| data | Response payload |
| meta.timestamp | UTC ISO-8601 |
| meta.requestId | Unique request identifier |

---

# 4. Error Response

Every error MUST use the following structure.

```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_NOT_FOUND",
    "message": "Account not found"
  },
  "meta": {
    "timestamp": "2026-07-03T12:00:00Z",
    "requestId": "req_xxxxx"
  }
}
```

Rules:

- message is safe for client display.
- code is stable and machine-readable.
- stack traces are never returned.

---

# 5. HTTP Status Codes

| Status | Usage |
|---------|-------|
| 200 | Successful GET/PUT |
| 201 | Resource created |
| 204 | Successful without body |
| 400 | Validation error |
| 401 | Authentication required |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Business conflict |
| 422 | Domain validation error |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

# 6. Pagination

Paginated endpoints MUST return:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 245,
    "hasNext": true,
    "timestamp": "...",
    "requestId": "..."
  }
}
```

---

# 7. Request ID

Every HTTP request MUST receive a unique Request ID.

Purpose:

- debugging;
- tracing;
- monitoring;
- distributed logging.

Header:

```
X-Request-ID
```

---

# 8. Correlation ID

Background jobs, WebSocket events and internal service calls SHOULD propagate the original Request ID as a Correlation ID.

Header:

```
X-Correlation-ID
```

---

# 9. Timestamp

All timestamps MUST:

- use UTC;
- use ISO-8601 format;
- never depend on client locale.

Example:

```
2026-07-03T12:34:56Z
```

---

# 10. Naming Convention

JSON uses camelCase.

Examples:

```
playerId
cityId
buildingLevel
resourceType
createdAt
updatedAt
```

Database naming remains snake_case.

---

# 11. Validation

All request DTOs MUST use class-validator.

Validation errors MUST use the standard error envelope.

---

# 12. Authentication

Protected endpoints MUST require JWT Bearer authentication.

Authorization header:

```
Authorization: Bearer <token>
```

---

# 13. OpenAPI

Every controller MUST be documented with Swagger decorators.

Required:

- operation summary;
- request DTO;
- response DTO;
- possible errors.

---

# 14. Backward Compatibility

Breaking API changes MUST NOT be introduced within the same API version.

Any breaking change requires a new version.

---

# 15. Game Commands

Commands are HTTP requests that ask the game to perform an action. They MAY fail. They MUST NOT return final post-tick game state.

## POST /api/v1/building/upgrade

**Request:**

```json
{
  "buildingId": "uuid",
  "cityId": "uuid"
}
```

**Success (202-style acceptance, HTTP 200):**

```json
{
  "success": true,
  "data": {
    "buildingId": "uuid",
    "status": "UPGRADING",
    "finishAt": "2026-07-03T18:42:10Z"
  },
  "meta": {
    "timestamp": "2026-07-03T12:00:00Z",
    "requestId": "req_xxxxx"
  }
}
```

**Business errors (examples):**

| code | HTTP |
|------|------|
| `INSUFFICIENT_RESOURCES` | 422 |
| `ALREADY_UPGRADING` | 409 |
| `MAX_LEVEL_REACHED` | 422 |
| `FORBIDDEN` | 403 |

The client MUST NOT treat this response as the source of truth for level or `upgradeCost`. Those arrive via WebSocket.

---

# 16. Game Events (WebSocket)

Events report facts that already happened. They are versioned contracts.

## building.updated (v1)

```json
{
  "event": "building.updated",
  "version": 1,
  "payload": {
    "buildingId": "uuid",
    "level": 2,
    "status": "IDLE",
    "upgradeCost": {
      "wood": 120,
      "stone": 80,
      "gold": 40
    }
  }
}
```

Emitted to the city owner only, after Game Loop completes the upgrade.

Future events (`resources.updated`, `army.updated`, `territory.captured`) follow the same `event` + `version` + `payload` shape.

---

# 17. Future Extensions

Reserved for:

- localization;
- API key authentication;
- GraphQL gateway;
- gRPC services;
- public developer API.
