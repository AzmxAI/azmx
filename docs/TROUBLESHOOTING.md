# Troubleshooting

> Problem → fix. Quick answers for things that come up.

If you can't find your issue, [search existing issues](https://github.com/AzmxAI/azmx/issues?q=is%3Aissue) or [open a new bug report](https://github.com/AzmxAI/azmx/issues/new/choose).

---

## Install + first run

### AZMX won't open after install (macOS)
Gatekeeper sometimes quarantines a freshly-downloaded `.dmg`. Right-click the app in `/Applications` → **Open** → "Open anyway". Subsequent launches work normally.

### "AZMX AI" cannot be opened because the developer cannot be verified
Run `xattr -d com.apple.quarantine /Applications/AZMX\ AI.app` once.

### Linux AppImage doesn't launch
`chmod +x AZMX-AI-*.AppImage` then `./AZMX-AI-*.AppImage`. If it still fails, you may be missing `libfuse2` (`sudo apt install libfuse2` on Ubuntu 22.04+).

### Windows SmartScreen blocks the installer
Click **More info → Run anyway**. The binaries are signed; Microsoft hasn't built reputation yet.

### App opens but the window is blank / white
Try `⌘⇧R` (or `Ctrl+Shift+R`) to hard-reload the renderer. If it persists, quit + reopen.

---

## AI panel

### The "Pondering…/Conjuring…" indicator says "initialize timed out after 15s" on an MCP server
This happens on first run when `npx -y <pkg>` is downloading the package. v0.22.2+ raised the initialize timeout to 90s. Update via Settings → About → Check for updates.

### "no model selected" or "Pick a model to start chatting"
Settings → Models → pick a provider, paste a key, choose a model. Or set up **Local AI · Ollama**.

### "Local-only AI" rejected my chat
You've enabled Settings → Security → Local-only AI but your selected model is a cloud provider. Either pick a local model (Ollama / LM Studio) or turn the lock off.

### Voice (mic button) does nothing
Voice transcription needs an **OpenAI API key** (uses OpenAI Whisper). Without one configured, the mic button no-ops. We're tracking a "use any local Whisper" feature.

### Agent says "Refused: AI tool cannot start a stdio MCP server"
Intentional — the AI agent can't spawn arbitrary processes via tool calls. Add the connector through **Settings → Connectors**.

---

## Connectors

### Kubernetes connector spawns but every tool errors
`kubectl` isn't on PATH. Install kubectl (`brew install kubectl`, or your platform's package). v0.22.2+ pre-flights this and refuses to spawn with an actionable error.

### GitHub connector says "auth required"
The token you provided is invalid or missing scopes. Re-issue at github.com/settings/tokens with `repo`, `read:org`, and `read:user` and re-paste.

### MCP server: "hasn't been trusted on this workspace yet"
A workspace `.azmx/mcp.json` server is trust-gated by integrity hash. Click **Trust + start** to add the hash and spawn. Re-prompted only if the binary or args change.

---

## Performance

### Indexing a large repo takes forever
Code-graph indexes 7 languages (Rust, TS/TSX, Python, Go, Java, C#, Swift). First-pass on a million-line repo can take a minute. Subsequent updates are incremental. Skip directories with a `.azmxignore` (same syntax as `.gitignore`).

### CPU pegged after switching themes
Stale renderer process. `⌘⇧R` to reload.

### "No space left on device" during `pnpm azmx build` (developers)
Orphan DMG mounts after interrupted macOS builds. Run `hdiutil detach -force /Volumes/AZMX\ AI*` and retry.

---

## License + updates

### License screen shows "signature verification failed" under "Pro · trial · 14 days left"
v0.22.1+ suppresses this stale-token warning during an active trial. Update.

### Auto-updater says "no update found" but a newer release exists
The updater hits `releases/latest/download/latest.json` once an hour and on launch. Force a check via **Settings → About → Check for updates**.

### Pro trial says fewer days than expected
The trial is endowed on first hydrate (the moment AZMX first loads its settings store). If you re-installed, your existing trial state persists — uninstall doesn't reset it.

---

## Data + privacy

### Where do my API keys live?
`secrets.json` in the AZMX data dir (`~/Library/Application Support/app.azmx.ai/` on macOS, `~/.config/app.azmx.ai/` on Linux, `%APPDATA%\app.azmx.ai\` on Windows). Mode `0600` (user-only). Never the OS keychain.

### How do I wipe everything?
Delete the data dir. AZMX boots fresh on next launch.

### How do I move my setup to a new machine?
**Settings → Data → Encrypted backup** with a passphrase you remember. Move the file (USB, iCloud, Dropbox — your call). On the other machine: **Restore from encrypted backup**, paste the same passphrase, preview, accept.

---

## Where to go next

- [`SETUP.md`](../SETUP.md) — install steps per platform
- [`MANUAL.md`](../MANUAL.md) — full reference
- [`FAQ.md`](../FAQ.md) — broader Q&A
- [Open an issue](https://github.com/AzmxAI/azmx/issues/new/choose) — if none of the above helps
