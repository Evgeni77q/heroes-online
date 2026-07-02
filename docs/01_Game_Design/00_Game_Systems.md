# Heroes Online

**Document:** 00_Game_Systems.md  
**Location:** docs/01_Game_Design/00_Game_Systems.md

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Approved |
| Created | 2026-07-03 |
| Last Updated | 2026-07-03 |

---

# Purpose

This document defines every gameplay system that exists in Heroes Online.

Its purpose is to provide the complete list of systems before designing the Domain Model, database schema, backend architecture, APIs, and frontend.

No gameplay system may be implemented unless it is first registered in this document.

---

# System Classification

## Tier 0 — Core Platform

| ID | System | Description |
|----|--------|-------------|
| CORE-001 | Account | Account management |
| CORE-002 | Authentication | Login, sessions, JWT |
| CORE-003 | World | Game worlds |
| CORE-004 | Time | Global game time |
| CORE-005 | Configuration | Game configuration |
| CORE-006 | Localization | Multi-language support |
| CORE-007 | Notifications | Global notifications |

---

## Tier 1 — Core Gameplay

| ID | System | Description |
|----|--------|-------------|
| GAME-001 | Player | Player profile |
| GAME-002 | Empire | Entire player empire |
| GAME-003 | City | Cities |
| GAME-004 | World Map | World map |
| GAME-005 | Tiles | Map tiles |
| GAME-006 | Resources | Economy resources |
| GAME-007 | Buildings | Buildings |
| GAME-008 | Construction | Construction queues |
| GAME-009 | Research | Technologies |
| GAME-010 | Population | Population system |
| GAME-011 | Happiness | Happiness & loyalty |
| GAME-012 | Storage | Warehouses |
| GAME-013 | Production | Resource production |

---

## Tier 2 — Military

| ID | System | Description |
|----|--------|-------------|
| MIL-001 | Units | Military units |
| MIL-002 | Army | Army composition |
| MIL-003 | March | Army movement |
| MIL-004 | Battle | Battle resolution |
| MIL-005 | Siege | Siege mechanics |
| MIL-006 | Scouting | Reconnaissance |
| MIL-007 | Reinforcement | Reinforcement armies |
| MIL-008 | Garrisons | City defense |

---

## Tier 3 — Heroes

| ID | System | Description |
|----|--------|-------------|
| HERO-001 | Heroes | Hero management |
| HERO-002 | Hero Skills | Skills |
| HERO-003 | Hero Equipment | Equipment |
| HERO-004 | Hero Experience | Experience |
| HERO-005 | Hero Missions | Assignments |

---

## Tier 4 — Alliance

| ID | System | Description |
|----|--------|-------------|
| ALL-001 | Alliance | Guilds |
| ALL-002 | Alliance Roles | Permissions |
| ALL-003 | Diplomacy | Diplomacy |
| ALL-004 | Alliance Chat | Internal chat |
| ALL-005 | Alliance Treasury | Shared treasury |
| ALL-006 | Alliance Technologies | Alliance upgrades |
| ALL-007 | Alliance Wars | Large-scale wars |

---

## Tier 5 — Economy

| ID | System | Description |
|----|--------|-------------|
| ECO-001 | Marketplace | Marketplace |
| ECO-002 | Trade Routes | Trade routes |
| ECO-003 | NPC Market | NPC trade |
| ECO-004 | Taxes | Taxes |
| ECO-005 | Economy Events | Economic events |

---

## Tier 6 — Communication

| ID | System | Description |
|----|--------|-------------|
| COM-001 | Mail | In-game mail |
| COM-002 | Reports | Battle & event reports |
| COM-003 | Chat | Global chat |
| COM-004 | Private Messages | Direct messages |
| COM-005 | Notifications | Player notifications |

---

## Tier 7 — Progression

| ID | System | Description |
|----|--------|-------------|
| PRO-001 | Quests | Quest system |
| PRO-002 | Achievements | Achievements |
| PRO-003 | Rankings | Rankings |
| PRO-004 | Titles | Player titles |
| PRO-005 | Statistics | Statistics |

---

## Tier 8 — Items

| ID | System | Description |
|----|--------|-------------|
| ITEM-001 | Inventory | Inventory |
| ITEM-002 | Items | Items |
| ITEM-003 | Equipment | Equipment |
| ITEM-004 | Consumables | Consumables |
| ITEM-005 | Crafting | Crafting |

---

## Tier 9 — Live Operations

| ID | System | Description |
|----|--------|-------------|
| LIVE-001 | Events | World events |
| LIVE-002 | Seasons | Seasons |
| LIVE-003 | World Bosses | PvE |
| LIVE-004 | Tournaments | Competitive events |
| LIVE-005 | Maintenance | Server maintenance |

---

## Tier 10 — Premium

| ID | System | Description |
|----|--------|-------------|
| PREM-001 | Premium Account | Premium features |
| PREM-002 | Cosmetics | Cosmetic items |
| PREM-003 | Shop | In-game shop |

---

## Tier 11 — Administration

| ID | System | Description |
|----|--------|-------------|
| ADM-001 | Admin Panel | Administration |
| ADM-002 | Moderation | Moderation |
| ADM-003 | Audit Log | Audit |
| ADM-004 | Anti-Cheat | Anti-cheat |
| ADM-005 | Analytics | Analytics |

---

# Dependencies

Every gameplay system depends on lower tiers.

Example:

Battle

depends on

Army

depends on

Units

depends on

Research

depends on

Buildings

depends on

Resources

No circular dependencies are allowed.

---

# Rules

Every new gameplay feature must:

- belong to exactly one system;
- have one owner;
- define clear public interfaces;
- expose events where required;
- be documented before implementation.

---

# Statistics

Current registered systems: **58**

This document is the authoritative registry of all gameplay systems in Heroes Online.

---

**End of Document**
