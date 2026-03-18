import { readFileSync, writeFileSync } from 'fs';

function patchFile(filePath, oldStr, newStr) {
  let content = readFileSync(filePath, 'utf8');
  const normalized = content.replace(/\r\n/g, '\n');
  const patched = normalized.replace(oldStr, newStr);
  if (patched === normalized) {
    console.log(`[WARN] No match found in ${filePath}`);
  } else {
    writeFileSync(filePath, patched.replace(/\n/g, '\r\n'), 'utf8');
    console.log(`[OK] Patched ${filePath}`);
  }
}

// Fix InvestorNexusPortal.tsx - bufferAttribute args
patchFile(
  'src/pages/InvestorNexusPortal.tsx',
  'count={80}\n              array={particlePositions}\n              itemSize={3}',
  'args={[particlePositions, 3]}'
);

// Fix NexusOrganismScene.tsx - bufferAttribute args (positions/colors/sizes)
patchFile(
  'src/components/nexus/NexusOrganismScene.tsx',
  'count={params.particleCount}\n          array={positions}\n          itemSize={3}',
  'args={[positions, 3]}'
);
patchFile(
  'src/components/nexus/NexusOrganismScene.tsx',
  'count={params.particleCount}\n          array={colors}\n          itemSize={3}',
  'args={[colors, 3]}'
);
patchFile(
  'src/components/nexus/NexusOrganismScene.tsx',
  'count={params.particleCount}\n          array={sizes}\n          itemSize={1}',
  'args={[sizes, 1]}'
);
patchFile(
  'src/components/nexus/NexusOrganismScene.tsx',
  'count={30}\n            array={trailPositions.current}\n            itemSize={3}',
  'args={[trailPositions.current, 3]}'
);

// Fix ParticleSystem.tsx - bufferAttribute args
patchFile(
  'src/components/shared/ParticleSystem.tsx',
  'count={count}\n          array={positions}\n          itemSize={3}',
  'args={[positions, 3]}'
);
patchFile(
  'src/components/shared/ParticleSystem.tsx',
  'count={count}\n          array={sizes}\n          itemSize={1}',
  'args={[sizes, 1]}'
);

// Fix resilient-bridge.ts - Worker null assertion
patchFile(
  'src/lib/downsampling/resilient-bridge.ts',
  'originalHandler?.call(this.worker, event)',
  'originalHandler?.call(this.worker!, event)'
);

// Fix PlataformaNacional - line ref type and Variants imports 
patchFile(
  'src/pages/PlataformaNacional.tsx',
  "import { motion, AnimatePresence } from \"framer-motion\";",
  "import { motion, AnimatePresence, type Variants } from \"framer-motion\";"
);
patchFile(
  'src/pages/PlataformaNacional.tsx',
  'const containerVariants = {',
  'const containerVariants: Variants = {'
);
patchFile(
  'src/pages/PlataformaNacional.tsx',
  'const itemVariants = {',
  'const itemVariants: Variants = {'
);
patchFile(
  'src/pages/PlataformaNacional.tsx',
  'ease: [0.22, 1, 0.36, 1]',
  'ease: [0.22, 1, 0.36, 1] as [number, number, number, number]'
);

// Fix ProjectChat.tsx - JSX.Element -> ReactElement
patchFile(
  'src/components/ProjectChat.tsx',
  "import { useState, useEffect, useRef, useCallback } from \"react\";",
  "import { useState, useEffect, useRef, useCallback, type ReactElement } from \"react\";"
);
patchFile(
  'src/components/ProjectChat.tsx',
  'const elements: JSX.Element[] = [];',
  'const elements: ReactElement[] = [];'
);
patchFile(
  'src/components/ProjectChat.tsx',
  'function formatInlineMarkdown(text: string): string | JSX.Element[] {',
  'function formatInlineMarkdown(text: string): string | ReactElement[] {'
);
patchFile(
  'src/components/ProjectChat.tsx',
  '  }) as unknown as JSX.Element[];',
  '  }) as unknown as ReactElement[];'
);

// Fix CentroComandoGeopolitico.tsx - JSX.Element -> React.JSX.Element
patchFile(
  'src/pages/CentroComandoGeopolitico.tsx',
  'const lines: JSX.Element[] = [];',
  'const lines: React.JSX.Element[] = [];'
);

// Fix EducacaoNacional.tsx - React.ElementType -> React.FC
patchFile(
  'src/pages/EducacaoNacional.tsx',
  'icon: React.ElementType;',
  'icon: React.FC<{ className?: string }>;'
);

console.log('All patches applied!');
