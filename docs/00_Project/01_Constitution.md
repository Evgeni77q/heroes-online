# Heroes Online

**Document:** 01_Constitution.md  
**Location:** docs/00_Project/01_Constitution.md

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Approved |
| Author | Project Technical Director (ChatGPT) |
| Product Owner | Evgeniy Pugachev |
| Created | 2026-07-03 |
| Last Updated | 2026-07-03 |

---

# Constitution

## Purpose

The Constitution is the highest-level engineering document of the Heroes Online project.

Its purpose is to define immutable engineering, architectural, gameplay, and development principles that govern every subsystem of the game.

Every document, specification, source file, database schema, API endpoint, deployment pipeline, and gameplay mechanic must comply with this Constitution.

If any lower-level document conflicts with this Constitution, the Constitution takes precedence unless superseded through an approved Architecture Decision Record (ADR).

---

# Project Goals

Heroes Online is designed to become a long-term browser MMO strategy platform.

The project prioritizes:

- maintainability;
- scalability;
- security;
- correctness;
- extensibility;
- deterministic game logic;
- fair competitive gameplay.

The architecture must support continuous development for many years without requiring a complete rewrite.

---

# Core Values

Every engineering decision shall be evaluated against the following values.

## 1. Player Trust

The integrity of gameplay is more important than development speed or monetization.

Players must be confident that the rules are transparent, consistent, and fairly enforced.

---

## 2. Correctness

A correct implementation is always preferred over a fast implementation.

Temporary fixes are acceptable only when documented and scheduled for removal.

---

## 3. Simplicity

Whenever multiple solutions satisfy the same requirements, the simplest maintainable solution should be selected.

Complexity must always have a measurable justification.

---

## 4. Consistency

Identical problems must be solved using identical patterns.

Duplicate architectural approaches are prohibited unless explicitly justified.

---

## 5. Maintainability

Every subsystem must remain understandable by developers who did not originally create it.

Readable code is considered a functional requirement.

---

## 6. Scalability

Every system shall be designed assuming future growth in:

- players;
- game worlds;
- concurrent sessions;
- gameplay mechanics;
- infrastructure.

Local optimizations that compromise scalability are prohibited.

---

## 7. Documentation

Documentation is part of the product.

Code without documentation is considered incomplete.

Documentation must evolve together with implementation.

---

# Governance

## Decision Authority

Project decisions are divided into two domains.

### Product Owner

Responsible for:

- gameplay vision;
- priorities;
- milestones;
- product acceptance;
- player experience.

---

### Technical Director

Responsible for:

- software architecture;
- infrastructure;
- engineering standards;
- technology stack;
- scalability;
- database architecture;
- API design;
- security.

---

Neither role may override the responsibilities of the other without formal approval.

---

# Project Hierarchy

All project artifacts follow the hierarchy below.

1. Constitution
2. Architecture Decision Records
3. Domain Model
4. Technical Specifications
5. Game Design Specifications
6. Database Specifications
7. API Specifications
8. Source Code
9. Operational Documentation

Each lower level must remain consistent with higher levels.

---

# Engineering Philosophy

Heroes Online follows the principle:

> Design first.
> Implement second.
> Optimize third.

Premature optimization is prohibited.

Engineering decisions must be based on measurable requirements rather than assumptions.

---

# Architectural Principles

## Server Authority

The server is the only authoritative source of game state.

Clients are presentation layers only.

Clients may request actions.

Only the server validates, executes, and persists game logic.

Clients never determine:

- combat outcomes;
- resource generation;
- construction completion;
- research completion;
- inventory changes;
- economy calculations.

Any client-side calculation exists solely to improve user experience and must never affect authoritative game state.

---

## Deterministic Logic

Identical input must always produce identical output.

Randomness must originate exclusively from trusted server-side systems.

Whenever possible, deterministic algorithms shall be preferred over probabilistic behaviour.

---

## Data Driven Design

Gameplay values must be stored as configuration rather than source code.

Examples include:

- building costs;
- production rates;
- unit statistics;
- technology bonuses;
- construction durations;
- combat modifiers;
- event parameters.

Changing gameplay balance must not require recompiling the application.

---

## Configuration over Hardcoding

Magic numbers are prohibited.

All configurable values shall exist within structured configuration sources.

Business logic must reference configuration rather than literal values.

Incorrect:

```
wood += 30
```

Correct:

```
ResourceConfig.Wood.BaseProduction
```

or

```
config.resources.wood.baseProduction
```

---

## Domain Driven Design

Business concepts define software architecture.

The codebase must reflect gameplay concepts rather than technical implementation details.

Examples:

- Player
- Empire
- City
- Building
- Research
- Army
- Battle
- Alliance
- Hero
- Quest

These concepts form the project's ubiquitous language.

---

## Modular Architecture

The system shall be divided into independent modules.

Each module must:

- have a single responsibility;
- expose a well-defined public interface;
- minimize dependencies on other modules;
- remain independently testable.

Modules communicate only through approved interfaces.

Direct access to internal implementation details of another module is prohibited.

---

## Separation of Concerns

Every layer has exactly one responsibility.

**Presentation Layer**

- User Interface
- Rendering
- Input handling

**Application Layer**

- Commands
- Queries
- Workflow orchestration

**Domain Layer**

- Business rules
- Game logic
- Validation
- Domain services

**Infrastructure Layer**

- Database
- Cache
- File Storage
- External Services
- Message Queue

Responsibilities shall never be mixed.

---

## SOLID Principles

The backend architecture follows SOLID principles.

**Single Responsibility**

Every class has one reason to change.

**Open / Closed**

Systems should be extended through composition rather than modification.

**Liskov Substitution**

Derived implementations must remain compatible with their abstractions.

**Interface Segregation**

Small interfaces are preferred over large generic interfaces.

**Dependency Inversion**

Business logic depends on abstractions rather than implementations.

---

## Event Driven Architecture

Important gameplay events are represented as domain events.

Examples:

- BuildingStarted
- BuildingCompleted
- ResearchFinished
- ArmyReturned
- BattleResolved
- HeroLeveledUp
- ResourceProduced

Events allow systems to evolve independently without creating unnecessary coupling.

---

## Asynchronous Processing

Operations requiring time must never block request processing.

Examples:

- construction;
- research;
- troop training;
- long-running calculations;
- report generation;
- notifications.

Background workers execute deferred tasks.

---

## Time as a First-Class Concept

Time is a core gameplay mechanic.

Every delayed action is represented by:

- creation time;
- start time;
- completion time;
- current state.

No delayed gameplay feature may depend on client-side timers.

---

## Security by Design

Security is designed into every subsystem.

Mandatory requirements:

- server validation;
- authentication;
- authorization;
- input validation;
- rate limiting;
- secure password hashing;
- encrypted communication;
- audit logging.

Client trust is prohibited.

---

## Performance by Design

Performance is considered during design rather than after implementation.

Every gameplay feature should define:

- expected execution time;
- expected database load;
- expected cache usage;
- scalability expectations.

Performance regressions are treated as defects.

---

# Development Principles

## Documentation First

Every significant feature begins with documentation.

Implementation without an approved specification is prohibited.

---

## Testability

Every module must be testable independently.

Testing strategy includes:

- unit tests;
- integration tests;
- API tests;
- end-to-end tests.

Business logic must never depend on user interface code.

---

## Observability

Every production system must support:

- structured logging;
- metrics;
- tracing;
- health checks.

Operational visibility is considered a functional requirement.

---

## Error Handling

Unexpected failures shall produce:

- useful logs;
- meaningful error messages;
- safe rollback where appropriate.

Silent failures are prohibited.

---

## Logging

Logs must answer:

- What happened?
- When did it happen?
- Who initiated it?
- Which subsystem handled it?
- What was the outcome?

Sensitive information must never appear in logs.

---

## Version Control

Git is the authoritative history of the project.

Direct modification of production history is prohibited.

Every meaningful change shall be committed with a descriptive message.

History must remain understandable years later.

---

## Branch Strategy

The project follows a simplified Git workflow.

**Main**

Stable production-ready branch.

**Develop**

Primary development branch.

**Feature branches**

Created from Develop.

Merged only after review.

**Emergency fixes**

Applied through dedicated hotfix branches.

---

## Code Review

Every non-trivial change should be reviewed before merging.

Review evaluates:

- correctness;
- readability;
- architecture;
- security;
- performance;
- consistency with documentation.

Approval requires all critical comments to be resolved.

---

## Coding Standards

Coding conventions are mandatory.

The project maintains a single coding standard for:

- TypeScript;
- SQL;
- Markdown;
- configuration files.

Personal coding styles shall not override project standards.

---

# Game Design Principles

The following principles are mandatory for every gameplay system.

Every mechanic introduced into Heroes Online shall comply with these rules.

---

## Strategy First

Strategic thinking must always provide greater long-term advantage than rapid interaction or constant online presence.

Players should win primarily through planning, preparation, coordination and intelligent decision making.

Gameplay must reward knowledge and foresight.

---

## Meaningful Choices

Every important decision should involve advantages and disadvantages.

There should rarely exist one universally optimal strategy.

Examples:

- economic growth versus military expansion;
- offense versus defense;
- short-term profit versus long-term investment;
- individual progression versus alliance contribution.

---

## Long-Term Progression

Player progression is designed around months and years rather than days.

Progress must remain meaningful at every stage of the game.

Late-game content must extend progression instead of invalidating previous investments.

---

## Fair Competition

Heroes Online is designed around competitive integrity.

Victory should result from:

- planning;
- coordination;
- diplomacy;
- adaptation;
- execution.

Never from unfair mechanical advantages.

---

## No Pay-to-Win

Monetization shall never sell direct competitive power.

Acceptable purchases include:

- cosmetics;
- visual customization;
- convenience features;
- account services.

Gameplay balance must remain independent from spending.

---

## Risk versus Reward

Higher rewards require higher risk.

Examples:

- expensive expeditions;
- long-distance attacks;
- rare resources;
- dangerous world events.

Low-risk activities must never outperform high-risk alternatives over time.

---

## Social Gameplay

The game is designed as a multiplayer experience.

Players should naturally benefit from cooperation.

Alliance mechanics must encourage:

- communication;
- coordination;
- specialization;
- diplomacy;
- shared objectives.

---

## Persistent World

The game world continues to evolve continuously.

Construction, research, production and military movement continue regardless of player presence.

Time never pauses.

---

## Accessibility

The game should be easy to understand but difficult to master.

Early systems introduce mechanics gradually.

Advanced optimization emerges naturally through experience.

---

## Expandability

New gameplay systems must integrate with existing architecture.

Expansion should occur through composition rather than replacing existing mechanics.

Future features must not require redesign of the core engine.

---

# Quality Standards

Quality is a functional requirement.

A feature is incomplete until it satisfies all applicable quality requirements.

---

## Maintainability

Code should be understandable by developers unfamiliar with the original implementation.

Readability is preferred over cleverness.

---

## Reliability

Gameplay must behave predictably.

Unexpected behavior is considered a defect.

Critical gameplay systems must fail safely whenever possible.

---

## Scalability

The architecture must support future growth without redesign.

Growth includes:

- players;
- worlds;
- alliances;
- gameplay systems;
- infrastructure.

---

## Security

Every feature must consider:

- authentication;
- authorization;
- validation;
- abuse prevention;
- auditability.

Security reviews are mandatory for sensitive systems.

---

## Performance

Performance targets should be measurable.

Optimization efforts should be based on profiling rather than assumptions.

Premature optimization is prohibited.

---

## Consistency

Gameplay behavior must remain internally consistent.

Identical rules should produce identical outcomes.

Similar mechanics should follow similar interaction patterns.

---

## Backward Compatibility

When introducing changes, migration strategies must be considered.

Existing player data must remain valid unless a documented migration explicitly states otherwise.

---

## Documentation Quality

Documentation shall be:

- complete;
- current;
- technically accurate;
- implementation-oriented.

Outdated documentation is treated as a project defect.

---

## Automation

Whenever practical, repetitive tasks should be automated.

Examples include:

- testing;
- formatting;
- static analysis;
- documentation publishing;
- deployment.

Automation reduces human error and increases project reliability.

---

# Definition of Done

A feature is considered complete only when all applicable requirements below are satisfied.

## Documentation

- Specification is approved.
- Documentation matches implementation.
- Public interfaces are documented.
- Changelog is updated if required.

---

## Backend

- Business logic implemented.
- Validation completed.
- Error handling implemented.
- Logging added.
- Configuration externalized.

---

## Database

- Schema updated.
- Migrations created.
- Indexes reviewed.
- Constraints validated.

---

## API

- Endpoints documented.
- Request validation implemented.
- Response contracts defined.
- Error responses standardized.

---

## Frontend

- UI implemented.
- Responsive behavior verified.
- Loading states implemented.
- Error states implemented.
- Accessibility reviewed.

---

## Testing

The feature includes appropriate automated tests.

Where applicable:

- Unit Tests
- Integration Tests
- API Tests
- End-to-End Tests

Critical gameplay logic should always be covered by automated tests.

---

## Performance

Performance expectations have been verified.

No obvious bottlenecks remain.

---

## Security

Security review completed where applicable.

Input validation is present.

Authorization rules verified.

Sensitive operations logged.

---

## Review

The implementation has been reviewed for:

- correctness;
- architecture;
- readability;
- maintainability;
- consistency.

---

# Change Management

Heroes Online evolves continuously.

Changes must remain controlled and traceable.

---

## Architecture Decision Records

Significant architectural changes require an ADR.

Each ADR must contain:

- context;
- problem statement;
- considered alternatives;
- chosen solution;
- consequences.

ADR documents become part of the permanent project history.

---

## Versioning

Every project document shall maintain semantic version history.

**Major version**

Breaking conceptual changes.

**Minor version**

New requirements or substantial additions.

**Patch version**

Corrections, clarifications, editorial improvements.

---

## Changelog

Important project changes must be recorded.

Every entry should include:

- date;
- affected subsystem;
- summary;
- related ADR (if applicable).

---

## Deprecation

Deprecated functionality shall not be removed immediately.

The project should define:

- deprecation notice;
- migration strategy;
- removal schedule.

---

# Non-Negotiable Rules

The following rules are absolute.

They may only be changed through a formally approved ADR.

1. The server is always authoritative.
2. Gameplay logic belongs on the server.
3. Business logic is configuration-driven whenever practical.
4. Documentation is part of the product.
5. Code without tests is incomplete for critical systems.
6. Security is mandatory.
7. Maintainability has higher priority than shortcuts.
8. Every significant architectural decision is documented.
9. The project follows Domain Driven Design.
10. Every gameplay system must support future expansion.

---

# Compliance

Every new subsystem introduced into Heroes Online shall be reviewed against this Constitution.

If implementation conflicts with the Constitution, the implementation must be changed unless the Constitution itself is amended through an approved ADR.

---

# Approval

This Constitution establishes the mandatory engineering, architecture, and development standards for Heroes Online.

All future documentation, source code, infrastructure, database schemas, APIs, and gameplay systems shall comply with this document.

---

**End of Document**
