#!/usr/bin/env node
/**
 * NEXUS BRIDGE AGENT — bridge.mjs
 * Reads handoffs from agent/* branches, updates cluster state,
 * emits gates when criteria met, creates stall reports when needed.
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const OPS  = join(ROOT, 'ops')

// ─── 1. COLLECT HANDOFFS FROM ALL AGENT BRANCHES ─────────────────────────────

const AGENT_BRANCHES = [
  'agent/antigravity',
  'agent/framer',
  'agent/cursor',
  'agent/codex',
  'agent/copilot',
  'agent/claude',
]

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function getLastCommitTime(branch) {
  const iso = git(`log refs/remotes/origin/${branch} -1 --format=%cI 2>/dev/null`)
  return iso ? new Date(iso) : null
}

function getFilesFromBranch(branch) {
  try {
    const files = git(`ls-tree -r --name-only refs/remotes/origin/${branch}`)
    return files.split('\n').filter(Boolean)
  } catch {
    return []
  }
}

function readFileFromBranch(branch, path) {
  try {
    return git(`show refs/remotes/origin/${branch}:${path}`)
  } catch {
    return ''
  }
}

// ─── 2. PARSE BRIDGE_HANDOFF BLOCKS ─────────────────────────────────────────

function parseHandoffs(content) {
  const handoffs = []
  const blocks = content.split('BRIDGE_HANDOFF')
  for (const block of blocks.slice(1)) {
    const lines = block.split('\n').slice(0, 12)
    const obj = {}
    for (const line of lines) {
      const m = line.match(/^\s+(\w+):\s+(.+)$/)
      if (m) obj[m[1].toLowerCase()] = m[2].trim()
    }
    if (obj.task_id) handoffs.push(obj)
  }
  return handoffs
}

// ─── 3. LOAD EXISTING STATE ───────────────────────────────────────────────────

const STATE_FILE = join(OPS, 'BRIDGE_STATE.md')

function loadState() {
  const defaults = {
    tasks: {},          // task_id → { status, score, pioneer, kernel, ts }
    v4_progress: 0,
    v5_progress: 0,
    v6_progress: 0,
    v7_progress: 0,
    gates: [],          // list of gates already emitted
    stalls: {},         // pioneer → last seen timestamp
  }
  if (!existsSync(STATE_FILE)) return defaults
  try {
    const raw = readFileSync(STATE_FILE, 'utf8')
    const m = raw.match(/```json\n([\s\S]+?)\n```/)
    if (m) return { ...defaults, ...JSON.parse(m[1]) }
  } catch {}
  return defaults
}

// ─── 4. SCAN ALL AGENT BRANCHES ──────────────────────────────────────────────

const state = loadState()
const now = new Date()

for (const branch of AGENT_BRANCHES) {
  const pioneer = branch.replace('agent/', '@')
  const files = getFilesFromBranch(branch)

  // Update stall tracker
  const lastCommit = getLastCommitTime(branch)
  if (lastCommit) state.stalls[pioneer] = lastCommit.toISOString()

  // Read all .md files in ops/ on this branch and parse handoffs
  const opsMd = files.filter(f => f.startsWith('ops/') && f.endsWith('.md'))
  for (const file of opsMd) {
    const content = readFileFromBranch(branch, file)
    const handoffs = parseHandoffs(content)
    for (const h of handoffs) {
      if (!h.task_id) continue
      const existing = state.tasks[h.task_id]
      // Only update if newer or not present
      if (!existing || h.status === 'concluída') {
        state.tasks[h.task_id] = {
          status:  h.status || 'unknown',
          score:   h.heaven_lab_score ? parseFloat(h.heaven_lab_score) : null,
          pioneer: h.pioneer || pioneer,
          kernel:  h.kernel  || '',
          cluster: h.cluster || '',
          ts:      now.toISOString(),
        }
      }
    }
  }
}

// ─── 5. GATE CRITERIA CHECK ───────────────────────────────────────────────────

function taskDone(id) {
  return state.tasks[id]?.status === 'concluída'
}

function heavenScore(id) {
  return state.tasks[id]?.score ?? 0
}

const newGates = []

// GATE V4
if (
  !state.gates.includes('GATE_V4_OPEN') &&
  taskDone('NS-1-001') &&
  taskDone('GLOBE-3D-001') &&
  Math.max(heavenScore('NS-1-001'), heavenScore('GLOBE-3D-001')) >= 0.85
) {
  newGates.push('GATE_V4_OPEN')
}

// GATE V5
if (
  !state.gates.includes('GATE_V5_OPEN') &&
  state.gates.includes('GATE_V4_OPEN') &&
  (state.v4_progress >= 70 || taskDone('V4-WORLD-FEATURES-001'))
) {
  newGates.push('GATE_V5_OPEN')
}

// GATE V6
if (
  !state.gates.includes('GATE_V6_OPEN') &&
  state.gates.includes('GATE_V5_OPEN') &&
  state.v5_progress >= 60
) {
  newGates.push('GATE_V6_OPEN')
}

// GATE V7
if (
  !state.gates.includes('GATE_V7_OPEN') &&
  state.gates.includes('GATE_V6_OPEN') &&
  state.v6_progress >= 60
) {
  newGates.push('GATE_V7_OPEN')
}

// ─── 6. EMIT GATE FILES ───────────────────────────────────────────────────────

for (const gate of newGates) {
  state.gates.push(gate)
  const version = gate.replace('GATE_V', '').replace('_OPEN', '')
  const evidence = Object.entries(state.tasks)
    .filter(([, v]) => v.status === 'concluída')
    .map(([id]) => `  ✓ ${id}`)
    .join('\n')

  const content = `# ${gate}\n\n` +
    `> Emitido automaticamente pelo NEXUS BRIDGE AGENT\n` +
    `> Data: ${now.toISOString()}\n\n` +
    `## EVIDÊNCIA\n\n\`\`\`\n${evidence}\n\`\`\`\n\n` +
    `## PRÓXIMO CLUSTER\n\n` +
    `Ver: ops/V${version}_MINIMUM_SPEC.md ou ops/EARTH_LAB_RESEARCH_CORE_ARCH.md\n\n` +
    `_Bridge Agent — automático_\n`

  writeFileSync(join(OPS, `${gate}.md`), content)
  console.log(`[BRIDGE] EMITTED: ${gate}`)
}

// ─── 7. STALL DETECTION ───────────────────────────────────────────────────────

const STALL_HOURS = 4
const stallReports = []

for (const [pioneer, tsStr] of Object.entries(state.stalls)) {
  const last = new Date(tsStr)
  const hours = (now - last) / 36e5
  if (hours > STALL_HOURS) {
    const report = `# STALL_REPORT — ${pioneer}\n\n` +
      `> Gerado pelo NEXUS BRIDGE AGENT\n` +
      `> Data: ${now.toISOString()}\n\n` +
      `| Campo | Valor |\n|-------|-------|\n` +
      `| Pioneer | ${pioneer} |\n` +
      `| Último commit | ${tsStr} |\n` +
      `| Horas parado | ${hours.toFixed(1)}h |\n` +
      `| Threshold | ${STALL_HOURS}h |\n\n` +
      `## PROPOSTA DE DESBLOQUEIO\n\n` +
      `1. Verificar se sessão do pioneer está activa\n` +
      `2. Ler kernel assignment: ops/KERNEL_ASSIGNMENT_${pioneer.replace('@','').toUpperCase()}.md\n` +
      `3. Se pioneer indisponível → @codex activa kernel alternativo (ver NEXUS_KERNEL_OS.md §6)\n\n` +
      `_Bridge Agent — automático_\n`

    const fname = `STALL_REPORT_${pioneer.replace('@','')}_${Date.now()}.md`
    writeFileSync(join(OPS, fname), report)
    stallReports.push(fname)
    console.log(`[BRIDGE] STALL DETECTED: ${pioneer} (${hours.toFixed(1)}h)`)
  }
}

// ─── 8. WRITE UPDATED STATE ───────────────────────────────────────────────────

const taskSummary = Object.entries(state.tasks)
  .map(([id, t]) => `| ${id} | ${t.pioneer} | ${t.status} | ${t.score ?? '-'} |`)
  .join('\n')

const clusterSummary = `
CLUSTER_V3_SURFACE:  ${taskDone('GLOBE-3D-001') && taskDone('NS-1-001') ? 'DISSOLVED ✓' : 'ACTIVE'}
CLUSTER_V3_IMPL:     ${taskDone('GLOBE-EXPERIENCE-IMPL-001') ? 'DISSOLVED ✓' : 'STANDBY/ACTIVE'}
CLUSTER_V3_AUDIT:    ${state.gates.includes('GATE_V4_OPEN') ? 'DISSOLVED ✓' : 'STANDBY'}
CLUSTER_V4_WORLD:    ${state.gates.includes('GATE_V4_OPEN') ? (state.v4_progress >= 70 ? 'CONVERGING' : 'ACTIVE') : 'LOCKED'}
`.trim()

const stateDoc = `# BRIDGE_STATE — Nexus Bridge Agent\n\n` +
  `> Gerado automaticamente. Não editar manualmente.\n` +
  `> Última actualização: ${now.toISOString()}\n\n` +
  `## GATES EMITIDOS\n\n` +
  `${state.gates.map(g => `- ✓ ${g}`).join('\n') || '- nenhum ainda'}\n\n` +
  `## CLUSTERS\n\n\`\`\`\n${clusterSummary}\n\`\`\`\n\n` +
  `## TASKS DETECTADAS\n\n` +
  `| Task ID | Pioneer | Status | Heaven Lab Score |\n` +
  `|---------|---------|--------|-----------------|\n` +
  `${taskSummary || '| — | — | aguardando handoffs | — |'}\n\n` +
  `## STALL REPORTS\n\n` +
  `${stallReports.map(f => `- ${f}`).join('\n') || '- nenhum'}\n\n` +
  `## STATE JSON\n\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\`\n\n` +
  `_NEXUS_BRIDGE_AGENT v1.0_\n`

writeFileSync(STATE_FILE, stateDoc)
console.log(`[BRIDGE] State written. Gates: ${state.gates.join(', ') || 'none'}. Stalls: ${stallReports.length}.`)
