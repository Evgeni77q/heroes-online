# Sprint-005 — Phase 5: Modular Capital City

## Goal
Get the capital city to **production quality** as a modern RTS-like scene using the **Lego composition system**.
No new gameplay mechanics. Focus on visual correctness + composition readiness.

## Sprint Metrics (mandatory)
| Метрика | Значение |
|---|---|
| Goal | Production-ready modular capital city (Phase 5) |
| User Capabilities | `/city` renders consistently; castle + barracks appear as modular Lego kits; edit mode baseline persistence |
| Definition of Done | `/city` view mode uses Lego composition parts (no scene hacks); composite fallback is OFF when structural assets are available; layering correct in view + edit blueprint overlay |
| Out of Scope | No new gameplay mechanics; no economy/balance changes; no new city systems (selection/info/upgrade timers); no coordinate remaps; no social/army/map work |
| Risks | missing assets → fragmented fallback; z-index layering regressions; level cap mismatches; coordinate hacks reintroduced |
| Technical Debt (accepted) | Some non-structural props may still be “stubbed” until their part ids are wired; level-specific art may be limited (e.g. barracks main tier only) |
| Demo Scenario | Open `/city` → verify castle renders modularly → verify barracks renders modularly → switch to edit mode blueprint (show placeholders) → verify z-order/overlaps → visually confirm no hardcoded castle offset artifacts |

## User Capabilities (Player-visible)
- Open `/city` and see a consistent capital city scene.
- Castle renders as a **modular Lego kit** (parts + correct layering).
- Barracks renders as a **modular Lego kit** (main + wired shared props).
- Edit mode still supports scenic placement (baseline persistence).

## Technical Tasks
### 1) Castle — complete structural part wiring
- Ensure castle composition includes and renders at least these structural part ids:
  - `gate`, `watch_tower`, `wall_straight`, `wall_corner`, `main_stairs`
- Ensure `Composite fallback` gating behaves correctly:
  - Structural parts must disable composite fallback when their required assets are available.
- Ensure layering (`zIndex`) is correct for:
  - bridge / inner_courtyard / main_keep / banner / flagpole / torches / stairs

### 2) Barracks — complete modular part chain
- Ensure barracks composition shows:
  - `main_building` + `training_dummy` + `weapon_rack` + `banner` + `torch` + `fence` + `gate`
- Remove any duplicate overlays (no double gate).

### 3) Shared Props — reuse without PNG duplication
- Move reusable props to shared part ids in `city-assets.config.ts`:
  - `torch`, `banner`, `flagpole`, `fence`, and initial “prop set” (when they exist)
- Ensure Castle and Barracks use the same shared ids (no separate castle/barracks copies).

### 4) Asset Resolver — single source of URLs
- All city visuals must be resolved only through:
  - `frontend/src/features/capital-city/config/city-assets.config.ts`
- Ensure part ids map to local assets under `frontend/public/assets/city/...`.

### 5) No coordinate hacks
- Confirm frontend renders only from constructor field coordinates:
  - no `remapPlotForReference()` and no hardcoded castle offsets in the scene layer.

## Risks
- Missing assets can cause:
  - accidental fragmented views (wrong fallback gating).
- Layering regressions (zIndex ordering issues).
- Level cap mismatches (backend max level vs asset resolver level).
- “Hardcoded coordinate fixes” creeping back in.

## Out of Scope
- No new building mechanics (upgrade/recruit/construction timers belong to Phase 6).
- No new backend systems—only finish what already exists for city scene correctness.

## Definition of Done (Completion Criteria)
- `/city` view mode renders:
  - Castle and Barracks using Lego composition parts.
- Structural assets available → no composite fallback for that composition.
- z-index + overlaps look correct in both:
  - view mode and edit mode blueprint overlay.
- Adding a new modular building requires:
  - new composition layout (part ids) + resolver entries only
  - no hardcoded asset paths and no scene hacks.

## Outcome
- Production-ready Phase 5 capital city scene (visual correctness + composition extensibility).
- Verified modular base to start Phase 6 interactive upgrade flow quickly.

## Archive Rule
After Sprint completion, this file becomes an archive (keep history, do not edit).

