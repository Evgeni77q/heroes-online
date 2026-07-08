# Project Constitution v2 (Non‑Negotiable Development Convention)

This document is the **highest-level convention** of Heroes Online.
Any deviation from these rules is allowed **only** as a conscious architectural decision, documented as an ADR (or equivalent short note) in the repository.

## I. Product Vision
1. Heroes Online is not a clone.
2. Heroes Online is a next‑generation browser MMO strategy platform.
3. Every new feature must improve the genre standard rather than imitate it.

## II. Technical Principles
1. Backend owns game state.
2. Frontend renders state (data-driven UI).
3. No duplicated business logic across systems.
4. No hardcoded coordinates or scene remaps in the frontend.
5. Building compositions use **part ids** (domain entities), not image filenames.
6. No business logic inside React components. Components orchestrate rendering and user input only.
7. Everything must be reproducible: the same input should produce the same output for the same state.
8. Asset resolution must be centralized in the corresponding asset resolver config (no ad-hoc asset URL building).

## III. Gameplay Principles
1. Every upgrade has gameplay value.
2. Every gameplay system has visual feedback.
3. Every visual improvement has gameplay meaning.
4. No dead buildings: if it exists, it must be usable in gameplay.
5. No decorative-only upgrades unless explicitly marked as cosmetic (and excluded from balance/gameplay value).

## IV. Art Principles
1. Every building is modular.
2. Every module is reusable across buildings.
3. Part ids are stable domain entities (PNG/WebP/AVIF/3D are implementation details).
4. Composition defines the final appearance by stacking modular parts.
5. Assets are implementation details: **PNGs never define gameplay**.

## V. UX Principles
1. No page reloads for gameplay state changes.
2. Everything updates in real time (or via a clear deterministic update strategy).
3. Animations must communicate state.
4. Every action has immediate feedback.
5. Latency should be hidden whenever possible (optimistic UI when safe).

## VI. Engineering Principles
1. Small pull requests: each PR delivers **exactly one finished user capability** (one end-to-end player-visible ability).
2. No TODOs in production paths.
3. No commented dead code.
4. Documentation must be updated with every architectural change.
5. Every feature must include a Definition of Done (DoD).
6. Code must remain maintainable for 5+ years.
7. Prefer extending existing systems over creating parallel ones.
8. Every new gameplay mechanic must first be specified in `docs/GAME_BIBLE.md`, then in Domain Specs (`specs/` or an ADR-equivalent), and only then implemented in code.

---

## Enforcement (How we keep the convention real)
- Before merging a change that breaks a rule, create a short ADR entry:
  - What changed
  - Why it violates the rule
  - Why it is safe/beneficial
  - How the deviation will be unwound or contained
- Prefer “architecture adapter layers” over “workarounds in the UI”.

### SSOT Stability Rule
These documents are considered **fundamental SSOT**:
- `docs/PROJECT_MASTER_CONTEXT.md`
- `docs/PROJECT_CONSTITUTION.md`
- `docs/GAME_BIBLE.md`
- `docs/TECH_BIBLE.md`

They must be changed **only** when architecture/vision genuinely changes.
If a PR does not require a real change in those documents, do not update them.

