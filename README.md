<div align="center">
  <h1>AZMX AI</h1>
  <p><strong>The sovereign agent platform.</strong></p>
  <p>
    <a href="https://github.com/AzmxAI/azmx/releases/latest">Download</a> ·
    <a href="SETUP.md">Install</a> ·
    <a href="MANUAL.md">Manual</a> ·
    <a href="FAQ.md">FAQ</a> ·
    <a href="#extend-azmx">Extend AZMX</a>
  </p>
</div>

---

AZMX AI is a native AI-first terminal that **works out of the box with free local models** — no API key, no signup, no cloud roundtrip. It pairs a real PTY backend with a modern UI: multi-tab terminals, an integrated code editor, a file explorer, and a first-class AI side-panel.

Bring your own key from any major provider, or run free models locally via Ollama. The installer is ~10 MB. API keys live in a user-only (`0600`) app-local file — never in the OS keychain, `localStorage`, or plain settings. Telemetry is off by default.

> The application source is proprietary and not hosted here. **This repository exists only to publish release artifacts.** Installers and the auto-updater manifest are attached to each tagged release.

---

## Why AZMX

- **Free local AI without an API key.** One-click setup of Ollama + curated coding models (Qwen2.5-Coder, Granite Code — all Apache 2.0). Your prompts never leave the machine.
- **Or BYOK.** OpenAI, Anthropic, Google, Groq, xAI, Cerebras, DeepSeek, **NVIDIA NIM** (hosted at build.nvidia.com or self-hosted), **Azure OpenAI** (any resource + deployment), and any other OpenAI-compatible endpoint (Vertex AI, Bedrock-via-LiteLLM, …) — any one is enough to start. Keys live in a private user-only (`0600`) app-local file — never in the OS keychain, plain settings, or `localStorage`.
- **GPU-aware agent.** When you're on an NVIDIA machine the agent can read live GPU state via `nvidia-smi` — debug OOM, pick a batch size, fit a model to your VRAM.
- **Native, lightweight.** ~10 MB installer. No Electron. No telemetry by default.
- **Real terminal, real editor, real explorer.** xterm.js+WebGL terminal, CodeMirror 6 editor with vim mode + inline AI autocomplete, file tree with git status badges.
- **MCP-native.** Bundled HTTP/SSE transport, curated catalog (GitHub, Postgres, Slack, Filesystem, …), keychain-backed secrets per server. Auto-imports `.mcp.json` and `~/.claude.json`.
- **Claude Code interop.** Reuses your `AZMX.md` / `CLAUDE.md` / `AGENTS.md`, `.claude/agents/*.md`, `.claude/commands/*.md`, and `.claude/settings.json` hooks. Drop AZMX into a project where Claude Code already lives — it adopts the config.

---

## Download

Pick the installer for your platform from the **[latest release](https://github.com/AzmxAI/azmx/releases/latest)**:

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

<a id="extend-azmx"></a>

## 🛠 Extend AZMX

**Your contribution ships to every AZMX user worldwide on next release.** No CLA. You keep copyright. You grant a permissive license. The bundled distribution gets richer every month because of community work.

Five surfaces, every one of them a single Markdown (or JSON) file:

| Build a … | What it is | Where to start |
|---|---|---|
| 🤖 **Skill** | A discipline the agent loads on demand to act like a domain expert (e.g. "Postgres query review"). One Markdown file. | [`skills/`](skills/) → [`SKILL_AUTHORING.md`](guidelines/SKILL_AUTHORING.md) |
| 🧑‍🚀 **Sub-agent** | A specialist the main agent delegates to, with bounded tools + predictable output (e.g. `test-writer`, `migration-planner`). | [`agents/`](agents/) → [`AGENT_AUTHORING.md`](guidelines/AGENT_AUTHORING.md) |
| 🔌 **MCP connector** | A new tool the agent can call — bridge to your service, your data, your internal CLI. | [`mcp-servers/`](mcp-servers/) → [`MCP_AUTHORING.md`](guidelines/MCP_AUTHORING.md) |
| ✨ **Snippet** | A pre-baked prompt template accessible via `#name` in the composer. | [`snippets/`](snippets/) → [`SNIPPET_AUTHORING.md`](guidelines/SNIPPET_AUTHORING.md) |
| 🌍 **Translation** | The onboarding card in your language — 5 seeded, ~10 priority next. | [`TRANSLATIONS.md`](guidelines/TRANSLATIONS.md) |

**Plus:** add a [recipe](docs/RECIPES.md) to the cookbook, fix a doc, or [showcase](guidelines/SHOWCASE.md) someone else's work.

Every contributor gets credit in release notes. Featured contributors get a complimentary Pro license; repeat featured contributors get Teams. **[Read the principles →](guidelines/README.md)**

---

## Documentation

### Get started
| | |
| --- | --- |
| **[SETUP.md](SETUP.md)** | Install per platform · first-run setup |
| **[MANUAL.md](MANUAL.md)** | Full feature reference — every panel, every shortcut |
| **[FAQ.md](FAQ.md)** | Common questions on privacy, licensing, performance, models |
| **[CHANGELOG.md](CHANGELOG.md)** | Release notes (per-version detail on the releases page) |

### Reference
| | |
| --- | --- |
| **[docs/TIERS.md](docs/TIERS.md)** | What's in Free / Pro / Teams / Enterprise |
| **[docs/MODELS.md](docs/MODELS.md)** | Supported AI providers · BYOK · local models |
| **[docs/CONNECTORS.md](docs/CONNECTORS.md)** | The bundled MCP catalog · custom + workspace MCP |
| **[docs/AGENTS.md](docs/AGENTS.md)** | What the agent can + can't do · approval gates · audit log |
| **[docs/KEYBINDINGS.md](docs/KEYBINDINGS.md)** | Every shortcut, by category |
| **[docs/RECIPES.md](docs/RECIPES.md)** | Workflow cookbook — copy + adapt |
| **[docs/GLOSSARY.md](docs/GLOSSARY.md)** | Terms you'll see across the docs |
| **[docs/ROADMAP.md](docs/ROADMAP.md)** | What we're working on |

### Policies + posture
| | |
| --- | --- |
| **[SECURITY.md](SECURITY.md)** | Vulnerability reporting · what's protected |
| **[PRIVACY.md](PRIVACY.md)** | What we collect (nothing, by default) · what lives where |
| **[LICENSE.md](LICENSE.md)** | EULA pointer · third-party notices · trademarks |
| **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** | How we behave on this project |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How to engage with this repo |
| **[docs/COMPLIANCE.md](docs/COMPLIANCE.md)** | SBOM · SOC 2 · DPA · FIPS · PIV/CAC |
| **[docs/TELEMETRY.md](docs/TELEMETRY.md)** | What gets sent (nothing, by default) |
| **[docs/AIRGAPPED.md](docs/AIRGAPPED.md)** | Run AZMX with zero outbound |

### Operate
| | |
| --- | --- |
| **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | Problem → fix, by surface |
| **[docs/DATA_PORTABILITY.md](docs/DATA_PORTABILITY.md)** | Export · backup · move between machines |
| **[docs/UNINSTALL.md](docs/UNINSTALL.md)** | Clean removal per platform |
| **[docs/SUPPORT.md](docs/SUPPORT.md)** | Where to go for what |

### Build with us
| | |
| --- | --- |
| **[skills/](skills/)** | Community skills the agent can load (`load_skill("…")`) |
| **[agents/](agents/)** | Community sub-agents the main agent delegates to |
| **[mcp-servers/](mcp-servers/)** | Community MCP connector manifests |
| **[snippets/](snippets/)** | Community prompt snippets (`#name` in the composer) |
| **[guidelines/](guidelines/)** | Authoring standards for every contribution kind |
| **[guidelines/SHOWCASE.md](guidelines/SHOWCASE.md)** | Featured community contributions |

---

## Auto-updates

AZMX checks for updates on launch. New versions land via the in-app updater — no need to revisit this page once you're installed. Signed via a public minisign key bundled with the app.

---

## License

AZMX AI is free to download but proprietary. By installing the application you agree to the End User License Agreement that ships with it. The release artifacts are signed; the source repository is private.

## Support

- **Manual / FAQ**: see the links above.
- **Bugs**: open an issue against this repository — include OS, AZMX version, and steps to reproduce.
