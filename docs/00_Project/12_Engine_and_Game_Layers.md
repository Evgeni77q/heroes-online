# Engine vs Game — Development Phase Transition

**Status:** Active (post v0.1.0-alpha)  
**Last Updated:** 2026-07-03

---

# 1. The Shift

| Before (engineering) | Now (game design) |
|----------------------|-------------------|
| We build the system | We tune world behaviour |
| How does upgrade work? | What should the player do next? |
| Numbers are data | Numbers are **choices** |
| Timers are processes | Timers are **pressure** |
| Resources are storage | Resources are **strategic limits** |

**BalanceService = the foundation of player decisions** — not just calculations.

This is the moment the project stops being “backend for a game” and becomes a **world model you can tune as a system**.

---

# 2. Two Layers

## Immutable Layer (engine)

Do not change without a proven load or correctness problem.

| Component | Role |
|-----------|------|
| Game Loop | Time and simulation |
| `GameJobRepository` | Timed work |
| `DomainEventBus` | Facts after simulation |
| Realtime subscribers | Transport to clients |
| CI / `release:gate` | Reproducible verification |

**Rule:** `if no real problem → no new infrastructure`

## Mutable Layer (game)

Tuned continuously — balance, rules, content.

| Domain | Examples |
|--------|----------|
| Economy | Production, storage, scarcity |
| Buildings | Costs, times, unlocks |
| Army | Training, upkeep (v0.3+) |
| World rules | Territory, combat (v0.4+) |
| Balance | `BalanceService` formulas, configs |

You can change balance and add mechanics **without rewriting the engine**.

---

# 3. What Success Means Now

Not only:

- no errors;
- no bugs;
- stable CI.

But:

> **The player makes decisions that feel meaningful.**

---

# 4. v0.2 Economy — Three Tuning Axes

v0.2 is not “adding a system”. It is configuring:

### 1. Scarcity

- Where does the player lose speed?
- Where do bottlenecks appear?

### 2. Choice

- What is better **now**?
- What is better **later**?

### 3. Trade-offs

- Speed vs efficiency
- Development vs army
- Economy vs expansion

See [v0.2 Economy](11_v0.2_Economy.md).

---

# 5. Simulation-Driven Development

Because the runtime is deterministic and reproducible:

- balance changes do not require architecture changes;
- new mechanics plug into Command → Job → Loop → Event → UI;
- economy can be tested as a **model** (seed + gate + metrics).

```
seed → Game Loop → observe → tune BalanceService → release:gate
```

---

# 6. Pressure Test (non-blocker)

Load scenarios (100+ jobs, 1s ticks, parallel players, WS volume) are **engineering tools**, not product value.

They do not block the design phase or `v0.1.0-alpha`.

Use them when economy load justifies it — document results; add to gate only if a scenario becomes a regression requirement.

---

# 7. Alpha Tag

**Not** “can we ship?” — **“when is CI green?”**

When `release-gate.yml` passes on a clean environment → `v0.1.0-alpha` is justified.

After that: work is **“what world do we want the player to see and feel?”** — not “how do we build it?”.

---

# 8. References

- [v0.2 Economy](11_v0.2_Economy.md)
- [Fresh Clone Gate](10_Fresh_Clone_Gate.md)
- [User Stories](06_User_Stories.md)
- [Release Plan](07_Release_Plan.md)
