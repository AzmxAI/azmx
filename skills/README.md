# Community skills

> A **skill** is a named discipline the AZMX agent can load on demand — like calling `load_skill("api-design")` to make the agent reason about REST/GraphQL like a senior architect.

This folder is a **community library** of skill files. Each one is a single Markdown file with front-matter metadata + a body that the agent loads into context when invoked.

AZMX ships ~80 bundled skills (a11y-audit, ADR writing, API design, agent debugging, …). This folder is where the community adds the rest.

## What a skill is

A skill is **focused expertise**, not a kitchen-sink prompt. Good skills:

- Are 200–800 lines (anything bigger gets fragmented).
- Cover one discipline well (`api-design`, not `general-software`).
- Are written for the agent, not the user — the agent reads it and applies it.
- Include concrete examples of what good looks like.
- List anti-patterns to refuse.
- Don't reference internal AZMX code, IPC names, or proprietary detail.

See [`examples/`](examples/) for two fully-worked skills you can fork.

## Anatomy

Front-matter:

```yaml
---
name: skill-slug
description: One sentence — what this skill teaches the agent.
metadata:
  type: skill
  category: code | infra | security | ux | data | docs
---
```

Body (Markdown). Headers are free-form; the agent reads the whole thing.

## Submission checklist

Before opening a PR:

- [ ] Filename matches the front-matter `name` (`api-design.md` ↔ `name: api-design`).
- [ ] No real customer data, credentials, internal URLs, or proprietary identifiers.
- [ ] Written for the **agent's perspective** — not "the user does X" but "the agent should X."
- [ ] Includes 2–4 concrete examples.
- [ ] Lists anti-patterns explicitly ("don't do this because…").
- [ ] License is permissive (MIT / Apache-2.0 / CC0).

## How it ships

PRs are reviewed for quality + safety. Accepted skills are added to the bundled set in the next AZMX release — every user can `load_skill("your-skill")` on update.

## What we won't accept

- Skills that encourage the agent to bypass its safety gates.
- Skills that promote a single vendor / SaaS unfairly.
- Skills with vague advice ("write good code") — concrete or skip it.
- Forks of bundled skills with cosmetic differences.

## Authoring guide

Long form: [`guidelines/SKILL_AUTHORING.md`](../guidelines/SKILL_AUTHORING.md).
