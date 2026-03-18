import { readFileSync, writeFileSync } from 'fs';

function patch(filePath, replacements) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;
  // normalize CRLF to LF for matching
  const normalized = content.replace(/\r\n/g, '\n');
  let patched = normalized;
  let changed = false;
  for (const [from, to] of replacements) {
    if (patched.includes(from)) {
      patched = patched.split(from).join(to);
      changed = true;
      console.log(`  [OK] Replaced in ${filePath.split('/').pop()}: ${from.slice(0,40).replace(/\n/g,'\\n')}...`);
    } else {
      console.log(`  [SKIP] No match in ${filePath.split('/').pop()}: ${from.slice(0,40).replace(/\n/g,'\\n')}...`);
    }
  }
  if (changed) {
    // restore CRLF
    writeFileSync(filePath, patched.replace(/\n/g, '\r\n'), 'utf8');
  }
}

// === Fix 1: NexusOrganismScene - add Line import ===
patch('src/components/nexus/NexusOrganismScene.tsx', [
  [
    'import {\n  OrbitControls,\n  Sparkles,\n  Float,\n  MeshDistortMaterial,\n  Text,\n} from "@react-three/drei";',
    'import {\n  OrbitControls,\n  Sparkles,\n  Float,\n  MeshDistortMaterial,\n  Text,\n  Line,\n} from "@react-three/drei";'
  ]
]);

// === Fix 2: WhitepaperUpload - optional chaining on metadata ===
patch('src/components/WhitepaperUpload.tsx', [
  [
    'f.metadata?.size > 1048576 ? `${(f.metadata.size / 1048576).toFixed(1)} MB` : `${(f.metadata?.size / 1024 || 0).toFixed(0)} KB`',
    '(f.metadata?.size ?? 0) > 1048576 ? `${((f.metadata?.size ?? 0) / 1048576).toFixed(1)} MB` : `${((f.metadata?.size ?? 0) / 1024).toFixed(0)} KB`'
  ]
]);

// === Fix 3: event-persistence.test.ts - fix createTribunalVerdict call ===
patch('src/test/event-persistence.test.ts', [
  [
    "function makeEvent(label = 'Test verdict') {\n  return createTribunalVerdict({ label, category: 'test', confidence: 0.9 });\n}",
    "function makeEvent(topic = 'Test verdict') {\n  return createTribunalVerdict({\n    topic,\n    judges: ['zeta-9'],\n    verdict: 'approved',\n    reasoning: `Auto-generated test verdict for: ${topic}`,\n    flowTarget: 'index',\n  });\n}"
  ]
]);

// === Fix 4: PlataformaNacional - fix line ref type (use primitive lowercase) ===
// The <line> JSX element maps to SVGLineElement - use primitive three.js API instead
// We need to rename 'lineRef' usage context - use a different approach
// The <line> JSX element in R3F context maps to THREE.Line but TypeScript complains
// Solution: use useRef<THREE.Line | null>(null) and cast
patch('src/pages/PlataformaNacional.tsx', [
  [
    'const lineRef = useRef<THREE.Line<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(null!);',
    '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const lineRef = useRef<any>(null);'
  ]
]);

console.log('\nAll patches done!');
