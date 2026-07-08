# Project Master Context (single source of truth)

This file is the canonical entrypoint for any new chat/agent.

## What we’re building
Heroes Online — an MMO city constructor with:
- Persistent player-owned layout (plots/buildings saved in DB)
- A visual “Lego kit” composition system for large buildings (castle, barracks)
- Phase 8 UX polish (overlays, focus, premium pass)

## Project Principles
1. Never clone Heroes at War.
2. Every system must improve upon the genre standard.
3. Backend is the single source of truth.
4. Frontend is fully data-driven.
5. Every building is modular.
6. Every visual upgrade should be reflected in gameplay.
7. No placeholder architecture.
8. Premium quality over development speed.
9. Every feature must be production-ready.
10. Code must be maintainable for 5+ years.

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
Composite fallback is shown in view mode until all required structural part assets are ready.
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
2. In the capital-city code, we prefer local image assets under `frontend/public/assets/...` (currently PNG, but formats may change).
3. AI generation is not the primary path for city visuals unless the pipeline explicitly allows it.

## Local asset locations (city)
All capital-city art must live under `frontend/public/assets/city/...`.

Important: code and compositions depend on **part ids** (domain entities), not on image filenames.
The underlying formats may change later (`.png` → `.webp`/`.avif`/3D), without changing part ids.

### Castle (part ids used by the Lego-kit)
Structural (composite fallback gate):
- `main_keep`
- `gate`
- `watch_tower`
- `wall_straight`
- `wall_corner`

Other layered parts:
- `bridge`
- `inner_courtyard`
- `main_stairs`
- `banner`
- `flagpole`
- `torch_gate` / `torch_tower` / `torch_keep`
- `fountain`

### Barracks (part ids used by the Lego-kit)
- `main_building` (tier-specific art for the main architecture)
- `gate`
- planned: `training_dummy`, `weapon_rack`, `torch`, `fence`, `banner`

### Ground
- until `grass` raster art ships, the scene can use SVG fallback: `grass.svg`

## Asset resolver (what to change when adding new city assets)
All city asset URL building is centralized in:
- `frontend/src/features/capital-city/config/city-assets.config.ts`

When you add/rename an asset file (format may be PNG/WEBP/AVIF):
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
- `main_building`
  ↓
- `training_dummy`
  ↓
- `weapon_rack`
  ↓
- `banner`
  ↓
- `torch`
  ↓
- `fence`
  ↓
- `gate`

When the later shared props exist, add their ids to:
- `BARRACKS_SHARED_PART_FILES`
- `BARRACKS_LV10_PARTS` (or a future lv-specific composition)

## Debug checklist for `/city`
1. Open `http://localhost:3000/city`
2. Verify the castle appears correctly:
   - If castle looks “fragmented”, composite fallback isn’t gating correctly → check `CASTLE_REQUIRED_PART_IDS` vs shipped structural assets.
3. Verify barracks appears:
   - Main should render from `main_building` via the asset resolver.
   - Shared props only layer after being wired into the composition and resolver.

---

## Current Development State

### Backend
- ✅ Authentication
- ✅ Dashboard
- ✅ City Constructor
- ✅ Persistent Building Layout (placements saved in DB)
- ✅ Coordinate API (plots/field from `backend/src/capital-city/build-field.config.ts`)

### Frontend
- ✅ City Scene (`frontend/src/features/capital-city/components/city-scene.tsx`)
- ✅ Composition Renderer (parts + composite fallback)
- ✅ Asset Resolver (`frontend/src/features/capital-city/config/city-assets.config.ts`)
- ✅ Composite Fallback gating rule (`compositionUsesCompositeFallback()` + `CASTLE_REQUIRED_PART_IDS`)

### Assets (status by Lego-kit part ids)

Castle (`castle` Lego kit)
- ✅ composite fallback sprite (building-level `castle/lvl01`)
- ✅ `main_keep`
- ⏳ `gate`
- ⏳ `watch_tower`
- ⏳ `wall_straight`
- ⏳ `wall_corner`
- ✅ `bridge`
- ✅ `inner_courtyard`
- ✅ `main_stairs`
- ✅ `banner`
- ✅ `flagpole`
- ✅ `torch_gate` / `torch_tower` / `torch_keep`
- ✅ `fountain` *(only appears if the composition includes it)*

Barracks (`barracks` Lego kit)
- ✅ `main_building` (tier 10 art shipped)
- ✅ `gate`
- ⏳ `training_dummy`
- ⏳ `weapon_rack`
- ⏳ `banner` (shared prop chain)
- ⏳ `torch`
- ⏳ `fence`

### Gameplay
- ✅ Login
- ✅ Player Creation
- ✅ Persistent City
- ✅ City Scene
- ✅ Building Composition
- ⏳ Building Upgrade
- ⏳ Resource Production
- ⏳ Construction Queue
- ⏳ WebSocket Updates
- ⏳ Army
- ⏳ Map
- ⏳ Combat

---

## Current Sprint

Goal
Finish modular capital city based on Lego composition.

Deliverables
- ✅ Castle composition
- ✅ Barracks composition
- ⏳ Shared Props
- ⏳ Asset Resolver
- ⏳ Final Layering

Definition of Done
All buildings render without composite fallback when structural assets are available.

Current Sprint:
**Phase 5 — Modular Capital City**

---

## Architecture Rules
- Backend owns all coordinates (plots, castle position/scale).
- Frontend never remaps coordinates.
- All asset URLs are resolved only through `frontend/src/features/capital-city/config/city-assets.config.ts`.
- Building compositions use part ids only (no filename dependencies).
- No hardcoded asset paths outside the Asset Resolver.
- Composite fallback is temporary and is removed automatically when required structural part ids have shipped assets.

---

## Next Planned Phase

### Phase 6 — Interactive Capital City
- Building Selection
- Building Info Panel
- Upgrade Button
- Construction Timer
- Queue Visualization
- Resource Updates

### Phase 7 — World Map
- World Navigation
- Tile Ownership
- Army Movement
- Capture

### Phase 8 — UX Polish
- Overlays
- Camera
- Focus
- Premium Effects


