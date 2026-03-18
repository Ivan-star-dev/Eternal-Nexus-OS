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
const OUTPUT_PATH = process.env.MEMORY_GATE_OUTPUT_PATH || path.join('artifacts', 'map-memory-profile.json');
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
  const maplibreFiles = [];
  const pmtilesFiles = [];

  for (const file of files) {
    const relPath = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');

    if (/['"]maplibre-gl['"]/.test(content)) {
      maplibreFiles.push(relPath);
    }

    if (/['"]pmtiles['"]/.test(content)) {
      pmtilesFiles.push(relPath);
    }
  }

  return {
    hasMapLibre: maplibreFiles.length > 0,
    hasPMTiles: pmtilesFiles.length > 0,
    maplibreFiles,
    pmtilesFiles,
  };
}

function bytesToMb(bytes) {
  return Number((bytes / 1024 / 1024).toFixed(2));
}

function memorySnapshotMb() {
  const usage = process.memoryUsage();
  return {
    rss: bytesToMb(usage.rss),
    heapUsed: bytesToMb(usage.heapUsed),
    heapTotal: bytesToMb(usage.heapTotal),
    external: bytesToMb(usage.external),
  };
}

function forceGC() {
  if (typeof global.gc === 'function') {
    global.gc();
    global.gc();
  }
}

function ensureOutputDir() {
  const dir = path.dirname(path.join(ROOT, OUTPUT_PATH));
  fs.mkdirSync(dir, { recursive: true });
}

function writeReport(report) {
  ensureOutputDir();
  fs.writeFileSync(path.join(ROOT, OUTPUT_PATH), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(`[MemoryGate] Wrote report to ${OUTPUT_PATH}`);
}

async function profileModule({ label, specifier, budgetMb }) {
  forceGC();
  const before = memorySnapshotMb();

  try {
    await import(specifier);
  } catch (error) {
    console.error(`[MemoryGate] FAILED: could not import '${specifier}'.`);
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  }

  forceGC();
  const after = memorySnapshotMb();
  const heapDeltaMb = Number((after.heapUsed - before.heapUsed).toFixed(2));

  console.log(
    `[MemoryGate] ${label}: heapUsed before=${before.heapUsed}MB after=${after.heapUsed}MB delta=${heapDeltaMb}MB budget=${budgetMb}MB`
  );

  if (heapDeltaMb > budgetMb) {
    console.error(`[MemoryGate] FAILED: ${label} delta ${heapDeltaMb}MB exceeded budget ${budgetMb}MB.`);
    process.exit(1);
  }

  return {
    label,
    specifier,
    budgetMb,
    before,
    after,
    heapDeltaMb,
  };
}

async function main() {
  const detected = detectMapImports();
  const report = {
    generatedAt: new Date().toISOString(),
    budgetsMb: {
      maplibre: MAPLIBRE_BUDGET_MB,
      pmtiles: PMTILES_BUDGET_MB,
    },
    detection: detected,
    mode: 'armed-no-imports',
    moduleProfiles: [],
  };

  if (!detected.hasMapLibre && !detected.hasPMTiles) {
    console.log('[MemoryGate] No maplibre-gl/pmtiles imports detected in src/. Gate is armed and waiting for atlas integration.');
    writeReport(report);
    return;
  }

  report.mode = 'strict-import-profile';

  if (detected.hasMapLibre) {
    report.moduleProfiles.push(
      await profileModule({
        label: 'MapLibre module load',
        specifier: 'maplibre-gl',
        budgetMb: MAPLIBRE_BUDGET_MB,
      })
    );
  }

  if (detected.hasPMTiles) {
    report.moduleProfiles.push(
      await profileModule({
        label: 'PMTiles module load',
        specifier: 'pmtiles',
        budgetMb: PMTILES_BUDGET_MB,
      })
    );
  }

  writeReport(report);
  console.log('[MemoryGate] PASSED: Map memory profiling budgets are within limits.');
}

main().catch((error) => {
  console.error('[MemoryGate] FAILED with runtime error.');
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
