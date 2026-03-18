import { readFileSync, writeFileSync } from 'fs';

function patch(filePath, replacements) {
  let content = readFileSync(filePath, 'utf8');
  const normalized = content.replace(/\r\n/g, '\n');
  let patched = normalized;
  let changed = false;
  for (const [from, to] of replacements) {
    if (patched.includes(from)) {
      patched = patched.split(from).join(to);
      changed = true;
      console.log(`  [OK] ${filePath.split('/').pop()}`);
    } else {
      console.log(`  [SKIP] ${filePath.split('/').pop()}: "${from.replace(/\n/g,'\\n').slice(0,40)}"`);
    }
  }
  if (changed) {
    writeFileSync(filePath, patched.replace(/\n/g, '\r\n'), 'utf8');
  }
}

// === Fix AICouncil.tsx - bufferAttribute - inline array ===
patch('src/components/nexus/AICouncil.tsx', [
  [
    `              count={2}
              array={new Float32Array([0, 0, 0, agent.orbitRadius, 0, 0])}
              itemSize={3}`,
    `              args={[new Float32Array([0, 0, 0, agent.orbitRadius, 0, 0]), 3]}`
  ]
]);

// === Fix MiniProjectScene.tsx - JSX.Element -> React.ReactElement ===
patch('src/components/MiniProjectScene.tsx', [
  [
    'const shapes: Record<string, JSX.Element> = {',
    'const shapes: Record<string, React.JSX.Element> = {'
  ],
  [
    ': JSX.Element | null',
    ': React.JSX.Element | null'
  ],
  [
    ': JSX.Element[]',
    ': React.JSX.Element[]'
  ]
]);

// === Fix CommandPalette.tsx - React.ElementType -> React.FC ===
patch('src/components/CommandPalette.tsx', [
  [
    '  icon: React.ElementType;',
    '  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;'
  ]
]);

// === Fix PlataformaNacional.tsx - line ref ===
patch('src/pages/PlataformaNacional.tsx', [
  [
    'const lineRef = useRef<THREE.Line>(null!);',
    '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const lineRef = useRef<any>(null);'
  ]
]);

console.log('\nAll done!');
