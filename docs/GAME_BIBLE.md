# Game Bible

This is the **player-experience contract** of Heroes Online.
It answers: **what must the game feel like** — not only what to implement.

Any new idea that conflicts with the bible must be revisited before implementation.

---

## 1. Core Fantasy

- The player is a ruler of their own state.
- Every city is unique: each layout + history creates a different story.
- The world exists independently of the player.
- Decisions have consequences that persist over time.
- Progress takes weeks/months, not minutes/hours.

---

## 2. Core Gameplay Loop

Each new mechanic must amplify this loop rather than break it.

1. Gather resources  
2. Build / upgrade buildings  
3. Strengthen economy  
4. Train an army  
5. Explore the map  
6. Conquer territories  
7. Gain new resources  
8. Develop further  

---

## 3. Player Emotions

The game should make players feel:

- Pride for their city (ownership + identity)
- The anticipation of construction finishing (time-based growth)
- Joy when a building level is unlocked (clear milestones)
- Tension before battles (stakes and preparation)
- Motivation to return tomorrow (long-term progression)

---

## 4. Design Pillars

- A living world
- A clear interface (readability over cleverness)
- Every action has meaning
- Minimal unnecessary clicks
- Beauty never harms clarity
- Player decisions matter more than monetization
- Depth without overload

---

## 5. Visual Identity

- Semi-realistic fantasy
- Premium browser strategy tone
- Clean silhouettes
- Saturated but not neon colors
- Readable at any scale
- Modular buildings as the visual language

---

## 6. Anti‑Goals

- Never clone Heroes at War.
- No pay‑to‑win.
- No artificial delays for monetization.
- No “same building, different name”.
- No mechanics without long-term value.

---

## 7. Mechanic Introduction Pipeline (Non‑Negotiable)

New gameplay mechanics must appear in this order:

1. **Game Bible**: the mechanic’s purpose, fantasy fit, emotions, and pillar impact are described.
2. **Domain Spec**: the mechanic’s domain rules are specified in `specs/` (or an ADR-equivalent document) and confirmed by:
   - deterministic state transition model
   - required data contracts
   - Definition of Done
3. **Implementation**: code is added to the domain layer first, then UI rendering.
4. **Verification**: tests and/or smoke harnesses prove the DoD is met.

If a mechanic cannot be explained in the Game Bible, it should not exist in the codebase yet.

