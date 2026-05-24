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

In a private user-only (`0600` on Unix) app-local `secrets.json` file inside the AZMX data directory — never in the OS keychain, `localStorage`, or AZMX's plain settings JSON. The OS keychain was removed in 2026-05-15 because the Keychain ACL on macOS re-prompted on every build re-sign, which broke the experience for every unsigned / CI / ad-hoc build.

### What about MCP server tokens?

The same. OAuth Client Secrets for HTTP MCP servers and any per-server env-var secret declared by a catalog entry live in the same `secrets.json` file (`mcp.<serverId>.oauthClientSecret` and `mcp.<serverId>.secret.<envName>` respectively), never in `azmx-mcp.json`.

### Can the AI agent read my .env / .ssh files?

No. AZMX maintains a security deny-list in `lib/security.ts` that refuses any read on:

- `.env` / `.env.*`
- `.ssh/*`
- `credentials*`
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

No, AZMX AI itself is proprietary. The release artifacts (installers + auto-updater manifest) live in [this repository](https://github.com/AzmxAI/azmx); the source repository is private.

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
- **NVIDIA NIM** — hosted via build.nvidia.com or self-hosted NIM containers. Seed models: Llama 3.1 Nemotron 70B, Llama 3.1 70B Instruct, Qwen2.5-Coder 32B.
- **Azure OpenAI** — any Azure resource + deployment. First-class preset; URL field + deployment name appear after the key is saved.
- **LM Studio** (any local model)
- **Ollama** (any local model)
- **OpenAI-compatible** endpoints — bring any URL. Useful for Vertex AI, LiteLLM-fronted Bedrock, vLLM, TGI, etc.

### What's the default model?

`claude-sonnet-4-6` for chat (when an Anthropic key is configured). If only a different provider is configured, you'll need to switch the default in Settings → Models.

### Can I use multiple providers at once?

Yes. Configure any number of API keys. Switch which model the active session uses via the model picker in the AI status bar (bottom right).

### Do I need a paid plan with the provider?

You need API access. Most providers offer free tiers for low-volume usage. AZMX doesn't add anything on top — the cost-per-token is whatever the provider charges.

---

## NVIDIA

### What's NIM and why does AZMX support it?

NIM (NVIDIA Inference Microservices) is NVIDIA's OpenAI-compatible inference surface. Hosted at [build.nvidia.com](https://build.nvidia.com) (free tier available, paid for production) and also runnable on-prem as a containerized service. AZMX treats NIM as a first-class provider — the same shape as OpenAI / Anthropic / etc. — so every NIM customer can route their AZMX agent at their existing NIM endpoint without any third-party AI provider in the loop.

### How do I point AZMX at my self-hosted NIM?

1. Paste an `nvapi-…` token (or whatever auth your container expects) in **Settings → Models → NVIDIA NIM**.
2. A **NVIDIA NIM endpoint** field appears below the API keys grid the moment the key is saved.
3. Set it to your container's `/v1` URL (e.g. `https://nim.internal/v1`).

### What does the `gpu_status` tool actually do?

It runs `nvidia-smi --query-gpu=…` under the hood and returns structured per-GPU state to the agent: name, memory (used / total / free), utilization (compute and memory), temperature, fan, power draw/limit, driver version. Read-only, auto-execute, no approval needed.

Useful for "I just OOM'd on this batch size", "which model will fit in my free VRAM", "which GPU has the lowest load right now". On machines without NVIDIA hardware the tool returns `{ available: false }` and the agent moves on quietly.

### Can the agent talk to my Kubernetes cluster?

Yes — via MCP. In **Settings → Connectors → Browse catalog** there's a **Kubernetes** entry that wraps a community `mcp-server-kubernetes`. It uses your existing `~/.kube/config` (or a path you specify), so whatever your current `kubectl` can see, the agent can list, describe, log-tail, etc.

Useful for managing NIM deployments, Triton inference services, GPU operator state, and any other K8s-resident AI workload.

### Can the agent draft a Slurm job for me?

Yes — type `/sbatch <description>` in the AI panel. The agent drafts a complete `#!/bin/bash` script with the right SBATCH directives (job-name, GPUs, partition, time limit, srun wrapping), and prints it as a fenced shell block in chat. You review and submit; AZMX never runs `sbatch` itself.

### Does AZMX work on DGX / HGX / Jetson?

Yes. AZMX is a regular desktop app — anywhere you can run a webview-based Linux/macOS/Windows app, you can run AZMX. The **SSH hosts manager** (⌘⇧H) lets you save each cluster target with GPU count, GPU model, scheduler hint (Slurm / Kubernetes / None), and free-form labels. The `/hosts` slash command then polls `nvidia-smi` across saved hosts and prints one markdown table.

For Jetson: the AppImage works on AArch64 Linux. The free local AI flow (Ollama) is also AArch64-aware. Performance is constrained by the device's memory but Qwen2.5-Coder 1.5B runs respectably on Orin-class boards.

### Can the agent analyze an Nsight profile dump?

Yes — that's exactly what `gpu_profile_summary` is for. `@`-mention or drag a `.nsys-rep` / `.qdrep` (Nsight Systems trace) or `.ncu-rep` (Nsight Compute report) into the AI panel. The agent calls the tool, which wraps `nsys stats --format csv` or `ncu --csv` (chosen by extension), and presents the top hotspots as a compact markdown table.

Requires the relevant Nsight CLI to be installed locally (`nsys` from Nsight Systems, `ncu` from Nsight Compute). If absent, the tool returns the install URL and the agent points you at it — no retry loop.

### Can the agent talk to multiple GPU hosts in one prompt?

Yes — `/hosts` in the AI panel is exactly this. The slash command expands into a structured agent prompt that calls `bash_run` per saved host (each requires approval — so you can decline individual remotes), runs `nvidia-smi` over SSH, and aggregates into one table. Add `--label training` to scope to one tag.

### Is there a TensorRT-LLM / Triton / NeMo / W&B / TensorBoard MCP server I can add?

Several community-built ones exist. AZMX doesn't bundle them in the curated catalog yet — the curation contract is "we only ship entries pointing at packages we can verify." Any reachable MCP server (stdio or HTTP/SSE) works via **Settings → Connectors → Custom**. If you find a good one, let us know and we'll add it to the catalog.

---

## Other clouds (Vertex AI, AWS Bedrock, etc.)

### Does AZMX work with Google Vertex AI?

Yes — via the **OpenAI-compatible** provider. Vertex AI exposes an OpenAI-compat surface at:

```
https://{region}-aiplatform.googleapis.com/v1beta1/projects/{project}/locations/{region}/endpoints/openapi
```

Auth uses a Google Cloud access token, which expires hourly:

```bash
gcloud auth print-access-token
```

For short sessions this is fine — paste the token in the OpenAI-compatible key field. For long-lived production use, mint a long-lived service-account token bound to the Vertex AI user role.

AZMX does **not** ship a labeled Vertex AI preset because the hourly token expiry would make the UX hostile — labeling it as a clean preset would set the wrong expectation. The OpenAI-compatible path with a real token is honest and works.

### Does AZMX work with AWS Bedrock?

Yes — but Bedrock uses AWS SigV4 (not bearer-token auth) and isn't directly OpenAI-compatible per-model. The clean path is to run **[LiteLLM](https://github.com/BerriAI/litellm)** as a proxy in front of Bedrock:

```bash
litellm --model bedrock/anthropic.claude-3-5-sonnet-20241022-v2:0
```

LiteLLM exposes an OpenAI-compatible endpoint that handles the SigV4 signing transparently. Point AZMX's **OpenAI-compatible** provider at `http://localhost:4000/v1` (or wherever LiteLLM listens) and the agent now routes through Bedrock.

AZMX does **not** ship a Bedrock preset because doing SigV4 in-app would require bundling AWS SDK chunks and managing IAM credential lifecycles — neither fits the BYOK posture. LiteLLM is the clean industry-standard bridge.

### What about Azure OpenAI?

That **is** a first-class preset — see the BYOK section above. Paste the key, fill in your resource URL (`https://my-resource.openai.azure.com/openai/v1`) and deployment name, pick **Azure OpenAI (deployment)** in the default-model dropdown.

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

Check `https://github.com/AzmxAI/azmx/releases/latest/download/latest.json` — it should return JSON. If 404, the latest release didn't publish the manifest correctly; file an issue.

### The Ollama pill in the status bar is amber

The daemon is unreachable. Check:
1. Ollama is running (`ollama serve` or the menu-bar icon).
2. The Settings → Models → Free local AI **Base URL** matches your Ollama port.
3. `curl http://localhost:11434/api/tags` returns JSON.

### My API key works in the provider's web UI but AZMX says "no key configured"

Confirm the entry made it to disk. Inspect `~/Library/Application Support/app.azmx.ai/secrets.json` on macOS, `~/.config/app.azmx.ai/secrets.json` on Linux, or `%APPDATA%\app.azmx.ai\secrets.json` on Windows. If the file is missing or the key is absent, re-paste it in Settings → Models. Never share this file's contents.

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
- **Latest release & changelog**: [releases](https://github.com/AzmxAI/azmx/releases)
- **Bug reports**: open an issue on this repository.
