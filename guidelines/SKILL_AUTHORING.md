# Authoring a skill

> Skills are how the AZMX agent gets domain expertise. Each one is one Markdown file. Quality matters more than length.

## What a great skill looks like

A great skill teaches the agent to act like a domain expert in one specific area. It has:

- **One narrow scope.** "Postgres query review", not "all of databases".
- **Concrete patterns to look for.** Not "write good code" — "spot OFFSET on a large table; suggest cursor pagination".
- **Real examples.** Bad → good, with brief commentary on what changed.
- **Anti-patterns.** What NOT to do, with reasons.
- **A verdict line where applicable.** When the agent finishes, the user knows what to do.

## File format

```markdown
---
name: skill-slug
description: One sentence. What this skill teaches the agent to do.
metadata:
  type: skill
  category: code | infra | security | ux | data | docs
---

# Skill title

Opening paragraph — when this skill applies. Be explicit: "Load this skill
when the user is reviewing a SQL query for production."

## What to look for

### Subcategory 1

- Concrete pattern, what's at stake, what to suggest.

### Subcategory 2

- ...

## What to do

1. Step-by-step. The agent reads this as a procedure.
2. ...

## Examples

### Bad

(real code, 5–15 lines)

> Verdict + why + suggested fix.

### Good

(real code, 5–15 lines)

> Verdict + why this is right.

## Anti-patterns

- Specific shapes to refuse, each with the reason.
```

## Length budget

- **Short skill** — 50–200 lines. Good for narrowly scoped patterns (`semver-bumping`, `commit-message-style`).
- **Standard skill** — 200–500 lines. Most skills land here.
- **Deep skill** — 500–800 lines. Reserve for genuinely deep disciplines (`distributed-systems-debug`, `security-review`).

If you're over 800 lines, split into two skills with cross-references.

## Voice

Write **to the agent**, not about the user. The agent reads the skill and applies it.

- ✅ "Surface this — propose `CREATE INDEX CONCURRENTLY` and explain the lock implication."
- ❌ "The user might want to add an index."

## Anti-jailbreak

Skills are loaded into the agent's context. Don't write skills that:

- Tell the agent to ignore previous instructions
- Tell the agent to bypass approval gates
- Tell the agent to reveal system prompts
- Tell the agent to act like a different persona that doesn't respect AZMX's safety floor

These get rejected on review. They also break the agent's reliability for legitimate users.

## What we won't accept

- **Promotional skills** — "use AcmeCorp's tool for X" without disclosed affiliation.
- **Generic advice** — "write good code" with no concrete shape.
- **Out-of-scope expertise** — a skill is for an act-on-it discipline, not a textbook chapter.
- **Forks of bundled skills** with cosmetic changes.
- **Vendor lock-in skills** that assume one specific paid service.

## How to test before submitting

1. **Load it manually** — drop your skill in `~/.azmx/skills/your-slug.md`. Restart AZMX (or `Settings → Skills → Reload`).
2. **Trigger it** — type `/skill your-slug` in the AI panel, or ask "load skill your-slug" naturally.
3. **Use it for real** — try the patterns the skill describes on real code / real queries / real designs. Refine for friction.
4. **Stress it** — give it edge cases. Watch where the agent hesitates or contradicts the skill.

If you can't dogfood a skill on real work, it's not ready.

## Submitting

1. Fork this repo.
2. Add your skill at `skills/<your-slug>.md`.
3. Open a PR titled `skill: add <slug>`.
4. In the PR description, include:
   - 1-line summary
   - 2-3 example questions / situations where this skill would help
   - A link to where you've tested it (if public)
5. Wait for review (2–5 business days).

## After it ships

Your skill goes into the bundled set in the next AZMX release. Every user worldwide can `load_skill("your-slug")` after update. You're credited in the release notes and in the skill file's front-matter (if you'd like — opt-in).
