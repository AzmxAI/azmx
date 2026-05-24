# Roadmap

> Themes we're working on. Concrete dates aren't promises — software ships when it's ready.

What follows is the public-facing roadmap. Internal sequencing, PR numbers, and code paths aren't here on purpose.

## Now (next ~6 weeks)

- **Inline polish + onboarding.** The post-install "First steps" card landed in v0.22.5 (multilingual: en/zh/hi/es/ar). Next: more languages, smarter detection of "you're ready to chat now."
- **MCP install hardening.** First-run `npx` package fetch can exceed the initialize timeout. Bumped to 90s in v0.22.2; tracking telemetry-free anonymous reports to decide if 90s is enough.
- **Per-connector pre-flight.** v0.22.2 added `kubectl` precheck on the Kubernetes connector. Extending to `aws`, `gcloud`, `psql`, `redis-cli`.
- **Public docs sweep.** This roadmap, the recipes, the glossary, the troubleshooting tree — keeping them current is its own engineering work.

## Soon (next ~3 months)

- **Voice without OpenAI.** Voice transcription currently requires an OpenAI key (uses Whisper). Wiring a path that uses a local Whisper or any compatible STT endpoint.
- **Cross-device sync UX.** E2E sync ships today (Pro). The setup flow + the recovery story are getting a friendlier wrapper.
- **Workspace-level shortcut overrides.** Pin specific keybindings per project. Same primitive as org-policy, scoped to a folder.
- **More languages in the onboarding card.** Bengali, Indonesian, Korean, Japanese, German, French, Portuguese, Russian (covers the next ~2 billion native speakers).
- **A "Get started" landing.** Two big buttons after the welcome tour: "Set up a model" (deep-link Settings) and "Open a folder" (trigger ⌘O).

## Later (this year)

- **Process sandbox.** macOS `sandbox-exec`, Linux `landlock`, Windows Job Objects — defense-in-depth on top of the per-call approval gate.
- **Customer-rooted issuer trust** for Enterprise — already shipping, refining the operator experience for offline issuance + renewal.
- **Compliance pack v2.** SOC 2 Type II attestation refresh, PIV/CAC challenge hardening, FIPS 140-3 module updates.
- **Team registry v2.** Shared skills + agents + macros + MCP connectors across a team, with per-team review.

## Direction (longer horizon)

These are themes, not commitments:

- **The agent stays on your machine.** Not a SaaS. Not a hosted "AZMX cloud." The product is the desktop app + the operator surfaces that don't compromise that.
- **Local model parity with cloud.** The gap is closing — Qwen, Llama, Granite, DeepSeek-Code, Mistral. We want the Free path to be excellent, not a teaser for Pro.
- **More languages, more inclusivity.** The onboarding card is a small example; the principle is broader.
- **Less ceremony.** Every release should remove a thing that didn't need to be there.

## What's NOT on the roadmap

For clarity:

- **A cloud AZMX backend that proxies AI requests.** No. Provider-direct stays.
- **Account-required free tier.** No. Free is no-account, forever.
- **Telemetry-on-by-default.** No. Off is the floor.
- **Selling AI inference.** No. Bring your key, run local, your call.

## Influence the roadmap

[Feature requests](https://github.com/AzmxAI/azmx/issues/new/choose) and [Discussions](https://github.com/AzmxAI/azmx/discussions) directly shape the queue. Concrete user pain wins.
