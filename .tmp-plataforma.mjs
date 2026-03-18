import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/pages/PlataformaNacional.tsx';
let content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// Replace <line ref={lineRef} geometry={lineGeom}> block with primitive
// The <line> JSX element resolves to SVGLineElement in DOM, conflicting with THREE.Line
// Using <primitive> sidesteps the type conflict entirely.
const oldBlock = `  return (
    <group>
      <line ref={lineRef} geometry={lineGeom}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </line>`;

const newBlock = `  // Build a THREE.Line imperatively to avoid SVGLineElement JSX conflict
  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
    const l = new THREE.Line(lineGeom, mat);
    return l;
  }, [lineGeom, color]);

  return (
    <group>
      <primitive ref={lineRef} object={lineObj} />`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  console.log('[OK] Replaced <line> with <primitive> in PlataformaNacional.tsx');
} else {
  // Try a more targeted approach - just fix the ref attribute
  const old2 = '      <line ref={lineRef} geometry={lineGeom}>';
  const new2 = '      <line ref={lineRef as any} geometry={lineGeom}>';
  if (content.includes(old2)) {
    content = content.replace(old2, new2);
    console.log('[OK] Added `as any` cast to line ref in PlataformaNacional.tsx');
  } else {
    console.log('[FAIL] Could not find target in PlataformaNacional.tsx');
    // Print lines 244-250 for debug
    const lines = content.split('\n');
    lines.slice(243, 252).forEach((l, i) => console.log(`${244+i}: ${l}`));
  }
}

writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
