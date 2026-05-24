# Contributing a recipe

> A recipe shows other users how to use AZMX to do something real. It's a snippet of your actual workflow, polished for reuse.

## What a recipe is

- **One workflow, end-to-end.** Not "tips for working faster" — "Draft a release commit in 30 seconds."
- **Concrete commands, not theory.** Show the exact slash command, the exact prompt, the exact result shape.
- **Real, not hypothetical.** If you haven't actually used it on real work, don't add it.
- **3–15 lines.** Recipes are crisp. If yours grows past a half-screen, it's probably a guide, not a recipe.

## Where they live

[`docs/RECIPES.md`](../docs/RECIPES.md) — a single Markdown file that grows over time.

## Shape

```markdown
## Recipe title — present-tense imperative

One sentence: what this recipe does, when you'd use it.

```text
/some-command
@some-file
```

What the agent does in plain language. Surface anything non-obvious.

(Optional) When NOT to use this recipe.
```

## Tone

- Crisp. The reader wants to copy + paste.
- One reader, present tense. "Press ⌘I → click Explain the last error" not "the user can…"
- No internal AZMX detail (no IPC names, no internal module paths).

## Quality bar

- **You've used it.** Not "this might work" — "I used this Tuesday."
- **Reproducible.** Anyone with a similar setup can follow the same steps and get a similar result.
- **Doesn't depend on a paid tool you didn't disclose.** If your recipe needs GitHub Copilot or Sentry or Linear, call it out up front.
- **Doesn't reveal a secret.** No tokens, no real customer paths, no internal hostnames.

## Categories that the cookbook is missing

Open opportunities (write one!):

- "Onboard a new developer to a codebase"
- "Refactor a function with the agent + a test as the contract"
- "Find every consumer of a deprecated API"
- "Triage 50 GitHub issues by labelling them with the agent"
- "Generate a Terraform plan from a system description"
- "Write a migration that's safe to ship"
- "Diff two large JSON files semantically"
- "Build a one-shot script to answer a one-time question"

If you have one of these, send it in.

## Submitting

1. Fork this repo.
2. Add your section to `docs/RECIPES.md`.
3. Open a PR titled `recipe: <title>`.
4. In the PR description: link to a thread / screenshot / clip showing you actually using it (optional but appreciated).

## What we won't accept

- Recipes that prompt-inject to bypass safety gates.
- Recipes that auto-approve a destructive command class wholesale.
- Pure-fiction recipes (you haven't run them).
- Recipes targeting a deprecated AZMX version.

## After it lands

Your recipe ships in the next minor release. We'll mention it in release notes. The cookbook is community-driven — your recipe might inspire the next one.
