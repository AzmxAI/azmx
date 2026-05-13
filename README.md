<div align="center">
  <h1>AZMX AI</h1>
  <p><strong>A fast, local-first AI terminal for macOS, Linux, and Windows.</strong></p>
  <p>
    <a href="https://github.com/drvt69talati/azmx-ai-releases/releases/latest">Download latest</a> ·
    <a href="MANUAL.md">User manual</a> ·
    <a href="SETUP.md">Install & setup</a> ·
    <a href="FAQ.md">FAQ</a>
  </p>
</div>

---

AZMX AI is a native AI-first terminal that **works out of the box with free local models** — no API key, no signup, no cloud roundtrip. It pairs a real PTY backend with a modern UI: multi-tab terminals, an integrated code editor, a file explorer, and a first-class AI side-panel.

Bring your own key from any major provider, or run free models locally via Ollama. The installer is ~10 MB. API keys live in your OS keychain. Telemetry is off by default.

> The application source is proprietary and not hosted here. **This repository exists only to publish release artifacts.** Installers and the auto-updater manifest are attached to each tagged release.

---

## Why AZMX

- **Free local AI without an API key.** One-click setup of Ollama + curated coding models (Qwen2.5-Coder, Granite Code — all Apache 2.0). Your prompts never leave the machine.
- **Or BYOK.** OpenAI, Anthropic, Google, Groq, xAI, Cerebras, DeepSeek — any one is enough to start. Keys live in the OS keychain, never in disk files or `localStorage`.
- **Native, lightweight.** ~10 MB installer. No Electron. No telemetry by default.
- **Real terminal, real editor, real explorer.** xterm.js+WebGL terminal, CodeMirror 6 editor with vim mode + inline AI autocomplete, file tree with git status badges.
- **MCP-native.** Bundled HTTP/SSE transport, curated catalog (GitHub, Postgres, Slack, Filesystem, …), keychain-backed secrets per server. Auto-imports `.mcp.json` and `~/.claude.json`.
- **Claude Code interop.** Reuses your `AZMX.md` / `CLAUDE.md` / `AGENTS.md`, `.claude/agents/*.md`, `.claude/commands/*.md`, and `.claude/settings.json` hooks. Drop AZMX into a project where Claude Code already lives — it adopts the config.

---

## Download

Pick the installer for your platform from the **[latest release](https://github.com/drvt69talati/azmx-ai-releases/releases/latest)**:

| Platform | File |
| --- | --- |
| macOS (Apple Silicon) | `AZMX.AI_<version>_aarch64.dmg` |
| macOS (Intel) | `AZMX.AI_<version>_x64.dmg` |
| Linux | `AZMX.AI_<version>_amd64.AppImage`, `.deb`, or `.rpm` |
| Windows | `AZMX.AI_<version>_x64_en-US.msi` or `*_x64-setup.exe` |

Need help installing? See **[SETUP.md](SETUP.md)** for per-platform walkthroughs.

---

## First-run in under 3 minutes

1. Open AZMX AI.
2. The first-run tour appears. On step **"Free local AI"**, click **Set up local AI**.
3. AZMX walks you through installing [Ollama](https://ollama.com) (~150 MB).
4. Pick **Qwen2.5-Coder 7B** (default — ~4.7 GB, Apache 2.0). The pull streams in-app.
5. When the bar turns green, the AI panel is live. Ask anything.

Prefer BYOK? Skip step 2's button and use the BYOK step instead. Both paths land at a working composer.

---

## Documentation

| Document | Purpose |
| --- | --- |
| **[SETUP.md](SETUP.md)** | Install per platform, troubleshooting, first-run setup |
| **[MANUAL.md](MANUAL.md)** | Full end-to-end feature reference — every panel, every shortcut, every workflow |
| **[FAQ.md](FAQ.md)** | Common questions: privacy, licensing, performance, model recommendations, integrations |
| **[CHANGELOG](https://github.com/drvt69talati/azmx-ai-releases/releases)** | What changed in each release |

---

## Auto-updates

AZMX checks for updates on launch. New versions land via the in-app updater — no need to revisit this page once you're installed. Signed via a public minisign key bundled with the app.

---

## License

AZMX AI is free to download but proprietary. By installing the application you agree to the End User License Agreement that ships with it. The release artifacts are signed; the source repository is private.

## Support

- **Manual / FAQ**: see the links above.
- **Bugs**: open an issue against this repository — include OS, AZMX version, and steps to reproduce.
