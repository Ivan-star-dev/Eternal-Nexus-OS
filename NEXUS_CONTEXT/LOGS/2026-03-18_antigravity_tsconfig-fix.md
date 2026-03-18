# 2026-03-18 - antigravity - tsconfig-bundler-fix

## What changed
- Added `"module": "ESNext"` to the top-level `tsconfig.json`.

## Why
When `"moduleResolution"` is set to `"bundler"`, TypeScript 5+ strictly requires `"module"` to be set to `"ESNext"`, `"ES2022"`, or `"preserve"`. Since the root `tsconfig.json` was missing it entirely (expecting it to only live in the `.app.json` or `.node.json` references), IDE language servers like VS Code throw `Option 'bundler' can only be used when 'module' is set to 'preserve' or to 'es2015' or later`. 

## Evidence
Added `"module": "ESNext"` directly to `compilerOptions` in the root config. The IDE TS service should immediately pick this up and silence the red squiggly lines.

## Risks & Mitigations
- None. It matches what the nested tsconfigs expect anyway.

## Next steps
- The pipeline remains the same. Awaiting Copilot and Claude.
