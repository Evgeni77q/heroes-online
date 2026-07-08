# Sprint-006 — Phase 6: Interactive City (First Gameplay Cycle)

## Goal
Turn the capital city scene into the first playable loop:
player upgrades a building and observes timer + realtime + visual change.

## Sprint Metrics (mandatory)
| Метрика | Значение |
|---|---|
| Goal | Interactive City: first end-to-end upgrade cycle (request → queue → timer → completion → visual + production impact) |
| User Capabilities | player selects building, views info, clicks Upgrade, sees queue + timer, waits, sees level increase + visual update + realtime-driven production impact |
| Definition of Done | At least one primary building type supports full upgrade cycle end-to-end with server completion + realtime UI update + visible composition change |
| Out of Scope | no world map; no new building categories beyond one primary; no UX redesign; no MMO social features; no balance rework |
| Risks | backend level caps; missing level-differentiated art; realtime event mismatch breaks timer/completion chain |
| Technical Debt (accepted) | if full visual level swap art is missing, use deterministic visual proxy (no fallback hacks) |
| Demo Scenario | open `/city` → select primary building → view info → click Upgrade → observe queue + timer → wait for completion → confirm level increased + appearance changed → confirm production stat change |

## User Capabilities (Player-visible)
- Open `/city`.
- Select a building.
- View building information.
- Press `Upgrade`.
- See upgrade queue + construction timer.
- Watch realtime updates while waiting.
- After completion:
  - building level increases
  - building model/appearance updates
  - production/economy impact becomes visible (at least for one primary stat).

## Technical Tasks
### 1) Building Selection + Info
- Ensure building overlay tabs show correct data for the selected placement.

### 2) Upgrade Request → Queue Creation
- Wire `Upgrade` UI to backend building upgrade endpoint (server enqueues construction).
- Ensure queue state is returned and displayed consistently.

### 3) Timer + Realtime Updates
- Ensure WebSocket events push:
  - queue progress changes
  - building completion
- UI updates without reload.

### 4) Visual Update after Completion
- After upgrade completion:
  - composition changes must reflect the new level (or a deterministic visible state proxy)
  - layering remains correct

### 5) Definition of Done integration
- Update only sprint-relevant docs; do not change SSOT unless architecture/vision changes.

## Risks
- Backend level caps may block meaningful upgrades (ensure chosen building type fits caps).
- Missing level-differentiated art can make visual changes hard to verify.
- Realtime event mismatch can break the “timer → completion → UI update” chain.

## Out of Scope
- No introduction of new systems beyond wiring the existing upgrade/queue/realtime loop.

## Technical Debt (accepted)
- Only one primary building type is required for DoD (others may remain stubbed for this sprint).

## Demo Scenario
1. Open `/city`.
2. Select the primary building (e.g. Barracks).
3. View its info.
4. Click `Upgrade`.
5. Confirm queue + timer appear.
6. Wait until completion triggers.
7. Confirm:
   - level increased
   - building appearance updated
   - production stat increased (at least one primary stat).

## Definition of Done (Completion Criteria)
- At least one primary building type (e.g. Barracks) supports the full upgrade cycle end-to-end:
  - request → queue → timer → completion → realtime UI update → visible model change → measurable production impact.

## Outcome
- Phase 6 becomes “first playable kernel” instead of a scene demo.

## Archive Rule
After Sprint completion, this file becomes an archive (keep history, do not edit).

