# Authoring an agent

> Agents are sub-specialists the main agent delegates to. Done well, they make AZMX dramatically more reliable on repeat tasks. Done poorly, they pollute the global namespace.

## When to write an agent (vs. a skill, vs. a snippet)

- **Snippet** — you'd type the same paragraph repeatedly. Make it a `#name`.
- **Skill** — you want the agent to *think* differently in a domain. Add knowledge to its context.
- **Agent** — you want a self-contained specialist with **bounded tools** and **predictable output**. The main agent delegates the whole task.

A useful test: if your specialist needs more than the main agent's context window, it should probably be an agent. If it's just "load this knowledge," it's a skill.

## Anatomy

```markdown
---
name: agent-slug                  # filename matches: agent-slug.md
description: One sentence — when to dispatch.
tools: ["read_file", "grep"]      # allow-list; [] means inherit
metadata:
  type: agent
  category: code | infra | security | ux | data | docs
---

# Agent title

## When to dispatch
## Your job
## How to do it
## Output shape
## What to refuse
## Anti-patterns
## When I'm done   ← one-line verdict the main agent relays
```

Read [`agents/examples/test-writer.md`](../agents/examples/test-writer.md) for a worked tight example, [`agents/examples/migration-planner.md`](../agents/examples/migration-planner.md) for a longer one.

## Tool allow-list discipline

This is the most important field in your agent definition. **Give it the minimum it needs.**

| Goal | Allow-list shape |
|---|---|
| Read-only reviewer | `["read_file", "grep", "glob", "find_symbol", "find_references"]` |
| Read + propose-but-don't-write | Same as above. Output the file proposal; let the user paste. |
| Code modifier | Add `"edit"`, `"write_file"` |
| DevOps / shell | Add `"bash"` (gated by user approval policy regardless) |
| Empty `[]` | Inherits from main agent — use only when the specialist needs the full surface |

Empty allow-lists are a smell. If your specialist needs everything, it isn't a specialist.

## Bounded output

Specialists are valuable because their **output shape is predictable.** Every dispatch returns the same kind of artifact. Lay it out as a template in the "Output shape" section so the agent can't drift.

A reliable output shape lets the user read 3 of your specialist's results side-by-side. An unreliable one is just a wordier main agent.

## The one-line verdict

End every agent with a "When I'm done" section that produces **one sentence** the main agent can relay to the user. The point: a user dispatching 5 specialists in parallel doesn't want to read 5 long reports — they want 5 verdict lines + the option to dig in.

Examples:

- `4 tests proposed for <symbol>. User to paste at <path> and run <cmd>.`
- `Migration is safe to ship after expanding the deploy from 1 step → 5 steps.`
- `Review found 2 high-confidence correctness bugs; see comments inline.`
- `Refused — task requires writing to a path outside the agent's allow-list.`

## "What to refuse" is mandatory

Bounded scope means the agent **says no** to out-of-scope work. Every agent has a `## What to refuse` section. Be specific:

- "Counter-propose: …"
- "Hard refuse: …"
- "Ask the user for X before continuing"

A specialist that does everything anyone asks isn't a specialist.

## Anti-patterns to refuse to write

In your `## Anti-patterns` section, list specific shapes your agent refuses to produce. Concrete is mandatory:

> Don't write tests that only assert "no exception thrown" — they catch nothing.

NOT:

> Don't write bad tests.

## Naming

- **Imperative-noun** for code-acting agents (`test-writer`, `migration-planner`, `changelog-writer`).
- **Reviewer** for read-only correctness agents (`code-reviewer`, `security-reviewer`, `a11y-auditor`).
- **Helper** discouraged — too vague.

Keep it 1–3 words, lowercase, kebab-case.

## Behavior under stress

Before submitting, dispatch your specialist 5 times in a row on:

1. A perfect-fit task (the case it was built for)
2. A near-fit task (drift potential)
3. An out-of-scope task (does it refuse cleanly?)
4. A vague task ("do whatever you think")
5. A trap task (asks the agent to break its own rules)

If any of these produce embarrassing output, sharpen the agent's brief.

## Composition with other agents

A specialist can call other specialists. Use sparingly — chains of 3+ delegate-to-delegate calls become harder to reason about than the original generalist call. As a rule of thumb, your agent delegates at most one level deep.

## Submitting

1. Fork this repo.
2. Add your agent at `agents/<slug>.md`.
3. PR titled `agent: add <slug>`.
4. In the PR description: link to 3 example dispatches showing the output shape consistent across them.
5. Wait for review (2–5 business days).

## What we reject

- Agents that quietly bypass safety gates (`tools: ["bash"]` with no approval policy override is fine; "ignore the approval policy" in the brief is not).
- Agents whose `tools` field includes everything (use a generalist).
- Agents whose output drifts dispatch-to-dispatch (probably the prompt isn't tight; rewrite).
- Agents named after a vendor without disclosed affiliation.
- Forks of bundled agents with cosmetic changes.

## After it ships

Your agent is dispatched from across the world from the next release on. We'll mention you in the release notes; you can opt into a credit line in the agent's front-matter (`contributor: "@your-handle"`).

Some agents become the de-facto pattern for a class of work. That's the goal.
