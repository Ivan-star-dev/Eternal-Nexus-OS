# 2026-03-18 — copilot — Fix all merge conflicts

## Context
- **Why this task exists**: Dependency conflicts and config mismatches accumulated across multiple commits, preventing clean `npm install` and test runs.
- **Phase Gate targeted:** Nervous System v1 (maintenance + unblock)

## What changed (facts)

### Files modified
- **`vitest.config.ts`** — replaced `@vitejs/plugin-react-swc` with `@vitejs/plugin-react` (swc plugin was removed from `package.json` in commit `0f49560` but `vitest.config.ts` was not updated)
- **`package.json`** — three fixes:
  1. `@tailwindcss/vite`: `^4.2.1` → `^4.2.2` (v4.2.1 peer-requires `vite@"^5.2.0 || ^6 || ^7"`, v4.2.2 adds `^8` support)
  2. Added `@testing-library/dom: ^10.4.0` (peer dependency of `@testing-library/react@16`, was missing from devDependencies)
  3. Added `overrides.lovable-tagger.vite: "^8.0.0"` to silence `lovable-tagger@1.1.13` peer conflict (tagger only runs in dev mode, functionally compatible with vite 8)
- **`vite.config.ts`** — corrected `test.browser.setupFiles` from `./src/setupTests.ts` (non-existent) to `./src/test/setup.ts` (actual setup file)
- **`tsconfig.json`** — removed duplicate `"module": "ESNext"` key (was declared twice in `compilerOptions`)
- **`package-lock.json`** — regenerated after the above package.json fixes (clean install, no `--legacy-peer-deps`)

## Summary of conflicts resolved

| Conflict | Root cause | Fix |
|----------|------------|-----|
| `npm install` failing | `@tailwindcss/vite@4.2.1` doesn't support vite 8 | Upgraded to `^4.2.2` |
| `npm install` failing | `lovable-tagger@1.1.13` peer-requires `vite < 8` | Added `overrides` to bypass |
| Tests failing to start | `vitest.config.ts` imported removed `@vitejs/plugin-react-swc` | Switched to `@vitejs/plugin-react` |
| Missing runtime dep | `@testing-library/dom` not in devDependencies | Added `^10.4.0` |
| Non-existent setup file | `vite.config.ts` pointed to `./src/setupTests.ts` | Fixed to `./src/test/setup.ts` |
| Invalid JSON (tsconfig) | Duplicate `"module"` key in `tsconfig.json` | Removed duplicate |

## Why (alignment)
- **Sacred Flow alignment:** Unblocks all test runs — 28/28 gate tests now pass cleanly without `--legacy-peer-deps`
- **Phase Gate:** All Nervous System v1 gates remain green

## Evidence (how to verify)
```bash
# Clean install — should succeed with zero errors
npm install

# All 28 tests pass
npm run test
# Expected: Test Files 3 passed (3), Tests 28 passed (28)
```

## Risks + rollback
- **Risk:** `overrides` on `lovable-tagger` may mask a real incompatibility if tagger uses a vite 8 API that changed
- **Mitigation:** `componentTagger()` only runs in dev mode; if it breaks, the build still works
- **Rollback:** `git revert HEAD` restores previous state

## Next 3 tasks (ranked)
1. **Task U1:** Apply Dark Glassmorphism visual DNA to `src/lib/map/dark-style.ts` (P1, my scope)
2. **Task U2:** Build MapLibre layer toggle panel for GeopoliticsMap (P1, my scope)
3. **Task C4:** Render conflict heatmap layer after @claude delivers the data pipeline (P2, shared)

## Suggestions to other pioneers
- **@claude:** C3/C4 unblocked — `npm install` and tests work cleanly now
- **@codex:** Consider adding a CI step that runs `npm install` (without `--legacy-peer-deps`) to catch future peer dep conflicts early
- **@antigravity:** `package-lock.json` is now authoritative — please don't regenerate it with `--legacy-peer-deps`
