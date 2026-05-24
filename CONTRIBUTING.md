# Contributing

> **AZMX AI — The sovereign agent platform.**

The application source is **proprietary** and not hosted here — this repository exists to publish release artifacts and user documentation. So "contributing" to this repo means engaging with the docs, releases, and issue tracker. Code contributions land in the upstream private repo and ship to you through the auto-updater.

Here's how to be most useful.

## File a great bug report

- Use the [Bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) — it asks for the exact fields we need.
- Include your **AZMX version** (Settings → About), **operating system + version**, and **AI provider** in use when the bug happened.
- Paste the **last ~20 lines of the agent audit log** (Settings → Privacy → Agent audit log → View recent) — never paste API keys; they shouldn't appear in the log, but redact anything that does.
- A 3-step reproduction beats a long paragraph.

## Suggest a feature

- Use the [Feature request template](.github/ISSUE_TEMPLATE/feature_request.yml).
- Lead with the **user pain**, not the proposed solution. We've shipped many features whose final shape looked nothing like the original suggestion — but the underlying problem was real.
- For sweeping ideas, [open a Discussion](https://github.com/AzmxAI/azmx/discussions) first. PRs and shipped features start from clear problems.

## Improve the docs

If you spot a typo, broken link, outdated screenshot, or unclear paragraph in any of:

- [`README.md`](README.md), [`SETUP.md`](SETUP.md), [`MANUAL.md`](MANUAL.md), [`FAQ.md`](FAQ.md)
- Any file under [`docs/`](docs/)

…open a PR against this repo. Doc-only changes ship instantly (no release cycle).

## Share a recipe

[`docs/RECIPES.md`](docs/RECIPES.md) is a community-driven cookbook of "how I used AZMX to do X." If you've got a workflow worth showing, send a PR adding a section. Examples that landed because someone like you wrote them:

- Drafting a release commit
- Debugging an OOM with `nvidia-smi`
- Onboarding a new repo with `/init`

## Report a vulnerability

**Privately**, to **security@azmx.app**. See [`SECURITY.md`](SECURITY.md). Never as a public issue or PR comment.

## Be kind

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Disagree with the work, not the person.

## Translate the onboarding card

AZMX seeds 5 languages out of the box (English, Mandarin, Hindi, Spanish, Arabic). If you'd like to add yours — we'd love that. Open a Discussion or a Feature request and we'll route the translation strings to you.

## Things we don't accept here

- Source-code PRs targeting application internals (the source isn't in this repo)
- Reposts of issues already filed
- Promotional content unrelated to AZMX
- Anything that violates the Code of Conduct
