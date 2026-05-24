# Privacy

> **AZMX AI — The sovereign agent platform.**

The short version: **AZMX doesn't collect telemetry, doesn't have an account system in the free path, and never sees the contents of your terminal, files, or AI prompts.** Your local data stays local.

This file summarizes the privacy posture. The legally-binding document is the [Privacy Policy on azmx.ai](https://azmx.ai/privacy).

## What we don't collect

- **No usage analytics.** Off by default — there's a per-feature toggle in Settings → Privacy → "Anonymous usage analytics", and even enabled it carries nothing about the content of your work.
- **No filesystem reads.** AZMX never sends file content, file lists, paths, or directory structures off your machine.
- **No terminal capture.** Shell input, shell output, and PTY sessions stay on the machine.
- **No prompt logging on our side.** Your AI prompts go directly from your machine to your chosen AI provider — never through AZMX's infrastructure.
- **No keystroke logging.** Period.
- **No browser-style cross-site tracking.** The app doesn't even *have* a web profile to track.

## What we do collect (and when)

Network traffic from AZMX happens only when one of these is true:

1. **You ask the AI panel a question.** The request goes from your machine directly to the AI provider you configured (OpenAI, Anthropic, Google, Ollama, etc.). AZMX is not on the network path.
2. **A signed update check.** The app periodically checks `releases/latest/download/latest.json` against this repo to see if there's a newer version. Standard HTTPS — only the version metadata, no user content.
3. **You explicitly enable a connector** (GitHub, Kubernetes, AWS, Slack, an MCP server). Then the connector talks to its target. AZMX is the client; we don't sit in the middle.
4. **License activation / refresh** (paid tiers only). When you activate Pro/Teams/Enterprise, your device exchanges a one-time receipt for a signed license token with our license issuer. After that the device verifies the token offline.
5. **Cross-device sync** (Pro+). End-to-end encrypted bundles uploaded to our blob storage. Our storage never holds your encryption key.

That's it. No event stream, no session beacons, no Mixpanel, no Sentry, no Segment.

## What lives on your machine

| Item | Where |
|---|---|
| API keys (BYOK) | `secrets.json` — `0600`, user-only, in the AZMX data dir |
| License token | `license.json` — same dir, same mode |
| Sessions, settings, todos, snippets, memory tree | Plain JSON files in the AZMX data dir |
| Agent audit log | `azmx-audit.json` — hash-chained, tamper-evident |
| Code-graph + semantic index | `~/.cache/azmx/` — your code's symbols, never sent off-device |

Data directory paths:
- **macOS**: `~/Library/Application Support/app.azmx.ai/`
- **Linux**: `~/.config/app.azmx.ai/`
- **Windows**: `%APPDATA%\app.azmx.ai\`

## Your data, your move

- **Export** — Settings → Data → "Export all data" writes one JSON bundle (no API keys; keys never leave the device).
- **Encrypted backup** — same screen, encrypted with your passphrase. Move the file via iCloud / Dropbox / Syncthing / USB — your call.
- **Restore** — paste an encrypted backup; preview before overwrite.
- **Wipe** — delete the data dir; AZMX boots fresh on next launch.

## Cookies (azmx.ai website)

The public website doesn't set tracking cookies. The only cookie set is a CSRF token on the activation flow page, which clears when you close the tab.

## DPA / SOC 2 / processor list

Available on request via **privacy@azmx.app** for Teams + Enterprise customers.

## Contact

**privacy@azmx.app** for any question or request (access, deletion, correction).
