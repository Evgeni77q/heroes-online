# Sprint-007 — Phase 7: Living World (First MMO Differentiator)

## Goal
Integrate the first “Living World” loop:
world map + army movement + territory ownership + resource extraction.

## User Capabilities (Player-visible)
- Open world map.
- See territories and world state.
- Dispatch/trigger army movement.
- Ownership and resource flow affect city growth outcomes.

## Technical Tasks
### 1) World Map — data-driven rendering
- Render world map tiles/markers based on backend world state.
- Ensure hero/army markers map to correct world coordinates.

### 2) Army Movement + Simulation Integration
- Connect movement dispatch to backend simulation.
- Validate state transitions: moving → arriving → engaging/claiming (as far as Phase 7 scope allows).

### 3) Territory Ownership
- Territory ownership updates must persist and be reflected in:
  - world map visuals
  - city resource effects (at least one resource pipeline).

### 4) Resource Extraction from World
- Ensure resource nodes tied to owned territories produce resources and affect city economy.

### 5) Smoke + Regression verification
- Confirm city scene still works (no regressions to constructor/placements).

## Risks
- World coordinate systems may diverge from city coordinates (ownership mapping bugs).
- Simulation correctness issues can cause “no visible change” loops.
- Performance issues on world map rendering.

## Definition of Done (Completion Criteria)
- World integration loop is functional end-to-end:
  - army movement changes world state
  - territory ownership persists
  - city resources reflect owned territories

## Outcome
- Phase 7 makes the project a true MMO-like platform, not a city-only builder.

## Archive Rule
After Sprint completion, this file becomes an archive (keep history, do not edit).

