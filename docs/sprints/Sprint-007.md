# Sprint-007 — Phase 7: Living World (First MMO Differentiator)

## Goal
Integrate the first “Living World” loop:
world map + army movement + territory ownership + resource extraction.

## Sprint Metrics (mandatory)
| Метрика | Значение |
|---|---|
| Goal | Living World: end-to-end world integration loop (world map + army movement + territory ownership + resource extraction) |
| User Capabilities | open world map, see territories + state, dispatch army movement, observe ownership + city growth outcomes via resource effects |
| Definition of Done | army movement changes world state; territory ownership persists; city resources reflect owned territories |
| Out of Scope | full combat system polish; PvP; diplomacy/alliance; large-scale performance optimizations beyond smoke checks |
| Risks | coordinate mapping divergence; simulation correctness “no visible change”; world map render performance issues |
| Technical Debt (accepted) | simplified engagement/claiming logic if Phase 7 scope allows; first version prioritizes persistence + visible UI |
| Demo Scenario | open world map → select/observe territory → dispatch army movement → wait until arrival → confirm ownership state change persists → confirm city resource production reflects owned territory |

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

## Out of Scope
- No social systems (alliances/diplomacy/trade/PvP).
- No combat PvE balance work beyond what is required for state transitions in Phase 7 scope.

## Technical Debt (accepted)
- If some advanced visuals are missing, prioritize functional persistence + UI state correctness over visual polish.

## Demo Scenario
1. Open the world map.
2. Identify at least one territory node/marker.
3. Dispatch army movement toward it.
4. Observe the world state update when the army arrives.
5. Verify ownership flips/persists.
6. Verify the city side reflects at least one resource production change driven by ownership.

## Definition of Done (Completion Criteria)
- World integration loop is functional end-to-end:
  - army movement changes world state
  - territory ownership persists
  - city resources reflect owned territories

## Outcome
- Phase 7 makes the project a true MMO-like platform, not a city-only builder.

## Archive Rule
After Sprint completion, this file becomes an archive (keep history, do not edit).

