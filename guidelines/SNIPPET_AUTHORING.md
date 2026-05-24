# Authoring a snippet

> Snippets are short prompt templates accessible from the composer with `#name`. Optimize for the 90% case you keep retyping.

## When a snippet is the right shape

You've typed the same paragraph at the start of an AI message more than 5 times. Make it a snippet.

Not every habit deserves a snippet. The bar:

- **Reusable across projects.** "Explain a code file" — yes. "Explain this specific repo" — no, just write it once.
- **Saves > 10 seconds.** A one-word snippet isn't a snippet.
- **Doesn't lose meaning when parameterized.** Some tasks need full context every time; a snippet would over-generalize them.

## Anatomy

```markdown
---
handle: rubber-duck            # used as `#rubber-duck` in the composer
description: One sentence — what this snippet does, when to use it.
metadata:
  type: snippet
  category: code | docs | review | debugging | misc
---

# Snippet title

Optional context paragraph for the catalog page.

## Prompt

The actual text inserted into the composer when the user picks this snippet.
Use {{placeholders}} for parts the user fills in.
```

## Categories

- **code** — generation, refactoring, explanation
- **docs** — writing, summarizing, restructuring
- **review** — checking code or text for issues
- **debugging** — finding and fixing problems
- **misc** — everything else

Pick one. If a snippet crosses two, pick the more salient one.

## Placeholders

Use `{{name}}` for user-fillable blanks. The user sees the snippet in the composer and edits the placeholders before sending.

```markdown
## Prompt

Read {{file_path}} and propose tests covering the happy path and 3 edge cases.
Use the project's existing test framework (look at sibling test files).
```

Conventions:

- `{{file_path}}` — single file
- `{{function_name}}` — symbol
- `{{count}}` — a number
- `{{language}}` — a language name
- `{{audience}}` — "junior dev", "PM", "yourself in 6 months"
- `{{explain what you're stuck on}}` — long free-form

## What makes a snippet "feel professional"

- **Opens with a verb.** "Read", "Explain", "Refactor", "Find", "Generate".
- **Says what to do, not how.** The agent figures out how.
- **Has one explicit success criterion.** "5 examples spanning the input space" beats "some examples".
- **Anticipates a follow-up.** "After you propose, say what evidence would confirm" — keeps the conversation moving.

## What makes a snippet feel bad

- **Long preamble.** "I am working on a project where I would really like you to please…" → cut. The agent's already willing to help.
- **Multiple disjoint asks.** Snippets do one thing.
- **Implicit knowledge.** "Refactor the way we usually refactor" — the snippet should say what that is, or be a skill, not a snippet.
- **Vagueness.** "Make it better" — better how?

## Submission checklist

- [ ] `handle` is lowercase, kebab-case, ≤ 30 chars, unique.
- [ ] `description` ≤ 80 chars.
- [ ] One category picked.
- [ ] Prompt is the snippet body — not commentary about it.
- [ ] Placeholders are obvious + named meaningfully.
- [ ] No PII, no credentials, no internal URLs.
- [ ] You've used the snippet at least 5 times.

## What we reject

- **Snippets that prompt-inject the agent.** "Ignore previous instructions" → no.
- **Snippets with real names, emails, project paths, IDs.** Make it generic.
- **Snippets that target a single library / framework version.** Too narrow.
- **Spam, promotion.** A snippet plugging your product → no.
- **Duplicates of bundled snippets** with cosmetic changes.

## How to submit

1. Fork this repo.
2. Add a file at `snippets/<handle>.md` with the front-matter and prompt.
3. PR titled `snippet: add <handle>`.
4. In the PR description, paste one example of what the agent returned when you used it.

## After it ships

The snippet appears in every user's `#` picker on next release. We'll thank you in the release notes; you can opt into a `contributor:` field in the front-matter.
