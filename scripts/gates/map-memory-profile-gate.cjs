/**
 * Map memory profile gate.
 *
 * CI goal: keep MapLibre + PMTiles memory growth observable and enforceable.
 * This gate becomes strict when map imports are present in src/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const MAPLIBRE_BUDGET_MB = Number(process.env.MAPLIBRE_MEMORY_BUDGET_MB || 180);
const PMTILES_BUDGET_MB = Number(process.env.PMTILES_MEMORY_BUDGET_MB || 80);

function collectSourceFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build'].includes(entry.name)) continue;
      collectSourceFiles(next, out);
      continue;
    }

    if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(next);
    }
  }

  return out;
}

function detectMapImports() {
  const files = collectSourceFiles(SRC_DIR);
  let hasMapLibre = false;
  let hasPMTiles = false;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    if (!hasMapLibre && /['\"]maplibre-gl['\"]/.test(content)) {
      hasMapLibre = true;
    }

    if (!hasPMTiles && /['\"]pmtiles['\"]/.test(content)) {
      hasPMTiles = true;
    }

    if (hasMapLibre && hasPMTiles) break;
  }

  return { hasMapLibre, hasPMTiles };
}

function bytesToMb(bytes) {
  return Number((bytes / 1024 / 1024).toFixed(2));
}

function heapUsedMb() {
  return bytesToMb(process.memoryUsage().heapUsed);
}

function forceGC() {
  if (typeof global.gc === 'function') {
    global.gc();
    global.gc();
  }
}

async function profileModule({ label, specifier, budgetMb }) {
  forceGC();
  const before = heapUsedMb();

  await import(specifier);

  forceGC();
  const after = heapUsedMb();
  const delta = Number((after - before).toFixed(2));

  console.log(`[MemoryGate] ${label}: before=${before}MB after=${after}MB delta=${delta}MB budget=${budgetMb}MB`);

  if (delta > budgetMb) {
    console.error(`[MemoryGate] FAILED: ${label} delta ${delta}MB exceeded budget ${budgetMb}MB.`);
    process.exit(1);
  }
}

async function main() {
  const { hasMapLibre, hasPMTiles } = detectMapImports();

  if (!hasMapLibre && !hasPMTiles) {
    console.log('[MemoryGate] No maplibre-gl/pmtiles imports detected in src/. Gate is armed and waiting for atlas integration.');
    return;
  }

  if (hasMapLibre) {
    await profileModule({
      label: 'MapLibre module load',
      specifier: 'maplibre-gl',
      budgetMb: MAPLIBRE_BUDGET_MB,
    });
  }

  if (hasPMTiles) {
    await profileModule({
      label: 'PMTiles module load',
      specifier: 'pmtiles',
      budgetMb: PMTILES_BUDGET_MB,
    });
  }

  console.log('[MemoryGate] PASSED: Map memory profiling budgets are within limits.');
}

main().catch((error) => {
  console.error('[MemoryGate] FAILED with runtime error.');
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
