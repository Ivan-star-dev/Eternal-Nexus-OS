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
      const preview = from.replace(/\n/g, '\\n').slice(0, 50);
      console.log(`  [OK] ${filePath.split('/').pop()}: "${preview}..."`);
    } else {
      const preview = from.replace(/\n/g, '\\n').slice(0, 50);
      console.log(`  [SKIP] ${filePath.split('/').pop()}: "${preview}..."`);
    }
  }
  if (changed) {
    writeFileSync(filePath, patched.replace(/\n/g, '\r\n'), 'utf8');
  }
}

// === Fix AICouncil.tsx - bufferAttribute args ===
patch('src/components/nexus/AICouncil.tsx', [
  [
    'count={count}\n            array={positions}\n            itemSize={3}',
    'args={[positions, 3]}'
  ],
  [
    'count={count}\n          array={positions}\n          itemSize={3}',
    'args={[positions, 3]}'
  ],
]);

// === Fix MiniProjectScene.tsx - JSX.Element ===
patch('src/components/MiniProjectScene.tsx', [
  [
    ': JSX.Element[]',
    ': React.JSX.Element[]'
  ],
  [
    'JSX.Element | null',
    'React.ReactNode'
  ]
]);

// === Fix GeopoliticsMap.tsx - remove antialias from MapOptions ===
patch('src/components/geopolitics/GeopoliticsMap.tsx', [
  [
    'antialias: true,\n',
    ''
  ],
  [
    'antialias: true,\r\n',
    ''
  ],
]);

// Note: CommandPalette - {color:string} -> never is harder to fix without seeing the code.
// PlataformaNacional - line ref via different approach.

console.log('\nDone.');
