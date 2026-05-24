# Community snippets

> Pre-baked prompts you can paste into the composer with `#snippet`. The 90% of work that's never one-off.

This folder is a community library of **snippets** — short prompt templates the AZMX composer can inject with the `#` trigger. Press `#`, pick one, send.

Snippets are how power users save a workflow they keep re-typing. The community library ships in every AZMX release, available to every user.

## When a snippet beats a skill

- **Snippet** = a fixed prompt you'd type yourself, parameterized with `{{placeholders}}`. The user fills in the blanks.
- **Skill** = expertise the agent loads to act differently. The agent applies it.

If you'd be writing the same paragraph more than 5 times — make it a snippet. If you want the agent to *think* differently — make it a skill.

## Real snippets people use

- `#explain` — "Explain what this code does, focusing on the trickiest line and the non-obvious assumption."
- `#shorten` — "Cut this in half without losing meaning. Be ruthless."
- `#commit-msg` — "Draft a commit subject + body for the staged diff, in the repo's house style."
- `#rubber-duck` — "I'm stuck. I'll explain what I'm trying to do; you tell me where my thinking breaks."
- `#mock-input` — "Generate realistic mock input data for this function — 5 examples spanning the input space."
- `#what-changed` — "Summarize what's changed in this diff, grouped by purpose, in 3 bullet points each."
- `#breaking-change-check` — "Read this diff. Is anything in the public API surface (exported types, function signatures, schema) modified in a backward-incompatible way?"

## Anatomy

```markdown
---
handle: snippet-name        # used as `#snippet-name` in the composer
description: One sentence — what this snippet does, when to use it.
metadata:
  type: snippet
  category: code | docs | review | debugging | misc
---

# Snippet title

Optional context paragraph.

## Prompt

The actual prompt the snippet inserts. Use `{{placeholder}}` for the user to fill in.
```

## Submission checklist

- [ ] `handle` is lowercase, kebab-case, unique.
- [ ] Description ≤ 80 chars.
- [ ] Prompt is the snippet, not commentary about the snippet.
- [ ] No real customer data, credentials, or internal URLs.
- [ ] Placeholders are obvious (`{{file_path}}`, `{{count}}`, etc.).
- [ ] Permissive license (MIT / Apache-2.0 / CC0).
- [ ] You've used it more than 5 times.

## What we won't accept

- Snippets that prompt-inject the agent ("ignore previous instructions…").
- Snippets that include real names, emails, IDs, or other PII.
- Snippets that are essentially "do this single niche task" — too narrow.
- Snippets that just paste a long Stack Overflow answer.

## How it ships

Same flow as everything else here — PR review → next AZMX release → every user. Authoring guide: [`guidelines/SNIPPET_AUTHORING.md`](../guidelines/SNIPPET_AUTHORING.md).

You retain copyright. No CLA. Permissive license to ship.
