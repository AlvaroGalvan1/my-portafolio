# How we work on this repo

Ideas don't go straight into code. They go through this loop.

1. **Capture.** Any idea goes into the inbox: `/idea ...` in a Claude session, or a new
   issue with the Idea template. Then back to what you were doing.
2. **Triage** (once a week, `/triage`). Each inbox issue becomes a ticket, merges into one, or closes.
   A ticket has a why, a scope, and acceptance criteria someone else could check.
3. **Decide before building.** Questions get a `decision` issue. The answer goes into
   `SITE-STRUCTURE.md`, the source of truth for what we are building, then into code.
4. **Build.** One ticket, one branch, one pull request:
   `feat/14-intake-form`, with `Closes #14` in the PR. Plan first, then code.
5. **Review.** Read the whole diff and fill in the PR template yourself, especially
   Why, How and What I learned. Then merge.

## Labels

| Group | Labels |
| --- | --- |
| Status | `inbox` · `ready` · `blocked` |
| Type | `epic` · `feat` · `bug` · `copy` · `design` · `decision` · `chore` · `backend` |
| Area | `area:global` · `area:home` · `area:work` · `area:wall` · `area:about` · `area:pricing` |
| Size | `size:S` (hours) · `size:M` (a day) · `size:L` (split it) |

Epics are parent issues; their tickets are sub-issues.

## While Portfolio v2 is being built

Production stays on v1 until v2 is finished.

```
main      v1, live. Fixes only.
v2.0      where v2 comes together. Vercel preview URL = staging.
feat/<n>  one ticket each, branched from v2.0, PR back into v2.0.
```

- **Branch from `v2.0`** and open the PR with **base `v2.0`**, not `main`.
- `Closes #n` only closes an issue when a PR merges into `main`. For PRs into
  `v2.0`, close the issue by hand after merging. Every v2 ticket is in the
  "v2 launch" milestone and is a sub-issue of the Portfolio v2 epic.
- When `main` gets a fix, merge `main` into `v2.0` so they don't drift.
- Launch: tag `main` as `v1`, then merge `v2.0` into `main`.
