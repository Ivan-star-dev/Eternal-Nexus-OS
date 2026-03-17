# SECURITY_MODEL - Keeping strategy private

## Reality check
If the repository is public, anything committed to it is visible to everyone.
There is no reliable way to make content human-unreadable but AI-readable in a public repo.
If it is encrypted, nobody can read it without the key, including AIs.

## Best options (recommended)
### Option A - Make the repo private
Use a private GitHub repo for strategy, ops, and knowledge.
If a public repo is needed later, mirror only sanitized code.

### Option B - Split repos
- `Eternal-Nexus-OS`: code and public-safe docs
- `Eternal-Nexus-OS-Private`: strategy, debate outputs, registries, and roadmaps

### Option C - Encrypted vault inside a private repo
Use `git-crypt` or `sops`.
Anyone with the key can read it, human or AI.

## Minimal safe approach
- Add `NEXUS_CONTEXT/_private/` to `.gitignore`
- Keep sensitive debate outputs local or in a private repo
- Keep only public-safe artifacts in `NEXUS_CONTEXT/`
- Keep the tracked template at `NEXUS_CONTEXT/FOUNDER_PROFILE.template.md`
- Keep the real founder memory at `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md`
