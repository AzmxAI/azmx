# Security

> **AZMX AI — The sovereign agent platform.**

AZMX runs shells, reads and writes files, and talks to AI providers — so security matters and we treat it like it does. If you find a vulnerability, report it privately first.

## Reporting a vulnerability

Email **security@azmx.app**. Include:

- What the issue is and what it lets an attacker do
- Steps to reproduce (a small proof-of-concept goes a long way)
- The AZMX version, your OS, and architecture

You'll get an acknowledgement within **24 hours** and a status update within **7 days**. Once the issue is fixed we credit you in the release notes — unless you'd rather stay anonymous.

**Please don't open a public GitHub issue for a security finding.**

## Supported versions

Only the latest minor receives security fixes. Today that's **0.22.x**. Older versions are end-of-life from a security perspective and we don't backport patches there.

## What's in scope

- The shipped AZMX AI app — anywhere untrusted input lands (terminal output, file content, AI tool results, credentials)
- Release artifacts on `github.com/AzmxAI/azmx` and `azmx.ai`
- The auto-updater
- The public `azmx.ai` website + its operator surfaces

## What's not

- Bugs in upstream dependencies (xterm.js, CodeMirror, the AI SDKs, the system webview, etc.) — report those upstream. We'll ship the fix once it's released.
- Anything that needs an already-compromised machine or a local attacker with shell access
- Older versions (< 0.20)
- Social engineering of users or operators

## How AZMX defends you

- **API keys** live in a user-only (`0600` on Unix, ACL-restricted on Windows) app-local `secrets.json` — never in the OS keychain, `localStorage`, plain settings, or logs.
- **No telemetry by default.** AZMX only talks to the network when you ask it to (AI requests, update checks, the web preview window).
- **Per-call approval gates.** Writes and shell commands from the agent need your OK before they run (configurable: Permissive · Standard · Strict · Paranoid).
- **Built-in secret-path screen.** Reads and writes against `.env`, `.ssh/*`, `credentials*`, and similar are refused at the OS layer.
- **No Node in the renderer.** The UI only reaches the host through an allow-listed set of native commands.
- **Hash-chained audit log.** Every agent tool call is recorded locally and tamper-evident. Export to SIEM on the paid tiers.
- **Local-only AI lock.** Settings → Security → "Local-only AI" refuses every cloud provider so the only path out for an AI request is an on-device model.
- **Signed releases.** Updates are verified before they're applied. The auto-updater pins an embedded Ed25519 public key.

## What we can't promise

- AZMX runs whatever you (or the agent) tell it to run, with your permissions. That's the point of a terminal.
- AI providers see whatever you send them. Read their retention policies.
- Local LLM endpoints (LM Studio, OpenAI-compatible) are trusted at the network level — only point AZMX at servers you control.

For more on the security model, see [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md) and the public [security page](https://azmx.ai/security).
