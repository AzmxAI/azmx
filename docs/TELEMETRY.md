# Telemetry

> The short version: **off by default, everywhere, forever.**

## What is collected by default

Nothing.

- No "anonymous usage stats."
- No crash reports.
- No performance beacons.
- No "first run" ping.

Not in the Free tier, not in Pro, not in Teams, not in Enterprise.

## What is collected when you opt in

**Settings → Privacy → "Anonymous usage analytics"** is a single toggle (off by default). Turned on, it sends a tiny stream describing **which features get opened** — never their content:

- Counts of feature opens (the AI panel, the file explorer, the settings tab)
- Slash-command names (which `/init`, `/commit`, `/review` got used)
- Provider chosen (so we know which providers people actually use)

It never includes:

- Prompts, completions, file content, file paths, terminal output, keystrokes
- API keys, license tokens, device IDs that link back to you
- Time stamps precise enough to deanonymize
- Anything that can identify you

You can turn it off at any time and what was already sent is gone.

## Network traffic with telemetry off

| Reason | Where |
|---|---|
| You sent the AI a message | Your chosen provider (directly, no AZMX-side hop) |
| You configured a connector that talks to a network endpoint | That endpoint |
| AZMX checked for a software update | `releases/latest/download/latest.json` on this repo |
| You activated / refreshed a paid license | The license issuer (`azmx.ai/activate` or your self-hosted issuer) |
| You enabled cross-device sync (Pro) | E2E-encrypted blob upload to our R2 bucket — server holds ciphertext only |

That's the full list. If you want zero outbound, turn on **Local-only AI** (refuses every cloud provider) and **Software updates → Manual** (disables the periodic update check).

## How to verify

- **Settings → Privacy & network** shows every feature that can reach the network and its current state. Read-only summary derived from your actual settings.
- **macOS / Linux / Windows firewall** — block AZMX at the OS layer. We're designed to survive exactly that test (the work plane — terminal, shell, files — is local-only by design and doesn't touch the network).

## Why we built it this way

A developer's terminal sees everything they do. A telemetry stack on a terminal is a privacy single point of failure. We'd rather measure adoption with downloads + organic discussion than by watching what you type.

If "did this feature get used at all" is a question we can't answer without telemetry, we ask the community — directly, in Discussions — rather than backdooring it.

## Audit log vs telemetry

Note: the **agent audit log** is local-only. It records every tool the agent invokes for your review (and SIEM export on paid tiers). It does **not** leave your machine unless you export it yourself.
