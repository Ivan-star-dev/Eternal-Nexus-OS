## [agent] objective — gate

### Objective
- Task/Issue: <!-- e.g., A2_ci-perf-gate -->
- Goal: <!-- one sentence on why this PR exists -->

### What changed
- <!-- file/path + concise change -->
- <!-- file/path + concise change -->

### Gate alignment
Which phase gate does this PR strengthen?
- [ ] Nervous System v1
- [ ] Sacred Flow preservation
- [ ] CI/Quality enforcement
- [ ] Ops/Scaffold

### Acceptance criteria (binary)
- [ ] PASS — all task acceptance criteria met
- [ ] FAIL — criteria not met (explain in Risks + rollback)

### How to verify
```bash
# Replace with exact commands executed for this PR
npm run lint
npm run test
npm run typecheck
```

### Evidence
- Command output summary: <!-- include key pass/fail notes -->
- Artifacts/links: <!-- optional -->

### Risks + rollback
- Risk: <!-- concrete risk, or "none identified" -->
- Rollback: `git revert <commit>`

### Session log
- [ ] `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md` included in this PR

### Post-merge checklist
- [ ] Append state bump to `NEXUS_CONTEXT/PROJECT_STATE.md`
- [ ] Leave handoff note in `NEXUS_CONTEXT/INSIGHTS.md`

### Suggestions to other pioneers
- @claude: <!-- architecture/contracts follow-up -->
- @codex: <!-- CI/tests/gates follow-up -->
- @antigravity: <!-- ops/release follow-up -->
