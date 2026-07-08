# Project Master Context (single source of truth)

This file is the canonical entrypoint for any new chat/agent.

## What we’re building
Heroes Online — an MMO city constructor with:
- Persistent player-owned layout (plots/buildings saved in DB)
- A visual “Lego kit” composition system for large buildings (castle, barracks)
- Phase 8 UX polish (overlays, focus, premium pass)

## Run the game locally
Frontend (Next.js): `http://localhost:3000/city`
- Start: `cd frontend && npm run dev`
- Port may change if `3000` is busy.

Backend (NestJS): `http://localhost:8080`
- Start: `cd backend && npm run start:dev`
- Health: `GET /api/health` is versioned under `api` prefix exclusions; use the browser/app pages after login.

## Coordinate source of truth (IMPORTANT)
For the capital city scene, the *only* coordinate system is authored in the backend:
- `backend/src/capital-city/build-field.config.ts`

The frontend scene must render using the field coordinates it receives from the constructor API.
There must be **no frontend remap/hardcoded castle placement offsets**.

## Capital City visual architecture

### 1) Scene
Frontend renderer:
- `frontend/src/features/capital-city/components/city-scene.tsx`

### 2) Building composition system (Lego-kit)
Core types:
- `frontend/src/features/capital-city/composition/types.ts`

Renderer:
- `frontend/src/features/capital-city/composition/composed-building.tsx`
- `frontend/src/features/capital-city/composition/composition-part.tsx`

Castle lv1 parts layout:
- `frontend/src/features/capital-city/composition/castle-lv1.composition.ts`

Barracks lv10 parts layout:
- `frontend/src/features/capital-city/composition/barracks-lv10.composition.ts`

### Composite fallback rule (IMPORTANT)
Composite fallback is shown in view mode until all required structural part PNGs are ready.
Logic:
- `compositionUsesCompositeFallback()` in `composition/types.ts`

Required structural ids for the castle:
- `CASTLE_REQUIRED_PART_IDS` in `frontend/src/features/capital-city/config/city-assets.config.ts`

### Layering
Each composition part is positioned absolutely in the composition footprint and layered by `zIndex`.

## Asset pipeline rules (Phase alignment)
Use the documented visual production pipeline:
- `docs/00_Project/18_Visual_Production_Pipeline.md`

Rule of thumb:
1. Visual Bible (stages 1–4) must be signed before Stage 5 premium asset generation.
2. In the capital-city code, we prefer local PNGs under `frontend/public/assets/...`.
3. AI generation is not the primary path for city visuals unless the pipeline explicitly allows it.

## Local asset locations (city)
All art referenced by the capital-city system must live under `frontend/public/assets/city/...`

### Castle
- Composite fallback:
  - `frontend/public/assets/city/buildings/castle/lvl01.png`
- Shared Lego parts:
  - `frontend/public/assets/city/buildings/castle/shared/*.png`

### Barracks
- Tier-specific main building (currently lv10 art):
  - `frontend/public/assets/city/buildings/barracks/lvl10/barracks_lvl10_main.png`
- Shared props:
  - `frontend/public/assets/city/buildings/barracks/shared/*.png`

### Ground
- Until `grass.png` ships, the scene can use SVG fallback:
  - `frontend/public/assets/city/ground/grass.svg`

## Asset resolver (what to change when adding new PNGs)
All city asset URL building is centralized in:
- `frontend/src/features/capital-city/config/city-assets.config.ts`

When you add/rename a PNG:
1. Add/adjust the corresponding entry in the relevant `*_SHARED_PART_FILES`
2. If it’s structural for the Lego kit, add its id to `*_REQUIRED_PART_IDS`
3. If it’s a part that should appear in a specific composition, ensure the composition contains that part id.

## Current modular intent (product roadmap)
### Castle
Planned modules (implemented as separate part ids):
- gate, walls, watch tower (structural)
- main stairs (link between inner courtyard and keep entrance)
- torches (reusable later across buildings)
- flagpole (separate from cloth; cloth will be a later layer)

### Barracks
Planned Lego kit chain:
- `barracks_lvl10_main.png`
  ↓
- `barracks_training_dummy.png`
  ↓
- `barracks_weapon_rack.png`
  ↓
- `barracks_banner.png`
  ↓
- `barracks_torch.png`
  ↓
- `barracks_fence.png`
  ↓
- `barracks_gate.png`

When the later shared props exist, add their ids to:
- `BARRACKS_SHARED_PART_FILES`
- `BARRACKS_LV10_PARTS` (or a future lv-specific composition)

## Debug checklist for `/city`
1. Open `http://localhost:3000/city`
2. Verify the castle appears correctly:
   - If castle looks “fragmented”, composite fallback isn’t gating correctly → check `CASTLE_REQUIRED_PART_IDS` vs shipped PNGs.
3. Verify barracks appears:
   - Main should render from `barracks_lvl10/barracks_lvl10_main.png`
   - Shared props only layer after being wired into the composition and resolver.

