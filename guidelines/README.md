# Guidelines

> Authoring standards for every kind of contribution that lands here. Read the relevant guide before opening a PR.

## What's in this folder

| Guide | For | Length |
|---|---|---|
| [`MCP_AUTHORING.md`](MCP_AUTHORING.md) | Adding an MCP server to the community catalog | ~5 min read |
| [`SKILL_AUTHORING.md`](SKILL_AUTHORING.md) | Writing a skill the agent can load | ~5 min read |
| [`TRANSLATIONS.md`](TRANSLATIONS.md) | Translating the onboarding card into a new language | ~3 min read |
| [`RECIPES_AUTHORING.md`](RECIPES_AUTHORING.md) | Adding a recipe to the cookbook | ~3 min read |
| [`DOCS_STYLE.md`](DOCS_STYLE.md) | House style for prose / Markdown across this repo | ~3 min read |

## Principles

These hold across every contribution:

1. **No internal code, no secrets, no critical security detail.** This is a public repo. Don't paste a real token even if it's been rotated. Don't reveal endpoint paths, signing-key handling, license format internals, IPC command names, or anything an attacker could weaponize.

2. **Permissive licenses only.** MIT, Apache-2.0, BSD, ISC, CC0 are fine. AGPL / GPL / proprietary content can't ride the bundled catalog.

3. **Stand-alone.** Every example, skill, manifest, or recipe should make sense on its own — no "see the private repo for the full version."

4. **Honest scope.** If a skill only works in 80% of cases, say so. If a manifest needs a paid API key on the user's side, say so up front.

5. **Plain language.** The audience is a developer who hasn't seen this repo before. Optimize for first-read comprehension, not insider density.

6. **Permissively licensed examples only.** If you reference an external library, it must be permissively licensed (MIT/Apache-2.0/BSD/ISC) or you must own the copyright.

## How review works

Every PR is reviewed by a maintainer for:

- Safety (no secret leaks, no malicious behavior in MCP servers, no jailbreak prompts in skills)
- Quality (writing is clear, examples are real, anti-patterns are listed)
- Fit (does this belong in the bundled distribution — or is it niche enough to keep in workspace `.azmx/`)

Approved contributions ship in the next AZMX release. Your contribution reaches every user worldwide on next update.

## What gets rejected

- Anything that quietly weakens the agent's safety floor.
- Anything that promotes one vendor unfairly (we're provider-agnostic).
- Translations done with machine translation only, without a native-speaker review.
- Forks of bundled content with cosmetic changes.
- Anything you don't have the right to contribute.

## Credit

Contributions are credited in:

- The relevant release notes when the contribution first ships.
- The bundled file's own header (`# Contributed by @your-handle`).
- The annual community thank-you post on `azmx.ai/blog`.

We don't require a CLA. You retain copyright on what you submit; you grant us a permissive license to ship it.

## Help

- Stuck on a guideline? [Open a Discussion](https://github.com/AzmxAI/azmx/discussions).
- Found an error in a guideline? Open a PR fixing it — we'd appreciate it.
- Have an idea for a new guideline? Same.
