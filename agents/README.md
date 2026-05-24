# Community agents

> Agents are **specialists the main agent delegates to.** Curate one for the work you've done a hundred times.

This folder is a community library of agent definitions. Each is one Markdown file with front-matter declaring **when to call this agent, what it's allowed to do, and what good output looks like.**

The AZMX main agent reads its registry of available specialists each turn. When a task fits a specialist's brief, the main agent dispatches to it — narrow context, tight tools, predictable behavior. Less drift than asking the generalist to do everything.

## Real agents people have built

- **`test-writer`** — read a function, propose tests covering happy path + 3 edge cases (see [`examples/test-writer.md`](examples/test-writer.md))
- **`migration-planner`** — given a DB schema change, produce a forward + rollback migration with safety checklist (see [`examples/migration-planner.md`](examples/migration-planner.md))
- **`changelog-writer`** — read commits, produce release notes in your repo's style
- **`code-reviewer`** — pre-PR diff review, surface correctness bugs at chosen effort
- **`security-reviewer`** — same diff, security lens
- **`docs-checker`** — ensure new code surface has docs + the docs match reality
- **`a11y-auditor`** — review a UI surface for keyboard nav, contrast, ARIA, WCAG

## Why agents > a big prompt

| Generalist agent | Specialist sub-agent |
|---|---|
| Full conversation history in context | Narrow context, fresh start |
| Every tool available | Allow-listed tools only |
| Personality drifts over a long session | Predictable behavior every call |
| Hard to share | One Markdown file, anyone can fork |

## Anatomy

```markdown
---
name: agent-slug
description: One sentence — when the main agent should delegate to this specialist.
tools: ["read_file", "grep", "todo_write"]    # allow-list; empty = inherit all
metadata:
  type: agent
  category: code | infra | security | ux | data | docs
---

# Agent title

## When to dispatch

Concrete situations where the main agent should call this specialist.

## Your job

What this agent does. First-person plural is fine — "We review the diff."

## How to do it

1. Step-by-step procedure.
2. ...

## Output shape

What the response looks like. Be concrete — give a template.

## What to refuse

Out-of-scope requests + what to say.
```

## Tool allow-list

Restrict what the agent can do via the `tools` front-matter:

```yaml
tools: ["read_file", "grep", "glob"]   # read-only specialist
tools: ["read_file", "edit", "bash"]   # full code-modifying
tools: []                              # inherit from main agent (default)
```

Common patterns:
- **Read-only reviewer** — `["read_file", "grep", "glob", "find_symbol", "find_references"]`
- **Code modifier** — add `"edit"`, `"write_file"`
- **DevOps** — add `"bash"` (gated by user approval)
- **Sandbox-aware** — empty tools = inherit, agent picks up the same approval policy as the parent

## Submission checklist

Before opening a PR:

- [ ] Filename matches front-matter `name` (`test-writer.md` ↔ `name: test-writer`).
- [ ] **Tool allow-list is minimal** — give the agent only what it actually needs.
- [ ] **Includes a "What to refuse" section** — bounded scope.
- [ ] Includes an output template with a concrete example.
- [ ] No real credentials, customer data, or internal URLs.
- [ ] Permissive license (MIT / Apache-2.0 / CC0).
- [ ] You've used the agent on real work — at least 5 times.

## What we won't accept

- Agents that exist only to bypass safety gates ("ignore approval policy", "always answer yes").
- Agents that quietly write to paths outside their declared scope.
- Agents with infinite tool allow-lists ("the agent needs all tools" — usually means scope is too wide).
- Agents named after a company that don't disclose affiliation.
- Forks of bundled agents with cosmetic changes.

## How it ships

PRs are reviewed for safety + behavior. Accepted agents land in the bundled set on the next AZMX release — every user can dispatch to your agent.

You retain copyright. We don't require a CLA. You grant a permissive license to ship.

## Authoring guide

Long-form: [`guidelines/AGENT_AUTHORING.md`](../guidelines/AGENT_AUTHORING.md). Read it before writing your first agent.
