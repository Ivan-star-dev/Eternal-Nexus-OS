# OPEN SOURCE ACCELERATOR - Pioneer Debate Prompt

Paste this into each pioneer tool: Claude Code, Codex, antigravity, Copilot, Cursor, or the current UI pioneer.

---

ETERNAL NEXUS - OPEN SOURCE ACCELERATOR DEBATE

Goal: pick 10 open-source repos that cut production time by months without creating dependency soup.

Project DNA (non-negotiable):
- Organs fixed: Nexus, Tribunal, Atlas, Index, News
- Sacred Flow: Tribunal -> Atlas -> Index -> News -> Streams
- No dashboards; cascade inheritance UX (folder -> folder)

Your job:
1. Propose the top 10 repos for our stack or critique and replace items in `NEXUS_CONTEXT/STACK_REGISTRY.md`.
2. For each repo, score 0-5:
   - A) alignment to Sacred Flow + cascade UX
   - B) performance and scalability
   - C) integration effort (5 = easy)
   - D) license risk (5 = low risk)
   - E) maintenance health
3. For each repo answer:
   - What organ does it accelerate?
   - What does it replace or cut? (anti-soup)
   - What is the smallest 1-2 day pilot?
4. Score the benchmark fit of each possible pioneer using tags such as `@claude`, `@codex`, `@antigravity`, `@copilot`, and `@ui`.
5. Name the owner and backup only after that benchmark-fit debate.

Team synchronization rule:
- Write final recommendations as a PR editing `NEXUS_CONTEXT/STACK_REGISTRY.md`.
- Validate uncertain picks in a lab branch: `lab/<agent>/01..03`.
- Never merge lab directly to `main`.
- Do not assign ownership because a pioneer likes the task; assign it because the benchmark fit is strongest.

Output format:
- ranked list (1-10) + backups
- 3 must-not-adopt red flags
- recommended adoption order for the next phase gate, with Nervous System v1 first
