# TIMELINE — Eternal Nexus OS
> V1→V10 build history. Decisions that survived. What was cut.
> Family: Legacy · Subfamily: Timeline
> Cravado: 2026-03-29 · @claude · Source: git log + HANDOFF_LEDGER + session memory

---

## FORMAT

Each entry: `[date] [commit/session] — what changed — what was decided — truth label`

---

## PRE-V3 (foundation)

**2026-03-21 · DNA-PROTOCOL-MOTHER-001**
- DNA Protocol cravado — the mother protocol
- Branch: `claude/expose-workspace-config-yt4Km`
- Decision: system is fractal — every part contains the logic of the whole
- Decision: BASTION is the only source of eligible execution
- Status: `CANONICALIZED`

**2026-03-21 · BRAND-DOCS-001**
- BRAND_CANON sealed — Syne + Cormorant Garamond + JetBrains Mono
- Color system: deep institutional navy + authoritative gold + teal operational
- Status: `CANONICALIZED`

**2026-03-22 · CLAUDE.md install**
- CLAUDE.md installed as primary session law
- Branch guard protocol activated
- Status: `CANONICALIZED`

---

## V3 (surface + data)

**Globe 3D, Trinity, Sacred Orbital Chamber, motion system**
- @antigravity built immersive 3D globe as hero
- 7 live organs connected to data layer
- Projects table layer active
- Session backbone active (SWMR classifier, relay pool Layer A+B+C)
- Status: `REAL`

---

## V4–V6 (bulking)

**GATE_V4_OPEN — 2026-03-27 — score 0.91 by @codex**
- V4 passed quality gate
- Gates V5→V7 set to automatic
- Status: `PROVED`

---

## V7 (surfaces)

**2026-03-27 · GAP-CLOSURE-V10-WAVE1 (`ab7a440`)**
- V10 real gap closure — wave 1
- All pioneers mobilized
- Status: `REAL`

**2026-03-27 · GAP-CLOSURE-V10-001 (`36b87e8`)**
- Creation Lab elevation
- LabHero built (new component)
- LabQuickCreate added
- LabWorkBay wired to real artifact data
- "Meu lab" feeling achieved
- Status: `REAL`

**2026-03-27 · GAP-CLOSURE-V10-WAVE3 (`ca81633`)**
- Route Intelligence v1
- Ship Gate structure
- Portal Identity pass
- Atmosphere foundation
- Status: `REAL`

**2026-03-27 · GAP-CLOSURE-V10-WAVE4 (`342b544`)**
- PortalShell installed
- NextStepHint component
- ControlTower v1
- Wiring pass
- Status: `REAL`

---

## V8 (hardening)

**2026-03-27 · feat(ship-gate) (`20948a1`)**
- P0 validation pass
- Build ✅ · 84/84 tests ✅
- 3 missing stubs created
- Status: `PROVED`

**2026-03-27 · feat(organism) (`d4b5d2a`)**
- NexusRuntime fusion layer — living system closed
- OrganismState + health scores
- Governance laws C-01→C-07 defined
- Status: `PARTIAL` (laws defined, call sites = zero)

**2026-03-27 · feat(build-real) (`b5068d4`)**
- Universal transitions
- Atmosphere presets
- Taskboard
- Status: `REAL`

**2026-03-27 · feat(scale-real) (`57eb764`)**
- Pilot instrumentation
- Bundle gate
- Quality gate
- Status: `REAL`

**2026-03-27 · feat(governance) (`e4f5cbe`)**
- Scoring engine built
- Health scores wired into ControlTower
- Status: `PARTIAL`

---

## V9 (guidance + governance pass)

**2026-03-27 · V9-GUIDANCE-GOVERNANCE-001 (`9d7d4e1`)**
- Guidance types defined
- guidanceModel built
- ContextualHint component
- chaosDetector
- useGovernance hook
- useGuidance hook
- Status: `REAL` (system), `DEAD` in UI flows (call sites missing)

**2026-03-27 · V9-QUALITY-AUDIT-001 (`592e731`)**
- Score: 0.82/1.0
- V9 FECHADO
- Status: `PROVED`

---

## V10 CURRENT SESSION — 2026-03-28 → 2026-03-29

**2026-03-28 · `77a9c78` — OrganismBridge + lab session seed**
- `OrganismBridge` component mounted app-wide in App.tsx
- `/lab` cold entry seeds `startSession('Creation Lab', 'open-lab')`
- `recordVisit('lab')` on mount
- Decision: OrganismBridge renders null — pure side-effect bridge

**2026-03-28 · `9b5490e` — Wedge return tracking + resume badge + pilot metrics**
- `returnTracker.ts` built (new — portal-scoped)
- `getReturnMetrics(portal)` → wedge_signal: none|weak|strong
- ControlTower Wedge Gate section added
- LabHero resume badge upgraded: dual-signal (session + returnTracker)
- LabHero now reads last artifact title from `getRecentArtifacts(1)`
- Decision: 48h unprompted return = only wedge validation metric

**2026-03-28 · `5e3117b` — 4-pass implementation**
- PASS 1 (session truth): `SessionContext.saveToStorage` now calls `saveSnapshot` in sync
- PASS 2 (dead code): `resolveEntry()` deleted — zero call sites confirmed
- PASS 3 (atmosphere): 5 portal backgrounds removed — RouteAtmosphereLayer now breathes
  - SchoolPage, SchoolSurface, WorkshopPage, NexusSurface, NexusPage cleaned
- PASS 4 (school parity): SchoolHero created (gold/amber DNA, maturity badge, resume badge)
  - LearningPath wired to real maturityLevel from useEvolution
  - `resolveStatus(stepIndex, maturityLevel)` — real status computation
  - SchoolSurface passes maturityLevel to LearningPath
- Decision: TRI-CORE parity law — Lab = Creation = School before fusion
- Decision: per-portal returnTracker (not global)

**2026-03-29 · ecosystem/ built (this session)**
- Six-family ecosystem structure created
- INDEX.md, knowledge/, market/, legacy/ seeded
- Status: `REAL`

---

## DECISIONS THAT SURVIVED (CANONICALIZED)

| Decision | Date | Source |
|----------|------|--------|
| BASTION as only eligible execution source | 2026-03-21 | DNA_PROTOCOL |
| Branch guard — never write to main/master | 2026-03-22 | CLAUDE.md |
| Solo-first (collaboration = P3, not P0) | pre-V3 | DNA_PROTOCOL |
| Artifact memory in localStorage first | 2026-03-27 | CODE |
| 48h return = only wedge metric | 2026-03-28 | WEDGE-FIRST-STRIKE-001 |
| TRI-CORE parity before fusion | 2026-03-28 | IMPLEMENTATION prompt |
| RouteAtmosphereLayer owns portal backgrounds | 2026-03-28 | 4-pass implementation |
| resolveEntry deleted (dead code) | 2026-03-28 | 4-pass implementation |

---

## DECISIONS THAT WERE CUT

| Cut | Why | Date |
|-----|-----|------|
| `resolveEntry()` function | Zero call sites. No real pipeline needed yet. | 2026-03-28 |
| Multi-portal active_face update on navigate | Open panels/scroll never written — partial state is fine for now | 2026-03-28 |
| Collaboration Atrium build | Solo-first law — postponed to P3 | 2026-03-27 |

---

## V10 REAL DEFINITION (from GAP_CLOSURE_MATRIX)

```
V10 is only real when:
  ✓ user enters → world recognizes them
  ✓ Creation Lab holds usage
  ✓ user creates something → lives in system
  ✓ user leaves → returns without losing context
  ✓ transitions preserve presence
  ✓ guidance helps without polluting
  ✓ performance is premium-stable
  ✓ governance prevents chaos
  ✓ pilot proves experience is real, not just vision
```

**Current state (2026-03-29):**
- Recognition on entry: ✓ (resume badge works)
- Creation Lab holds usage: ✓ (artifacts persist)
- Creates and lives: ✓ (localStorage)
- Leaves and returns: ✓ (session restore)
- Transitions: PARTIAL (TransitionConfig inert)
- Guidance: PARTIAL (call sites missing)
- Performance: PARTIAL (no profiling done)
- Governance: DEAD in UI flows
- Pilot: BLOCKED

---

_TIMELINE.md · legacy v1.0 · 2026-03-29_
