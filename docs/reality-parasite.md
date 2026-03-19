# Reality Parasite

> Run this checklist before any governance change ships.
> Purpose: prevent protocol bloat by asking whether rules describe reality or wishes.

## The Test

For every rule being added or kept, answer:

| # | Question | Pass if |
|---|----------|---------|
| 1 | Has any pioneer followed this rule in the last 5 completed tasks? | Yes — the rule is alive |
| 2 | Is there a concrete enforcement mechanism (CI gate, lease check, template field)? | Yes — the rule has teeth |
| 3 | If this rule were deleted, would the next pioneer notice within one session? | Yes — the rule is load-bearing |
| 4 | Does this rule duplicate another rule that already covers the same concern? | No — the rule is unique |
| 5 | Can this rule be stated in one sentence? | Yes — the rule is clear |

**Verdict:**
- 5/5 pass → rule stays
- 3-4/5 pass → rule stays but gets flagged for simplification
- 0-2/5 pass → rule is dead weight. Remove or archive.

## When to Run

- Before merging any PR that adds or modifies governance docs
- During any protocol integration or reset
- When AGENTS.md exceeds 200 lines
- When a pioneer reports confusion about which rule applies

## Anti-Bloat Principle

Every governance rule costs pioneer attention. Attention is finite. Rules that are not enforced, not followed, or not load-bearing drain attention from rules that matter. The parasite eats dead rules so living rules stay sharp.
