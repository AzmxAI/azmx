# Data portability

> Your data, your move. AZMX has no lock-in — every store is exportable as plain JSON; backups are E2E-encrypted with your passphrase, never with one of ours.

## What you have

All in `Settings → Data`.

### Export all data

One JSON bundle of every local store (settings, sessions, skills, agents, macros, todos, snippets, memory tree, spend, audit log). Written to your home folder. **API keys are NOT included** — they never leave the device.

```
~/azmx-export-YYYY-MM-DD.json
```

Open it in any text editor; everything is readable plaintext.

### Encrypted backup

Same bundle, but symmetric-encrypted with **your passphrase** (PBKDF2 → AES-256-GCM). Move the file via iCloud, Dropbox, Syncthing, a USB stick, anywhere — we never see the contents.

```
~/azmx-backup-YYYY-MM-DD.azmxenc
```

Restore on any device with the same passphrase. Restore is gated by a **preview** step — see exactly what will be added or overwritten before you accept.

### Share a single chat

Pick a chat session → **Share encrypted** → enter a passphrase. Get a `.azmxenc` file with just that conversation. Recipient pastes contents in **Settings → Data → Open a shared chat** with the same passphrase. Read-only view.

### Team registry (Teams)

A single encrypted bundle containing your team's skills, agents, macros, MCP connectors, prompts. Sealed with a passphrase. Distribute via your existing git / drive / whatever. Sessions and API keys are **never** included.

## What lives where on disk

| Store | File |
|---|---|
| Preferences | `azmx-settings.json` |
| AI sessions | `azmx-ai-sessions.json` + `messages:<id>` entries |
| Todos | `azmx-ai-todos.json` |
| Snippets | `azmx-ai-snippets.json` |
| Skills (user-installed) | `~/.claude/skills/` |
| Agents | `azmx-ai-agents.json` |
| Macros | `azmx-ai-macros.json` |
| Recent projects | `azmx-recent-projects.json` |
| MCP configs | `azmx-mcp.json` |
| MCP hook trust | `azmx-ai-hook-trust.json` |
| SSH hosts | `azmx-ssh-hosts.json` |
| Spend tracker | `azmx-ai-spend.json` |
| Memory tree (global) | `~/.azmx/memory-global/` |
| Memory tree (workspace) | `<workspace>/.azmx/memory/` |
| Code-graph index | `~/.cache/azmx/code-graph/` |
| Semantic search | `~/.cache/azmx/semantic/` |
| Audit log | `azmx-audit.json` (hash-chained) |
| License | `license.json` (0600) |
| API keys | `secrets.json` (0600) |

Base data dir:
- **macOS**: `~/Library/Application Support/app.azmx.ai/`
- **Linux**: `~/.config/app.azmx.ai/`
- **Windows**: `%APPDATA%\app.azmx.ai\`

Everything is **plain JSON** except `secrets.json`, `license.json` (both JSON, but mode 0600), and the cache indices.

## Move between machines

The simplest path: copy the entire data dir over. The whole thing is portable:

```bash
# Source machine — make a copy
rsync -av "$HOME/Library/Application Support/app.azmx.ai/" /Volumes/USB/azmx-data/

# Target machine — drop it back
rsync -av /Volumes/USB/azmx-data/ "$HOME/Library/Application Support/app.azmx.ai/"
```

API keys carry over (you're moving the file). License token carries over (it's pinned to your device-key, so it'll re-verify automatically when AZMX boots).

## Cross-device sync (Pro)

For continuous sync (not just a one-time move), enable **Settings → Sync → Cross-device sync**. End-to-end encrypted with your passphrase, our blob storage holds opaque ciphertext only. 2 devices on Pro.

## Hard delete

To wipe everything and walk away: delete the data dir. AZMX boots fresh on next launch (welcome tour, no sessions, no keys, no memory). See [`UNINSTALL.md`](UNINSTALL.md) for full removal.
