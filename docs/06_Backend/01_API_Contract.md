# API Contract

**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-03

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

# 15. Future Extensions

Reserved for:

- localization;
- API key authentication;
- GraphQL gateway;
- gRPC services;
- public developer API.
