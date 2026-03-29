---
title: "Hardware Prototype"
slug: hardware-prototype
date: 2026-03-20
category: architecture
excerpt: "Eternal Nexus Node v0.1 — dedicated physical intelligence terminal."
---

# HARDWARE PROTOTYPE — Eternal Nexus Node v0.1
## Dedicated Physical Intelligence Terminal

**Author:** Ivan Star · Eternal Nexus Engineering
**Date:** 2026-03-22
**Version:** v0.1 — Prototype Specification
**Classification:** Didactic · Engineering Blueprint

---

## Executive Summary

The Eternal Nexus Node is a dedicated hardware terminal designed to run the Eternal Nexus OS natively — without dependency on cloud infrastructure, external APIs, or third-party services for core intelligence functions. It is a **sovereign intelligence node**: self-contained, hardened, and deployable in embassy, crisis room, datacenter, or field environments.

The software it must run sets the hardware requirements:
- Real-time 3D geospatial rendering (CesiumJS globe with 9+ data layers)
- WebWorker-based LTTB downsampling (parallel compute)
- Three.js 3D simulations (GPU-intensive)
- Supabase real-time database (local instance)
- Post-quantum cryptography (CPU-intensive key operations)
- React 18 with heavy UI rendering (GPU compositing)
- Streaming data pipelines (network + memory bandwidth)

---

## 1. Vision — Why Physical Hardware?

A web application depends on the cloud. A sovereign intelligence system cannot.

The Nexus Node exists because:

1. **Sovereignty** — a government deploying Eternal Nexus OS should not route intelligence through Amazon, Google, or Microsoft servers
2. **Reliability** — crisis rooms cannot depend on internet connectivity; the node must operate offline
3. **Performance** — a dedicated hardware unit eliminates the latency and resource contention of shared cloud infrastructure
4. **Physical presence** — intelligence infrastructure should have physical form; it signals permanence and commitment
5. **Security** — air-gapped operation, hardware security modules, and local post-quantum key storage cannot be achieved in a browser tab

The Nexus Node is the physical manifestation of the Eternal Nexus OS vision.

---

## 2. Form Factor & Industrial Design

### Primary Unit — Nexus Node Mk.I

```
┌─────────────────────────────────────────┐
│                                         │
│   ETERNAL NEXUS NODE  ░░░░░░  [●] [●]  │  ← Status LEDs (gold / teal)
│                                         │
│   ████████████████████████████████████  │  ← Ambient light bar (morabeza gold)
│                                         │
│   [USB-C]  [USB-A x2]  [ETH]  [HDMI]  │
└─────────────────────────────────────────┘

Dimensions:   240mm × 180mm × 40mm (fanless primary config)
              240mm × 180mm × 65mm (active cooling config)
Material:     Anodized aluminum chassis — matte black
Weight:       ~1.2 kg (fanless) / ~1.6 kg (active)
Color:        Obsidian black + gold accent line
```

### Display Options

| Config | Display | Use Case |
|--------|---------|----------|
| **Headless** | None — drives external display | Datacenter / rack mount |
| **Standard** | 27" 4K external via HDMI 2.1 | Embassy intelligence room |
| **Dual** | 27" primary + 10" ambient status display | Crisis command center |
| **Embedded** | 15.6" integrated touch display | Field / mobile deployment |

### Physical Controls (minimal interface philosophy)
- 1× power button (capacitive, gold ring)
- 1× hardware security key slot (FIDO2/U2F)
- 1× emergency wipe button (recessed, requires tool)
- Status LED ring: gold = operational, teal = syncing, red = alert, off = standby

---

## 3. Compute Architecture

### 3.1 Primary Compute Module

**Target Spec — Production Unit:**

| Component | Spec | Rationale |
|-----------|------|-----------|
| CPU | AMD Ryzen 7 8700G (8C/16T, 4.2GHz base) | High single-thread for React rendering; integrated GPU fallback |
| GPU | NVIDIA RTX 4060 Mobile (8GB GDDR6) | CesiumJS globe + Three.js 3D simulations; WebGL 2.0 full support |
| RAM | 32GB DDR5-5600 (dual channel) | Local Supabase + browser runtime + OS overhead |
| Storage | 1TB NVMe PCIe 4.0 (primary) + 512GB SATA SSD (data backup) | Fast tile cache + map data |
| Display out | HDMI 2.1 + DisplayPort 1.4 | 4K@120Hz or dual 4K@60Hz |

**Minimum Viable Spec — Budget Deployment:**

| Component | Spec |
|-----------|------|
| CPU | Intel Core i7-1360P (12C, integrated Iris Xe) |
| RAM | 16GB DDR5 |
| Storage | 512GB NVMe |
| GPU | Integrated (limited 3D simulation fidelity) |

### 3.2 Real-Time Processing Unit

A dedicated **microcontroller co-processor** (ESP32-S3 or RP2040) handles:
- Hardware status LED control (gold/teal/red ring)
- Ambient light bar modulation
- Hardware health monitoring (temperature, power draw)
- Physical button debouncing and secure input
- Watchdog for main compute module

This keeps the ambient UI alive even when the main system is rebooting.

### 3.3 Neural Processing Unit (NPU)

For AI workloads in the Nexus organ (scenario simulation, AI council responses):
- **Integrated:** AMD Ryzen AI (XDNA NPU, ~16 TOPS) — sufficient for inference
- **Expanded:** Optional M.2 NPU card (Hailo-8, 26 TOPS) for local LLM inference

The NPU enables running the AI council locally without API calls to OpenAI/Anthropic — full sovereignty for AI inference.

### 3.4 Hardware Security Module (HSM)

Post-quantum key storage requires hardware protection:
- **Integrated:** Trusted Platform Module 2.0 (TPM 2.0) — standard on modern CPUs
- **Enhanced:** Dedicated HSM (Microchip ATECC608B or Infineon SLB 9672)

The HSM stores:
- Post-quantum key pairs (CRYSTALS-Kyber, CRYSTALS-Dilithium)
- Node identity certificate
- Encryption keys for local Supabase database
- Emergency wipe trigger keys

### 3.5 Redundancy Architecture

```
Primary SSD ──┐
              ├── RAID 1 mirror (automatic failover)
Backup SSD ───┘

Primary PSU ──┐
              ├── Automatic failover (UPS module)
Battery UPS ──┘

Primary NIC ──┐
              ├── Bonded / failover
Secondary NIC─┘
```

---

## 4. Connectivity

### 4.1 Network Interfaces

| Interface | Spec | Use |
|-----------|------|-----|
| Primary Ethernet | 2.5GbE (Intel I226-V) | Main network / internet |
| Secondary Ethernet | 1GbE | Backup / mesh network |
| Wi-Fi | Wi-Fi 6E (AX210) | Wireless fallback |
| Cellular (optional) | 5G NR module (Sierra Wireless EM9191) | Field deployment |
| Bluetooth | BT 5.3 | Peripheral input devices |

### 4.2 Mesh Networking

Multiple Nexus Nodes can form a **mesh network** for distributed intelligence:

```
Node A (Embassy Lisbon) ──── Node B (Embassy Brussels)
         │                            │
         └──────── Node C (HQ) ───────┘
                       │
                   Node D (Crisis Room)
```

Mesh protocol: **WireGuard** VPN tunnels with post-quantum key exchange. Each node maintains a local copy of the intelligence database, synchronized via **CRDTs** (Conflict-free Replicated Data Types) for offline-first operation.

### 4.3 Offline Sovereign Operation Mode

When disconnected from all external networks, the node operates with:
- Local Supabase PostgreSQL instance (full database)
- Pre-loaded CesiumJS terrain tiles (500GB tile cache for world coverage)
- Cached data layers (updated on last sync)
- Local NPU for AI inference (no external API calls)
- Post-quantum encrypted local storage

Sync resumes automatically when connectivity is restored, with conflict resolution via CRDT merge.

### 4.4 Data Synchronization Protocol

```
SYNC CYCLE (when connected):
1. Authenticate with central node (post-quantum mutual auth)
2. Pull delta updates (new data layers, protocol updates)
3. Push local events (verdicts, annotations, operator actions)
4. Verify integrity (hash chain validation)
5. Update tile cache (background, priority-based)
6. Disconnect cleanly (state persisted)
```

---

## 5. Software Stack on Hardware

### 5.1 OS Layer

**Base:** Ubuntu Server 24.04 LTS (minimal install, hardened)

**Hardening:**
- AppArmor profiles for all services
- Filesystem encryption (LUKS2 with TPM2 unsealing)
- Secure boot (custom signing keys)
- No SSH by default (local console only; SSH opt-in with hardware key)
- Automatic security updates (unattended-upgrades, kernel only)
- Disabled: Bluetooth (unless needed), unused USB ports, UEFI network boot

### 5.2 Nexus OS Runtime

The Eternal Nexus OS web application runs in a **hardened Chromium instance** (kiosk mode):
- No address bar, no extensions, no dev tools (production)
- GPU acceleration enabled (WebGL 2.0, WebGPU where available)
- WebWorker threads: 4 dedicated (LTTB, streaming, recovery, heartbeat)
- Memory limit: 8GB heap (prevents OOM on 32GB system)
- Managed by `systemd` service with automatic restart on crash

### 5.3 Local Supabase Instance

```
Services running locally:
- PostgreSQL 16 (database)
- PostgREST (REST API)
- Realtime (WebSocket pub/sub)
- GoTrue (authentication)
- Storage (file storage)

Port: 54321 (internal only, not exposed externally)
Backup: Automated hourly snapshots to backup SSD
Encryption: AES-256 at rest, TLS 1.3 in transit
```

### 5.4 Update & Deployment Mechanism

Updates are delivered as **signed OTA packages**:
1. Package signed with Ed25519 + CRYSTALS-Dilithium (post-quantum)
2. Node verifies signature before applying
3. Atomic update (A/B partition swap)
4. Rollback available for 30 days
5. Air-gapped update via USB drive (signed package on encrypted drive)

---

## 6. Power & Thermal

### 6.1 Power Consumption

| Mode | Draw | Description |
|------|------|-------------|
| Standby | ~8W | OS running, display off, minimal processes |
| Idle | ~25W | Full OS, browser idle, no active rendering |
| Normal | ~65W | Globe rendering, standard data layers |
| Peak | ~120W | All 3D simulations, full GPU load |
| Max TDP | ~150W | Stress test, all cores + GPU max |

### 6.2 Thermal Management

**Fanless config (preferred for silent environments):**
- Aluminum chassis as heatsink (passive cooling)
- Copper heat pipes from CPU/GPU to chassis
- Maximum ambient: 35°C
- Thermal throttle: 85°C (reduces clock speeds before shutdown)

**Active cooling config (for sustained GPU load):**
- Single 80mm Noctua fan (18 dBA at idle)
- Dual-zone thermal control (CPU zone + GPU zone)
- Maximum ambient: 45°C

### 6.3 UPS / Battery Backup

Integrated **60Wh LiFePO4 battery pack** (optional module):
- ~45 minutes runtime at normal load
- ~90 minutes at idle
- Graceful shutdown sequence at 10% battery
- Hot-swap capable (replace without shutdown)

---

## 7. Manufacturing Considerations

### 7.1 Bill of Materials — Key Components

| Component | Part | Est. Unit Cost |
|-----------|------|---------------|
| Compute module | AMD Ryzen 7 8700G mini-ITX board | ~$350 |
| GPU | NVIDIA RTX 4060 8GB | ~$300 |
| RAM | 32GB DDR5 (2× 16GB) | ~$80 |
| Primary SSD | Samsung 990 Pro 1TB | ~$90 |
| Backup SSD | Samsung 870 EVO 512GB | ~$50 |
| PSU | Seasonic Focus 350W SFX | ~$80 |
| Chassis | Custom aluminum (CNC) | ~$200 |
| HSM | Infineon SLB 9672 TPM 2.0 | ~$15 |
| Co-processor | ESP32-S3 dev module | ~$10 |
| LED components | WS2812B strip + driver | ~$20 |
| Networking | Intel I226-V NIC + AX210 Wi-Fi | ~$60 |
| Cooling | Noctua NH-L9a + fan | ~$50 |
| **Total BOM** | | **~$1,305** |

Target retail: **$2,500–$3,500** (1× unit, small batch)
Target OEM: **$1,800** (50+ units)

### 7.2 Assembly Approach

**Phase 0–1:** COTS (Commercial Off The Shelf) components in custom chassis
**Phase 2:** Custom PCB for co-processor + HSM + LED + power management integration
**Phase 3:** Custom compute module (ARM SoC or x86 embedded, custom PCB)

### 7.3 Software Tooling for Manufacturing

- Factory reset image (30-second full flash via USB)
- Hardware test suite (runs on first boot, validates all components)
- Node identity provisioning (unique certificate per unit, signed by Nexus CA)

---

## 8. Prototype Build Plan

### Phase 0 — Raspberry Pi 5 Proof of Concept
**Goal:** Validate software stack on ARM hardware
**Hardware:** Raspberry Pi 5 (8GB) + NVMe HAT + official display
**Cost:** ~$150
**Timeline:** 2 weeks
**Success criteria:** Nexus OS boots, Atlas globe renders at ≥30fps, Supabase local instance runs, WebWorkers functional

### Phase 1 — Mini-ITX Development Prototype
**Goal:** Full performance validation, form factor exploration
**Hardware:** ASRock DeskMeet X600 + Ryzen 7 8700G + 32GB DDR5 + RTX 4060
**Cost:** ~$900
**Timeline:** 4 weeks
**Success criteria:** All 3D simulations at 60fps, 9+ Atlas layers simultaneously, offline operation verified, UPS module functional

### Phase 2 — Custom Chassis + PCB Integration
**Goal:** Industrial design validation, custom co-processor PCB
**Hardware:** Phase 1 compute + CNC aluminum chassis + custom ESP32 PCB
**Cost:** ~$1,800 (including PCB prototyping)
**Timeline:** 8 weeks
**Success criteria:** Thermal validation (100hr stress test), assembly time <30min, visual design approved

### Phase 3 — Pre-Production Unit
**Goal:** 5-unit small batch for beta deployments
**Hardware:** Full BOM as specified, all custom components
**Cost:** ~$2,000/unit (small batch)
**Timeline:** 12 weeks
**Success criteria:** 5 units deployed, 30-day field validation, OTA update tested, mesh network 3-node test passed

---

## 9. Certifications & Compliance (Target)

| Certification | Scope | Priority |
|--------------|-------|----------|
| CE Mark | EU market (electromagnetic compatibility, safety) | P1 |
| FCC Part 15 | US market (radio emissions) | P1 |
| RoHS 3 | Hazardous substances restriction | P1 |
| ISO 27001 | Information security management | P2 |
| NATO STANAG 4569 | Military environmental standards (optional) | P3 |
| FIPS 140-3 Level 2 | Cryptographic module validation | P2 |

---

## 10. Use Case Scenarios

### 10.1 Embassy Intelligence Terminal
**Deployment:** Permanent installation in embassy secure room
**Config:** Headless + 27" 4K display, hardwired ethernet, no Wi-Fi
**Operation:** Daily sync with HQ node at 06:00 UTC, operates offline remainder of day
**Security:** Full disk encryption, HSM-backed keys, physical tamper detection

### 10.2 Crisis Command Node
**Deployment:** Mobile deployment to crisis zones
**Config:** Embedded 15.6" display, 5G cellular + Wi-Fi, UPS module
**Operation:** Fully autonomous, mesh-capable with other deployed nodes
**Security:** Emergency wipe capability, biometric + hardware key auth

### 10.3 National Platform Datacenter Node
**Deployment:** Government datacenter, rack-mounted (1U form factor variant)
**Config:** Headless, 2× 2.5GbE bonded, redundant PSU
**Operation:** 24/7 continuous operation, serves `/plataforma-nacional` + `/sala-de-crise`
**Security:** Full sovereignty stack, no external dependencies

### 10.4 Investor Briefing Room Installation
**Deployment:** Permanent installation in boardroom
**Config:** Standard + 27" primary display + 10" ambient status panel
**Operation:** Presentation mode — guided tours of Atlas, Nexus scenarios, project metrics
**Security:** Guest mode (read-only, no sensitive data), operator mode (full access)

---

## 11. Technical Diagrams

### System Block Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    NEXUS NODE Mk.I                       │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
│  │  AMD     │    │  RTX     │    │  Local Supabase  │  │
│  │ Ryzen 7  │◄──►│  4060    │    │  PostgreSQL      │  │
│  │  8700G   │    │  8GB     │    │  Realtime        │  │
│  └────┬─────┘    └────┬─────┘    │  GoTrue          │  │
│       │               │          └──────────────────┘  │
│  ┌────▼──────────────▼──────┐                          │
│  │      DDR5 32GB           │    ┌──────────────────┐  │
│  └──────────────────────────┘    │  TPM 2.0 + HSM   │  │
│                                  │  Post-Quantum     │  │
│  ┌──────────┐    ┌──────────┐    │  Key Storage      │  │
│  │  NVMe    │    │  SATA    │    └──────────────────┘  │
│  │  1TB     │    │  512GB   │                          │
│  │  Primary │    │  Backup  │    ┌──────────────────┐  │
│  └──────────┘    └──────────┘    │  ESP32-S3        │  │
│                                  │  Co-processor     │  │
│  ┌──────────────────────────┐    │  LED / Status     │  │
│  │  Network                 │    │  Watchdog         │  │
│  │  2.5GbE + 1GbE + Wi-Fi6E│    └──────────────────┘  │
│  └──────────────────────────┘                          │
└─────────────────────────────────────────────────────────┘
              │                    │
         HDMI 2.1              USB-C / USB-A
              │                    │
         4K Display           Peripherals /
                              Hardware Key
```

### Mesh Network Topology
```
        ┌─────────────┐
        │  Central HQ │ ← Master node (always-on)
        │   Node      │
        └──────┬──────┘
               │  WireGuard + PQ crypto
        ┌──────┴──────┐
        │             │
   ┌────▼────┐   ┌────▼────┐
   │ Embassy │   │ Embassy │
   │  Node A │   │  Node B │
   └────┬────┘   └────┬────┘
        │             │
   ┌────▼────┐   ┌────▼────┐
   │  Field  │   │ Crisis  │
   │  Node   │   │  Room   │
   └─────────┘   └─────────┘
```

### Power Flow
```
Wall AC ──► 350W SFX PSU ──► 12V rail ──► CPU/GPU
                          └──► 5V rail  ──► Co-processor
                          └──► 3.3V rail ──► Storage / HSM
                          └──► UPS module ──► Battery 60Wh
                                         └──► Bypass (mains)
```

---

_HARDWARE_PROTOTYPE.md v0.1 — 2026-03-22 | Ivan Star · Eternal Nexus Engineering | HW-001_