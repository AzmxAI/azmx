<div align="center">

<!-- TODO(hero-asset): replace this with the actual logo when assets/ ships. -->
<img src="https://azmx.ai/assets/logo.png" width="96" height="96" alt="AZMX AI" />

# AZMX AI

### The sovereign agent platform.

Native desktop AI terminal. Bring any AI key — or run free local models. ~10&nbsp;MB. No telemetry. Keys in a `0600` file on your machine, never the OS keychain, never `localStorage`.

[![Download latest](https://img.shields.io/github/v/release/AzmxAI/azmx?label=download&style=for-the-badge&color=171717)](https://github.com/AzmxAI/azmx/releases/latest)
[![Website](https://img.shields.io/badge/website-azmx.ai-171717?style=for-the-badge)](https://azmx.ai)
[![Discussions](https://img.shields.io/github/discussions/AzmxAI/azmx?style=for-the-badge&color=171717)](https://github.com/AzmxAI/azmx/discussions)

[![Downloads](https://img.shields.io/github/downloads/AzmxAI/azmx/total?label=total%20downloads)](https://github.com/AzmxAI/azmx/releases)
[![License](https://img.shields.io/badge/license-EULA-blue)](LICENSE.md)
[![Platform](https://img.shields.io/badge/platform-macOS%20%C2%B7%20Linux%20%C2%B7%20Windows-lightgrey)](#install)
[![Sponsor](https://img.shields.io/github/sponsors/AzmxAI?label=sponsor)](https://github.com/sponsors/AzmxAI)

</div>

<!--
  TODO(demo-gif): record a 6–10 second screen capture of the agent doing something
  undeniable — e.g. "explain the last error", "/init" a fresh repo, or running a
  parallel sub-agent against a real diff. Save as assets/demo.gif (<=4 MB) and
  uncomment the line below. This is the single highest-leverage change in the
  whole repo for repo-visit → star conversion.
-->
<!-- <p align="center"><img src="assets/demo.gif" alt="AZMX AI in action" width="720" /></p> -->

---

## Install

```bash
# macOS — Homebrew (live now via our tap; in homebrew-cask review)
brew install --cask AzmxAI/azmx/azmx

# macOS / Linux — one-line installer (live)
curl -fsSL https://azmx.ai/install | sh

# Windows — winget (manifest submitted to microsoft/winget-pkgs; live after review)
winget install AzmxAI.AZMX
```

Or grab a signed installer for your platform from the **[latest release](https://github.com/AzmxAI/azmx/releases/latest)**:

| Platform | File |
| --- | --- |
| macOS (Apple Silicon) | `AZMX.AI_<version>_aarch64.dmg` |
| macOS (Intel) | `AZMX.AI_<version>_x64.dmg` |
| Linux | `AZMX.AI_<version>_amd64.AppImage`, `.deb`, or `.rpm` |
| Windows | `AZMX.AI_<version>_x64_en-US.msi` or `*_x64-setup.exe` |

Detailed walkthrough per platform: **[SETUP.md](SETUP.md)**.

---

## Why AZMX

- **Your code stays on your machine.** AZMX never proxies AI requests through our servers. Your prompts go directly from your device to whichever provider you chose, or to a local model. We don't sit in the middle — and we can't.
- **Free local AI without an API key.** One-click Ollama setup. Curated coding models (Qwen2.5-Coder, Granite Code, Llama, all Apache 2.0). Your code never leaves the device.
- **Or BYOK any major provider.** OpenAI, Anthropic, Google, Groq, xAI, Cerebras, DeepSeek, NVIDIA NIM, Azure OpenAI, any OpenAI-compatible endpoint. Pick whichever, switch any time.
- **Per-call agent approval.** The agent asks before it writes a file or runs a shell command. Configurable from Permissive to Paranoid (typed confirmation for destructive ops).
- **Hash-chained, tamper-evident audit log.** Every tool call recorded locally. Export to your SIEM on the paid tiers.
- **Real terminal, real editor, real file explorer.** xterm.js terminal, CodeMirror editor with vim mode + inline AI autocomplete, file tree with git badges. Not a marketing page that calls itself "the future of terminals."
- **MCP-native.** 17-server curated catalog (GitHub, GitLab, Kubernetes, Postgres, SQLite, Redis, Slack, Drive, …). Add your own in one JSON file.
- **~10&nbsp;MB installer. Native. No Electron.** Cold-start under a second. No telemetry, no account, no email-required-to-use.

> The application source is proprietary. **This repository publishes release artifacts and user-facing docs** — installers, the auto-updater manifest, and the community contribution surfaces (skills, agents, MCP servers, snippets, translations). Source contributions land upstream and ship to you via the auto-updater.

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

## ⭐ Star this repo

If AZMX saves you time, a star helps two things:

1. **Other developers find it.** GitHub stars are the single biggest discovery signal for dev tools.
2. **We know what to keep building.** Every star tells us "this is the kind of tool worth maintaining."

It costs you one click and supports a small team trying to build the AI terminal we wanted for ourselves. Thank you 🙏

<p align="center">
  <a href="https://github.com/AzmxAI/azmx/stargazers"><img src="https://img.shields.io/github/stars/AzmxAI/azmx?style=social" alt="Star history"/></a>
</p>

---

## Featured by

<!--
  Press / podcast / video mentions land here as they happen. Add as logo links
  when real coverage drops — keep it sparse and credible (no "as seen on" walls
  with 50 unverified logos).
-->

*(This space will fill in as AZMX is covered. [Tell us if you wrote about AZMX →](https://github.com/AzmxAI/azmx/discussions/new?category=show-tell))*

---

## License

## Support

- **Manual / FAQ**: see the links above.
- **Bugs**: open an issue against this repository — include OS, AZMX version, and steps to reproduce.
