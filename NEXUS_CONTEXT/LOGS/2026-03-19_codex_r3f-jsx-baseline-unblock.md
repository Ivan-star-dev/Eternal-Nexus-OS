# Codex Session Log — R3F JSX Baseline Unblock

## Scope
- CI/typecheck unblock only.
- Targeted global R3F JSX namespace failure (`JSX.IntrinsicElements` missing `mesh`, `group`, etc.).

## Reality Pass
- Smallest root cause found: React runtime on v18 with `@types/react`/`@types/react-dom` on v19.
- This mismatch broke legacy global JSX assumptions used by `@react-three/fiber@8` augmentation.

## Changes
- Downgraded type packages to React 18 type line:
  - `@types/react` → `^18.3.28`
  - `@types/react-dom` → `^18.3.7`
- No product feature edits.

## Evidence (commands)
1. `npm run -s typecheck`
   - Before: 1000+ errors dominated by `Property 'mesh' does not exist on type 'JSX.IntrinsicElements'`.
2. `npm i -D @types/react@^18.3.12 @types/react-dom@^18.3.1`
3. `npm run -s typecheck`
   - After: global R3F JSX errors removed.
   - Residual errors are smaller clusters (e.g., missing exports, strict null checks, missing deps).

## Next Smallest Step
- Address the smallest residual cluster next (candidate: duplicated `GeoProject` import errors in `AtlasSidebar`/`EnvironmentPanel`).
