# Frequently asked questions

Quick answers about AZMX AI. For feature documentation see [MANUAL.md](MANUAL.md). For install help see [SETUP.md](SETUP.md).

---

## General

### What is AZMX AI?

A native, local-first AI terminal for macOS, Linux, and Windows. It bundles a real PTY backend with a modern UI — multi-tab terminals, a code editor, file explorer, web preview, and a first-class AI side panel. The agent can use your own API keys or run free models locally via Ollama.

### Is it free?

Yes — AZMX AI is free to download and free to use. It is **not** open-source; the source is proprietary and not published. The binaries are distributed under the EULA shipped with the application.

### Does it work offline?

Yes — when you use a local model. The "free local AI" path runs entirely on your machine via Ollama. No cloud round-trip. If you use a hosted provider (OpenAI, Anthropic, etc.) the agent's calls go out to that provider, but the rest of AZMX still works offline.

### What platforms are supported?

macOS 10.15+, Linux (any modern distro with `webkit2gtk-4.1` + `gtk3`), Windows 10+ (x86_64). See [SETUP.md](SETUP.md) for specifics.

### How big is the installer?

~10 MB. The installer is small because the inference engine and models are not bundled — you choose whether to install Ollama on first launch.

---

## Privacy & security

### Does AZMX phone home?

By default, **no**. Telemetry is opt-in, off by default, and you'll see a "Share anonymous usage data" toggle in **Settings → General → Privacy**. When on, it sends only event names (e.g. `command.palette_opened`, `ai.message_sent`), never prompts, file contents, API keys, or directory names.

### Are my prompts sent anywhere?

Depends on the model you've selected:
- **Local model** (Ollama / LM Studio): no. Prompts stay on your machine.
- **Hosted provider** (OpenAI / Anthropic / Google / xAI / Cerebras / Groq / DeepSeek): yes — to that provider, per their privacy policy. AZMX does not see or proxy these requests.

### Where are API keys stored?

In the OS keychain — **Keychain Access** on macOS, **Credential Manager** on Windows, **libsecret** on Linux. Under the service name `azmx-ai`. They never touch disk in plain files, `localStorage`, or AZMX's settings JSON.

### What about MCP server tokens?

The same. OAuth Client Secret for HTTP MCP servers and any per-server env-var secret declared by a catalog entry are stored in the OS keychain (`mcp.<serverId>.oauthClientSecret` and `mcp.<serverId>.secret.<envName>` respectively), never in `azmx-mcp.json`.

### Can the AI agent read my .env / .ssh files?

No. AZMX maintains a security deny-list in `lib/security.ts` that refuses any read on:

- `.env` / `.env.*`
- `.ssh/*`
- `credentials*`
- The macOS keychain support directories
- Other obvious secret paths

The deny-list applies to both the `read_file` tool and write paths (no `edit` of these files either). It cannot be bypassed by the agent.

### Is there a sandbox?

The Rust process owns all OS access — the webview cannot touch the FS, processes, or shells directly. Every operation flows through `invoke()` to Rust commands. The agent's write/exec tools require **explicit per-action approval** in the UI before they run.

### Does the agent run code on my machine?

Only when you approve a `bash_run` / `bash_background` tool call. Approval is required per-action; you see the exact command before it executes.

---

## Licensing

### Can I redistribute AZMX AI?

No. The binaries are free to download for personal and commercial use, but redistribution, reverse engineering, and modification are not permitted — see the EULA shipped with the application.

### Is the source open?

No, AZMX AI itself is proprietary. The release artifacts (installers + auto-updater manifest) live in [this repository](https://github.com/drvt69talati/azmx-ai-releases); the source repository is private.

### What about the models?

When you pull a model via Ollama from AZMX's curated catalog, the model files come directly from Ollama Hub. The catalog entries we ship are **all Apache 2.0** (Qwen2.5-Coder, Granite Code). Deliberately excluded: Codestral (research-only license), CodeLlama (Meta-license restrictions), DeepSeek-Coder (commercial use OK but custom terms — not bundled in the curated picker).

---

## Local AI

### Why Ollama and not a bundled inference engine?

Three reasons:
1. **Crash isolation**: a model load that OOMs Ollama doesn't take down AZMX (and your terminals + dev servers with it).
2. **Maintenance**: Ollama owns GPU acceleration, model management, and updates. AZMX would otherwise own a llama.cpp Rust binding + cross-platform GPU paths — a permanent treadmill.
3. **Memory pressure**: Ollama's RSS lives in its own process and is independently swappable; AZMX's RSS stays small (~80–200 MB).

The trade-off is one extra install. We thought it was the right one.

### Can I use LM Studio instead of Ollama?

Yes — LM Studio support has been in AZMX since v0.4.1 (predates Ollama). Both providers are first-class. Settings → Models has a section for each.

### Which model should I pick?

| Use case | Pick |
| --- | --- |
| First time, M-series Mac | **Qwen2.5-Coder 7B** |
| First time, modern x86 with discrete GPU | **Qwen2.5-Coder 7B** |
| First time, CPU-only Mac/Win/Linux | **Qwen2.5-Coder 1.5B** for autocomplete + use BYOK for chat |
| Has 16+ GB RAM and wants the strongest local coder | **Qwen2.5-Coder 14B** |
| Hits issues with Qwen for some reason | **Granite Code 8B** |

All entries in the curated catalog are Apache 2.0 — safe for commercial use.

### How fast is local AI?

| Setup | 7B Q4 inference |
| --- | --- |
| M-series Mac | 30–80 tok/s ✅ |
| Modern x86 + NVIDIA GPU (CUDA) | 60–150 tok/s ✅ |
| Intel Mac (CPU) | 5–15 tok/s ⚠️ |
| Windows/Linux CPU-only | 5–20 tok/s ⚠️ |

For autocomplete (1.5B), divide all those by ~3 for the speed you'll see — about 80–200 tok/s on M-series.

### Can I use AZMX without installing Ollama?

Yes — bring an API key in **Settings → Models** instead. Or set up LM Studio. Or use both BYOK and Ollama side-by-side.

### Does my Ollama install stay private from AZMX?

AZMX talks to Ollama over `http://localhost:11434`. It doesn't introspect anything beyond:

- `/api/tags` — what models are installed (for the picker).
- `/api/pull` — to download new models you've explicitly chosen.
- `/api/delete` — when you delete a model from the AZMX UI.
- `/v1/chat/completions` — to send your prompts.

It doesn't read any Ollama config file or talk to ollama.com directly.

---

## BYOK

### Which providers are supported?

- **OpenAI** (`gpt-5.4-mini`, `gpt-5.5`, `gpt-5.3-codex`)
- **Anthropic** (`claude-haiku-4-5`, `claude-sonnet-4-6`, `claude-opus-4-7`)
- **Google** (Gemini 3.1 Pro, Gemini 3 Flash, Gemini 2.5 Flash, Gemma 4 31B)
- **xAI** (Grok 4.20 reasoning + non-reasoning)
- **Cerebras** (GPT-OSS 120B — ultra-fast)
- **Groq** (GPT-OSS 20B — ultra-fast)
- **DeepSeek** (V4 Flash, V4 Pro)
- **LM Studio** (any local model)
- **Ollama** (any local model)
- **OpenAI-compatible** endpoints — bring any URL.

### What's the default model?

`claude-sonnet-4-6` for chat (when an Anthropic key is configured). If only a different provider is configured, you'll need to switch the default in Settings → Models.

### Can I use multiple providers at once?

Yes. Configure any number of API keys. Switch which model the active session uses via the model picker in the AI status bar (bottom right).

### Do I need a paid plan with the provider?

You need API access. Most providers offer free tiers for low-volume usage. AZMX doesn't add anything on top — the cost-per-token is whatever the provider charges.

---

## AI capabilities

### What can the AI agent actually do?

- Read files, list directories, grep across the workspace.
- Edit files (with diff review — never writes without your approval).
- Run shell commands (with approval).
- Spawn long-running processes (dev servers, watchers) and tail their logs.
- Open files in the editor / open a URL as a preview tab.
- Delegate to read-only sub-agents for self-contained investigations.
- Call MCP tools exposed by any running server (GitHub, Postgres, Notion, …).
- Maintain a todo list across multi-step tasks.

See the **AI tools reference** in MANUAL.md for the full list.

### How does the agent know about my project?

Three sources, in priority order:

1. **`<terminal-context>` block** injected every turn — current cwd, active file, last 300 lines of the terminal buffer, workspace root.
2. **`AZMX.md`** / `CLAUDE.md` / `AGENTS.md` — project memory at the workspace root.
3. **`~/.claude/CLAUDE.md`** — user-level memory.

Run `/init` in the AI panel to generate an AZMX.md by scanning your codebase.

### Can the agent see my whole codebase?

Not in one shot — the agent reads files on demand via `read_file` and searches via `grep` / `glob` / `search_semantic`. If you want it to consider many files up-front, mention them with `@` in the composer.

For projects too large for grep alone, run `/index` to build a semantic-search index. Embeddings live in `~/.cache/azmx/semantic/` and can be searched via the `search_semantic` tool.

### Can I pause / cancel the agent mid-turn?

Yes — the **Stop** button in the AI panel cancels the active turn. The agent's in-flight tool call (if any) is interrupted. Already-applied changes (e.g. accepted edits) stay.

### What's plan mode?

Toggle with `/plan`. While active, mutating tools (`write_file`, `edit`, etc.) queue their changes instead of applying. `bash_run`/`bash_background` are blocked. The agent finishes its plan, summarizes, and stops; you review the diff in an AI diff tab and accept/reject per hunk.

Use plan mode for refactors and multi-file changes where you want a review surface before anything lands.

### Why does the agent ask for approval so often?

Every tool that mutates the file system, runs a shell command, or calls an MCP write tool requires explicit per-action approval. This is the **safety contract** — the agent cannot do anything destructive without your okay. If you want, you can approve "always for this session" per tool, but the default is per-action.

### What does the `<file>` block in my message mean?

When you `@`-mention a file or attach one via "Attach to AI", the composer includes a `<file path="…">…</file>` block in your prompt. The agent treats it as ground truth for that file's contents at submit time. You can attach multiple files; they all wrap individually.

---

## Performance

### How much RAM does AZMX use?

Idle, single window: ~80–200 MB. The terminal + xterm.js dominates. Heavy use (many tabs, busy AI conversation): 300–500 MB.

When you select a local model (Ollama), inference RAM is in **Ollama's process**, not AZMX. A loaded 7B Q4 model = ~5 GB **in Ollama** — AZMX's footprint stays small. This is part of why we picked Ollama over bundled inference.

### Why is local autocomplete slow on my Intel Mac?

CPU-bound inference. Try Qwen2.5-Coder 1.5B (~3× the speed of 7B) or switch the autocomplete provider to a hosted one (Cerebras / Groq — both ultra-fast).

### Can I disable autocomplete?

**Settings → Models → Editor autocomplete**, off-switch at the top.

### Does the AI panel slow down other tabs?

The AI panel runs in the main webview process alongside React. Terminals and editors are in the same process. In practice the heaviest thing is whatever the agent is doing (file I/O, tool calls); inference happens out-of-process (cloud, Ollama, or LM Studio).

---

## Integrations & extensibility

### What's MCP?

The Model Context Protocol — an open spec for exposing tools to AI agents. AZMX speaks MCP natively. Run any MCP server (locally as stdio or remotely as HTTP) and its tools become available to the agent as `mcp__<server>__<tool>`.

See **MANUAL.md → Connectors** for the full guide.

### What integrations work out of the box?

Via the **MCP catalog** picker in Settings → Connectors:

- **Dev**: GitHub, GitLab
- **Data**: Postgres, SQLite, Redis
- **Local**: Filesystem, Memory, Sequential Thinking, Fetch, Time, Puppeteer
- **Knowledge**: Brave Search, Google Maps
- **Communication**: Slack
- **Files**: Google Drive

All are official `@modelcontextprotocol/server-*` packages — AZMX just adds one-click setup with keychain-backed secrets.

### Can I add my own MCP server?

Yes. **Settings → Connectors → Custom**. Provide a name + transport + command (or URL for HTTP). AZMX spawns it on launch (if auto-start is on) and namespaces its tools.

### Does AZMX work with `gh` / `git` CLIs?

Yes — they're regular terminal commands. The agent can also call them via `bash_run`. There's also a `/commit` slash command that drafts a conventional commit from your diff and types it at the prompt.

### Does AZMX have a plugin API?

Not yet. MCP is the de facto plugin surface — anything you want to expose to the agent can be an MCP server. UI extensions / themes via a plugin API are on the roadmap.

---

## Troubleshooting

### Auto-updater doesn't find new versions

Check `https://github.com/drvt69talati/azmx-ai-releases/releases/latest/download/latest.json` — it should return JSON. If 404, the latest release didn't publish the manifest correctly; file an issue.

### The Ollama pill in the status bar is amber

The daemon is unreachable. Check:
1. Ollama is running (`ollama serve` or the menu-bar icon).
2. The Settings → Models → Free local AI **Base URL** matches your Ollama port.
3. `curl http://localhost:11434/api/tags` returns JSON.

### My API key works in the provider's web UI but AZMX says "no key configured"

Confirm the keychain entry: macOS users can open **Keychain Access**, search `azmx-ai`, and look for a row with the right provider account. On Windows: **Credential Manager → Windows Credentials**. If the entry is missing or the value is empty, re-paste the key in Settings → Models.

### The agent edited a file I didn't approve

It should be physically impossible — `edit` / `multi_edit` / `write_file` all require approval. If you see this happening, the diff would have been displayed in an AI diff tab and you accepted it (perhaps via "always approve" earlier in the session). Check **session approvals** in the composer.

### My MCP server starts then errors

Expand the server row in **Settings → Connectors** — the error message is shown verbatim there. Most common causes:
- Required env var (token) not set.
- Wrong `command` path (try absolute path).
- The remote endpoint is unreachable (firewall, CORS, auth).

### I want to reset everything

Quit AZMX. Delete the support directory (see [SETUP.md → Where data lives](SETUP.md#where-data-lives)). Restart — the first-run tour will run again. Keys in the keychain persist unless removed manually.

---

## More

- **Manual**: [MANUAL.md](MANUAL.md)
- **Install / setup**: [SETUP.md](SETUP.md)
- **Latest release & changelog**: [releases](https://github.com/drvt69talati/azmx-ai-releases/releases)
- **Bug reports**: open an issue on this repository.
