# Sprint-006 — Phase 6: Interactive City (First Gameplay Cycle)

## Goal
Turn the capital city scene into the first playable loop:
player upgrades a building and observes timer + realtime + visual change.

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

## Definition of Done (Completion Criteria)
- At least one primary building type (e.g. Barracks) supports the full upgrade cycle end-to-end:
  - request → queue → timer → completion → realtime UI update → visible model change → measurable production impact.

## Outcome
- Phase 6 becomes “first playable kernel” instead of a scene demo.

## Archive Rule
After Sprint completion, this file becomes an archive (keep history, do not edit).

