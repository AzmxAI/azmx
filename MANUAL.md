# AZMX AI — User manual

End-to-end reference for AZMX AI. For install instructions see [SETUP.md](SETUP.md). For common questions see [FAQ.md](FAQ.md).

---

## Table of contents

- [Layout overview](#layout-overview)
- [Tabs & panes](#tabs--panes)
- [Terminal](#terminal)
- [Editor](#editor)
- [File explorer](#file-explorer)
- [Web preview](#web-preview)
- [AI panel](#ai-panel)
  - [Composer](#composer)
  - [`@`-mention files](#mention-files)
  - [`#` snippets and slash commands](#snippets-and-slash-commands)
  - [Voice input](#voice-input)
  - [Sessions](#sessions)
  - [Agents (personas)](#agents-personas)
  - [Plan mode](#plan-mode)
  - [Approvals](#approvals)
- [AI tools reference](#ai-tools-reference)
- [Sub-agents](#sub-agents)
- [Connectors (MCP)](#connectors-mcp)
- [Free local AI (Ollama)](#free-local-ai-ollama)
- [NVIDIA NIM](#nvidia-nim)
- [GPU awareness](#gpu-awareness)
- [Project switcher](#project-switcher)
- [Command palette & quick-open](#command-palette--quick-open)
- [AZMX.md — project memory](#azmxmd--project-memory)
- [Hooks (PreToolUse / PostToolUse)](#hooks-pretooluse--posttooluse)
- [Claude Code interop](#claude-code-interop)
- [Settings reference](#settings-reference)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Auto-updater](#auto-updater)

---

## Layout overview

AZMX opens as a single window divided into:

```
┌─────────────────────────────────────────────────────────────┐
│ Tabs                                                  ⚙ ⨯  │  ← Header
├──────────┬──────────────────────────────────┬──────────────┤
│          │                                  │              │
│          │  Terminal / Editor / Preview     │   AI panel   │
│ Explorer │  (the active tab)                │   (toggle    │
│          │                                  │   with ⌘L)   │
│          │                                  │              │
├──────────┴──────────────────────────────────┴──────────────┤
│ ~/path/here · main · 3.4k tokens · Local · qwen2.5-coder…  │  ← Status bar
└─────────────────────────────────────────────────────────────┘
```

Toggle the sidebar with **⌘B**. Toggle the AI panel with **⌘L**. Resize either by dragging its handle.

---

## Tabs & panes

Tabs are typed: each is a **terminal**, **editor**, **preview**, or **AI diff** tab.

- **⌘T** — new terminal tab in the current workspace cwd
- **⌘E** — new editor tab (file-picker dialog)
- **⌘⇧P** — new preview tab (asks for a URL)
- **⌘W** — close the active tab (asks before closing dirty editors)
- **⌘1**–**⌘9** — jump to tab by index
- **⌘⇧]** / **⌘⇧[** — cycle tabs

### Splits (terminals only)
- **⌘D** — split right
- **⌘⇧D** — split down
- **⌘[** / **⌘]** — focus prev / next pane within the tab

A terminal tab can hold up to 4 panes. Inactive tabs aren't unmounted — they stay alive so dev servers keep streaming in the background.

---

## Terminal

The active tab's terminal sits in the main area.

### Shell integration
On first spawn AZMX injects an init script for your shell (`zshrc`, `bashrc`, or `pwsh profile`) that emits **OSC 7** (cwd) and **OSC 133** (prompt + exit code) sequences. This is how AZMX knows:

- Your current working directory in real time.
- When a command starts, finishes, and what its exit code was.

You don't need to do anything; it just works on top of your existing dotfiles.

### Inline search
**⌘F** opens a search bar over the terminal scrollback. Enter to next match, Shift+Enter to previous.

### Clickable links
- URLs (http/https) — open in the system browser.
- `path:line:col` patterns (tsc, ESLint, Node stack traces, Python tracebacks, cargo) — click to open the file in the editor at that line. Cwd-aware: relative paths resolve against the active terminal's cwd.

### Auto preview detection
If a command prints a `http://localhost:PORT` URL, a pill appears in the status bar offering to open it in a preview tab.

### Failed-command pill
If a command exits non-zero, a small amber pill floats above the terminal: **"Ask AZMX AI to fix"**. Clicking prefills the AI composer with the failure tail.

### SSH
**⌘⇧S** opens the fast SSH connection picker — saved hosts and ad-hoc `user@host[:port]` are supported. Connect runs `ssh -t` in a real PTY tab; reconnects on the same leaf re-use the same args.

**⌘⇧H** opens the full **SSH hosts manager** — CRUD across saved hosts plus optional cluster metadata (GPU count, GPU model, scheduler, labels). The metadata feeds the AI agent's context and the `/hosts` multi-host GPU poll.

### True color / web links / 5k scrollback
xterm.js with WebGL renderer. 5,000 line scrollback per pane.

---

## Editor

CodeMirror 6 with language support for TypeScript / JavaScript, Rust, Python, HTML/CSS, JSON, Markdown, PHP, and several more via legacy modes.

### Opening files
- Click in the **File explorer**.
- **⌘P** — quick-open (fuzzy filename search in the workspace).
- Click a `file:line` link in a terminal.
- The AI agent may open files via its `read_file` tool.

### Themes
**Settings → General → Editor theme**. Choices: Atom One, Aura, Copilot, GitHub Dark, GitHub Light, Nord, Tokyo Night, Xcode Dark, Xcode Light.

### Vim mode
**Settings → General → Vim mode**. Adds modal editing via `@replit/codemirror-vim`.

### Inline AI autocomplete
**Settings → Models → Editor autocomplete** — enable + pick a low-latency provider:

- **Cerebras** (`gpt-oss-120b`) — ultra-fast hosted, requires API key.
- **Groq** (`gpt-oss-20b`) — same.
- **LM Studio** — your local server.
- **Ollama** — your local Ollama. Recommended: `qwen2.5-coder:1.5b` (fast on M-series CPU).

Autocomplete renders as ghost text. **Tab** to accept, **Esc** to dismiss. Each suggestion is capped (no multi-paragraph completions).

### AI edit diffs
When the agent edits a file via `edit` / `multi_edit` / `write_file`, the change opens as an **AI diff tab** (`ai-diff` tab kind). Review per-hunk, accept or reject. The on-disk file isn't written until you accept.

---

## File explorer

Tree view of the workspace, in the left sidebar.

- **Click** — opens a file in a preview-style editor tab (auto-pins on second open).
- **Double-click** — pins the tab.
- **Right-click** — context menu: rename, delete, reveal in finder, copy path, **Attach to AI**.
- **⌘F** with focus in the explorer — fuzzy search files by name.
- **Per-file git status** badges (M / A / ± / ? / D / R / !); per-directory rollups.

### Material / Catppuccin icons
File-type icons resolve via Material/Catppuccin pack — they reflect the language / framework of the file.

### Workspace root
Tracked from the active terminal's cwd via OSC 7. The first time you `cd` into a project, AZMX records it in the recents list and the explorer roots to that directory.

---

## Web preview

A **preview tab** is an iframe pointing at a local dev-server URL.

- Auto-detected from terminal output (`localhost:PORT`).
- Or **⌘⇧P** to open one explicitly.
- The address bar at the top accepts navigation; reload is the circular arrow.

---

## AI panel

Toggle with **⌘L**. The panel mounts a chat composer at the bottom and the message thread above.

### Composer

The composer is the rich text input at the bottom of the AI panel.

- **Enter** sends.
- **Shift+Enter** newlines.
- **⌘+Enter** sends regardless of trigger state (e.g. when a `@`/`#` picker is open).
- **Esc** closes any open picker without sending.

### Mention files

Type **`@`** to open a fuzzy file picker over the workspace. Pick → the file becomes a chip above the textarea. On submit, the chip wraps as a `<file …>` block in the prompt so the agent sees the file content.

- The `@query` works on relative paths: `@src/foo.ts`, `@../sibling.rs`, `@.eslintrc`.
- Drop the chip with the ✕ on hover.

### Snippets and slash commands

Type **`#`** to open a picker over **snippets** (reusable instruction blocks) and **slash commands**.

**Built-in slash commands** (typeable inline, no `#`):

| Command | What it does |
| --- | --- |
| `/init` | Generates an `AZMX.md` for the current workspace by scanning the codebase. |
| `/plan` | Toggles **plan mode** — see [Plan mode](#plan-mode). |
| `/commit` | Drafts a Conventional Commit from `git diff [--cached]` and types `git commit -m "…"` at the active terminal's prompt. |
| `/index` | Triggers a semantic-search index build for the workspace. |
| `/macro` | Opens the macro picker (parameterized prompt templates). |
| `/sbatch <description>` | Drafts a Slurm batch script for the described training/inference job (GPU count, time limit, partition, srun wrapping). Output appears in chat as a fenced shell block — multi-line scripts don't fit at the prompt. |
| `/hosts [--label tag]` | Polls `nvidia-smi` across all saved SSH hosts (or only those matching the optional label). Returns a single markdown table with per-GPU memory and utilization. Uses `bash_run` under the hood — each remote call is its own approval. |

Custom slash commands and snippets are managed in **Settings → Agents**.

### Voice input

The mic icon in the composer toolbar records audio and runs it through **OpenAI Whisper** for transcription. Requires an OpenAI API key (configured in Settings → Models). The transcript appends to whatever's in the composer.

### Sessions

Each AI conversation is a session. Sessions persist (`azmx-ai-sessions.json` + per-session `messages:<id>` files).

- **Session picker** — header of the AI panel.
- Sessions auto-derive titles from the first user message.
- **Token usage** per session is shown in the status bar (input / output / total).

### Agents (personas)

Manage in **Settings → Agents**. Each agent is `{ name, description, instructions, icon }`. The instructions block is appended to AZMX's core system prompt.

Built-in agents (read-only sub-agent personas — they're separate from the main chat persona):

- **Explore** — codebase navigation.
- **Code Review** — correctness / arch / perf audit.
- **Security** — injection, auth, secrets, crypto scan.
- **General** — multi-file research.

Custom agents live alongside; pick one from the **Agent switcher** in the composer.

### Plan mode

Type `/plan` to toggle. While active:

- Mutating tools (`write_file`, `edit`, `multi_edit`, `create_directory`) **queue** their changes instead of applying.
- `bash_run` and `bash_background` are blocked (read-only tools still work).
- The agent finishes its plan, summarizes, and stops.
- You review the diff in the AI diff tab and accept/reject per hunk.

Use plan mode for refactors and multi-file changes where you want a review surface before anything lands on disk.

### Approvals

Tools that mutate the file system, run shell commands, or invoke MCP write tools require explicit approval. The composer shows a confirmation card with the tool name + args + a one-line "why".

- **Approve** → tool runs.
- **Reject** → the agent gets a rejection message and replans.
- **Always approve this tool for this session** → optional.

---

## AI tools reference

The agent has ~20 tools across these groups:

| Tool | Approval? | Purpose |
| --- | --- | --- |
| `read_file` | auto | Read a file from disk. Pages large files via `offset`/`limit`. Refuses secret paths (`.env*`, `.ssh/`, credentials). |
| `list_directory` | auto | Directory listing. |
| `grep` | auto | gitignore-aware regex search across the workspace. |
| `glob` | auto | Path-pattern enumeration. |
| `search_semantic` | auto | Embedding search over the workspace (requires `/index`). |
| `edit` | yes | Single exact-string replace. Requires a prior `read_file`. |
| `multi_edit` | yes | Atomic batch of edits on one file. |
| `write_file` | yes | Create or overwrite. |
| `create_directory` | yes | mkdir. |
| `delete`, `rename` | yes | File mutations. |
| `bash_run` | yes | Synchronous shell. Cwd persists across calls in this session. |
| `bash_background` | yes | Long-running process (dev server, watcher). Ring-buffer log capture. |
| `bash_logs` | auto | Read the log buffer of a background process. |
| `bash_list` | auto | List running background processes. |
| `bash_kill` | yes | Terminate a background process. |
| `terminal_write` | yes | Type into the active terminal as if you typed it. |
| `todo_write` | auto | Persist a plan (single in-progress invariant). |
| `run_subagent` | auto | Spawn an isolated read-only sub-agent. |
| `gpu_status` | auto | Live NVIDIA GPU state via `nvidia-smi` — per-GPU memory/utilization/temp/power/driver. Returns `{ available: false }` cleanly on non-NVIDIA machines. |
| `gpu_profile_summary` | auto | Analyze an Nsight profile dump (`.nsys-rep` / `.qdrep` / `.ncu-rep`). Wraps `nsys stats` or `ncu --csv` depending on extension; defaults to the `kernels` report for nsys. Surfaces hotspots; agent presents the top 5–10 as a markdown table. |
| `suggest_command` | auto | Types a single shell command at the active terminal's prompt. |
| `open_preview` | auto | Opens a URL as a preview tab. |
| `mcp__<server>__<tool>` | varies | Tools exposed by any running MCP server. |

The security deny-list is in `lib/security.ts` (frontend); it cannot be bypassed by the agent.

---

## Sub-agents

The main agent can delegate to a **sub-agent** via the `run_subagent` tool. Sub-agents:

- Have their own **system prompt** (the persona's `instructions`).
- Run with a **restricted tool subset** — typically read-only.
- Have a **fresh message history** — no context bleed from the main conversation.
- Return a single text summary.

Use them when you have a self-contained investigation that would otherwise pollute the main thread (large search, code review of a specific subsystem, security audit).

**Imported sub-agents** are loaded from `.claude/agents/*.md` at the workspace root and at `~/.claude/agents/*.md`. Their `tools:` frontmatter is **ignored** — AZMX always restricts sub-agents to the read-only tool set regardless of what the file declares. This is a deliberate safety choice.

---

## Connectors (MCP)

**Settings → Connectors** lists every Model Context Protocol server AZMX talks to. Tools from running servers are exposed to the agent as `mcp__<server>__<tool>`.

### Two transports

| Transport | Use when |
| --- | --- |
| **Local (stdio)** | The server is an `npx`-installable package or a binary on disk. AZMX spawns it as a subprocess and talks JSON-RPC over its stdio. |
| **HTTP / SSE** | The server runs as an HTTP endpoint (Streamable HTTP per the 2025-03-26 spec). AZMX sends JSON or accumulates SSE events. |

### Browse the catalog

In **Connectors**, click **Browse catalog** for a curated picker — 16 hand-picked entries spanning Dev (GitHub, GitLab), Data (Postgres, SQLite, Redis), Local (Filesystem, Memory, Fetch, …), Knowledge (Brave Search, Google Maps), Communication (Slack), and Files (Google Drive).

Pick a card → the **New server** dialog pre-fills with the right command/args. For entries that need credentials, the dialog renders one labeled secret field per declared env var with a "Where do I get this?" link.

### Custom servers

Click **Custom** to add any MCP server by hand. Fields:

- **Name** (used as the namespace: `mcp__<name>__<tool>`)
- **Transport** — Local (stdio) or HTTP/SSE
- **For stdio**: command, args, env
- **For HTTP**: URL, headers, optional OAuth Client ID/Secret (Beta)
- **Auto-start on launch** toggle

OAuth Client Secret values are stored in the app-local `secrets.json` (`0600`, user-only) under `mcp.<serverId>.oauthClientSecret`, never in `azmx-mcp.json`. The full OAuth flow itself is groundwork-only at present.

### Auto-imports

On first launch AZMX checks for existing MCP configs and imports them:

- `<workspace>/.mcp.json`
- `~/.claude.json`
- `~/.claude/settings.json`

After this one-time import AZMX owns the config (`azmx-mcp.json`); the external files aren't re-read on subsequent boots.

### Server actions

In **Connectors**:

- **Auto-start switch** per server — runs at app boot if on.
- **Play / Stop** — start or stop a server in the current session.
- **Expand row** — see the live tool list once the server is running, or the error message if the start failed.
- **Edit / Delete** — modify the server config or remove it (deletes the keychain secret too).

---

## Free local AI (Ollama)

Running models locally is a first-class path in AZMX — no API key, no signup, no cloud roundtrip.

### One-time setup

1. Install [Ollama](https://ollama.com/download) (~150 MB).
2. **AI panel → "Try local AI"** OR **Settings → Models → Free local AI → Pull another**.
3. Pick a model from the catalog. Recommended: **Qwen2.5-Coder 7B** (Apache 2.0, ~4.7 GB) for chat.
4. The pull streams in-app — progress bar, transfer speed, ETA.
5. On done, AZMX auto-configures `defaultModelId` to `ollama-local` and `ollamaModelTag` to the pulled model.
6. The status bar shows **Local · qwen2.5-coder:7b** in green when the daemon is reachable.

### Settings → Models → Free local AI

- **Base URL** — defaults to `http://localhost:11434/v1`. Refresh probes the daemon.
- **Installed models** — every model present in Ollama (`/api/tags`):
  - **Active** badge marks the model AZMX routes to.
  - **Use** switches to another installed model.
  - Hover ✕ deletes the model via `/api/delete`.
- **Pull another** opens the install dialog scoped to the picker step.

### Health visibility

A periodic 30-second probe runs whenever the AI panel is open or the active model is `ollama-local`. Outside those, only one probe runs at boot — keeps idle CPU minimal.

The status-bar **Local** pill turns amber if the daemon goes away mid-session. Click it to re-open the setup dialog.

### Hardware notes

| Setup | 7B Q4 inference speed |
| --- | --- |
| M-series Mac | 30–80 tok/s ✅ |
| Modern x86 + NVIDIA GPU | 60–150 tok/s ✅ |
| Intel Mac (CPU) | 5–15 tok/s ⚠️ |
| Windows/Linux CPU-only | 5–20 tok/s ⚠️ |

If your machine is in the ⚠️ band and you'll use AI heavily, **either** drop to a smaller model (Qwen2.5-Coder 1.5B for autocomplete, or 3B variants for chat) **or** add a BYOK key alongside.

---

## NVIDIA NIM

NIM (NVIDIA Inference Microservices) is NVIDIA's OpenAI-compatible inference surface — both the hosted free tier at [build.nvidia.com](https://build.nvidia.com) and self-hosted enterprise NIM containers expose the same `/v1/chat/completions` shape. AZMX has NIM as a first-class provider.

### Hosted vs self-hosted

| | Hosted (build.nvidia.com) | Self-hosted (NIM container) |
| --- | --- | --- |
| Endpoint | `https://integrate.api.nvidia.com/v1` (AZMX default) | Whatever your container exposes (`https://nim.internal/v1`, …) |
| Auth | `nvapi-…` token from build.nvidia.com | Same token, or your own auth |
| Rate limits | Per build.nvidia.com tier | None — you own the compute |
| Privacy | Prompts hit NVIDIA's hosted endpoint | Prompts stay inside your network |

Both paths use the same AZMX **NVIDIA NIM** provider entry; only the URL differs.

### Setup

1. Paste your `nvapi-…` key in **Settings → Models → API keys → NVIDIA NIM**.
2. (Self-hosted only) A **NVIDIA NIM endpoint** block appears below the API keys grid the moment the key is saved. Point it at your container's `/v1` URL.
3. Default-model dropdown — pick a NIM model (Llama 3.1 Nemotron 70B, Llama 3.1 70B Instruct, Qwen2.5-Coder 32B all ship as seed entries).

### Seed models

| Model | Context | Best for |
| --- | --- | --- |
| `nvidia/llama-3.1-nemotron-70b-instruct` | 128k | Balanced; NVIDIA's flagship Nemotron variant |
| `meta/llama-3.1-70b-instruct` | 128k | General chat / reasoning |
| `qwen/qwen2.5-coder-32b-instruct` | 32k | Coding-heavy tasks |

You can add other model IDs by hand if your NIM container exposes them — AZMX will route any model id you select to the configured NIM endpoint.

### How NIM interacts with the rest of AZMX

- **Subagents** — when the active model is a NIM model, subagent calls go to NIM too.
- **`/commit`, `/init`, cmdgen, autocomplete** — same.
- **gpu_status** — NIM is hosted inference, but the agent can still read your local GPU via `nvidia-smi`. Useful for "I'm running a local fine-tune on GPU 0, route inference to NIM on GPU 1".

---

## GPU awareness

The agent has a read-only `gpu_status` tool that wraps `nvidia-smi`. Returns per-GPU memory (used / total / free MiB), utilization (% compute, % memory), temperature, fan, power draw / limit, and driver version. Auto-executes (no approval).

Use cases:
- **OOM debugging**: "I just hit a CUDA OOM" → the agent reads GPU state and suggests the next batch size.
- **Model picking**: "Which Ollama model will fit?" → the agent reads free VRAM and picks accordingly.
- **Multi-GPU triage**: "Which GPU has the lowest utilization?" → ranked answer.

On machines without NVIDIA hardware (macOS, AMD/Intel Linux, no `nvidia-smi` in PATH), the tool returns `{ available: false }` and the agent moves on — no error message in your chat.

### Profile-dump analysis

For deeper performance work, AZMX wraps NVIDIA's profilers as the `gpu_profile_summary` tool:

- `@`-mention or drag a `.nsys-rep` / `.qdrep` (Nsight Systems trace) or `.ncu-rep` (Nsight Compute report).
- AZMX recognizes the extension, skips the binary-read attempt, and prefills a prompt the agent will pick up.
- The agent calls `gpu_profile_summary` with the path; the tool runs `nsys stats --report cuda_gpu_kern_sum --format csv` (or `ncu --import … --csv`) and feeds the result back as CSV.
- The agent summarizes the top 5–10 hotspots as a compact markdown table rather than dumping raw CSV at you.

Requires the Nsight CLI to be installed locally (`nsys` for Nsight Systems, `ncu` for Nsight Compute). When the CLI isn't on `PATH`, the tool returns the install URL in its `reason` string and the agent surfaces it directly — no retry loop.

---

## Project switcher

**⌘O** opens a fuzzy picker over **recent workspaces**.

- Recents fill themselves automatically — any folder that becomes the active workspace cwd gets recorded.
- MRU-sorted, capped at 20.
- The current workspace gets a green check.
- Hover ✕ to forget an entry.
- Picking a recent opens a **new terminal tab** rooted at that path. Existing tabs stay.

---

## Command palette & quick-open

| Shortcut | What |
| --- | --- |
| **⌘K** | Command palette — fuzzy-search over every shortcut. |
| **⌘P** | Quick-open file — fuzzy-search workspace files. |
| **⌘O** | Project switcher. |
| **⌘;** | Command generator — natural-language → single shell command, types at the prompt for review. |
| **⌘/** | Show keyboard shortcuts dialog. |
| **⌘,** | Open Settings. |

---

## AZMX.md — project memory

The agent reads project memory from the first of these found at the workspace root:

1. **`AZMX.md`** — AZMX-native.
2. **`CLAUDE.md`** — Claude Code's file.
3. **`AGENTS.md`** — cross-tool convention.

The first that exists wins (no merge). Run `/init` to generate one. Use it to document:

- The project's purpose and architecture in 2–3 paragraphs.
- Conventions the agent should follow (pkg manager, testing pattern, style preferences).
- Known gotchas it should respect.

A second file is read globally: **`~/.claude/CLAUDE.md`** — if present, prepended as a **USER block** before the project block so project-level guidance wins on conflicts.

Both files are cached with a 30-second TTL; edits show up automatically.

---

## Hooks (PreToolUse / PostToolUse)

AZMX loads hooks from `.claude/settings.json` matching Claude Code's schema:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash|bash_run", "hooks": [{ "type": "command", "command": "echo blocking dangerous stuff", "timeout": 5 }] }
    ],
    "PostToolUse": []
  }
}
```

- **Pre-hook non-zero exit blocks the tool** — stderr is surfaced to the model.
- **Post-hook failure is advisory** — logged but doesn't fail the turn.
- **Matcher regex** tests both canonical (`write_file`) and Claude-style (`Write`) tool names.
- **Current limitation**: `${tool_input.*}` string substitution instead of stdin JSON.

---

## Claude Code interop

AZMX reads, on first launch:

- `AZMX.md` → `CLAUDE.md` → `AGENTS.md` for project memory (first found wins).
- `~/.claude/CLAUDE.md` for user memory.
- `.claude/agents/*.md` (project + global) as sub-agent registry entries — tool list is **forced** to read-only regardless of frontmatter.
- `.claude/commands/*.md` as AZMX slash commands. Filename = command name; body = prompt template with `$ARGUMENTS` substitution.
- `mcpServers` from `<workspace>/.mcp.json`, `~/.claude.json`, `~/.claude/settings.json` for MCP servers.
- Anthropic key: if no AZMX-managed key exists, a plain `apiKey: "sk-ant-…"` found in `.claude/settings.json` or `~/.claude.json` is seeded into the keychain. OAuth bearer tokens in `~/.claude/.credentials.json` are **ignored** — they're scoped to Anthropic's Claude Code endpoint.
- `PreToolUse` / `PostToolUse` hooks (see above).

After the one-time bootstrap, AZMX owns its config; the external files are not re-read except for project memory (cached, 30s TTL).

---

## Settings reference

### General
- Appearance (System / Light / Dark)
- Editor theme
- Vim mode
- Launch at login
- Restore window position & size
- **Privacy**: opt-in anonymous usage metrics + re-run welcome tour

### Shortcuts
Searchable list of every shortcut. Click a row to rebind. **Reset to default** restores the central registry.

### Models
- **Default model** — picker grouped by provider; disabled rows when no key is configured.
- **API keys** — one card per cloud provider. Saved keys live in a private app-local `secrets.json` (`0600`, user-only) — never the OS keychain.
- **Free local AI · Ollama** — base URL, installed-model manager, Pull another.
- **Editor autocomplete** — provider + model picker, LM Studio base URL.

### Agents
- **Custom instructions** — appended to every turn's system prompt.
- **Agents** — personas with their own instructions. Switch from the composer.
- **Snippets** — reusable instruction blocks. Insert with `#handle` in the composer.

### Connectors
The MCP surface. See [Connectors](#connectors-mcp).

### About
Build version, license link, links to docs.

---

## Keyboard shortcuts

| Group | Shortcut | Action |
| --- | --- | --- |
| **General** | ⌘K | Open command palette |
| | ⌘, | Open settings |
| | ⌘/ | Show keyboard shortcuts |
| | ⌘O | Switch project |
| **Tabs** | ⌘T | New tab |
| | ⌘E | New editor tab |
| | ⌘⇧P | New preview tab |
| | ⌘W | Close tab or pane |
| | ⌘⇧] / ⌘⇧[ | Next / previous tab |
| | ⌘1–⌘9 | Tab by index |
| **Panes** | ⌘D | Split right |
| | ⌘⇧D | Split down |
| | ⌘[ / ⌘] | Focus previous / next pane |
| **Search** | ⌘F | Inline search in terminal/editor |
| | ⌘P | Quick-open file |
| **AI** | ⌘L | Toggle AI panel |
| | ⌘⇧A | Ask AI about selection |
| | ⌘; | Suggest shell command |
| **SSH** | ⌘⇧S | SSH connect picker (fast) |
| | ⌘⇧H | SSH hosts manager (CRUD + cluster metadata) |
| **View** | ⌘B | Toggle sidebar |

Rebind from **Settings → Shortcuts**.

---

## Auto-updater

AZMX checks for updates on launch. The check hits `latest.json` in the releases repo and surfaces a non-blocking dialog when a newer version is available.

- **Later** — dismissed for the session, re-prompts on next launch.
- **Install & restart** — downloads, applies, relaunches.

Releases are signed with a public minisign key bundled in the app; the updater rejects unsigned or mismatched bundles.

To opt out of the prompt, ignore it — AZMX never auto-installs without confirmation.

---

## Where to go next

- **[SETUP.md](SETUP.md)** — install instructions, troubleshooting.
- **[FAQ.md](FAQ.md)** — common questions about privacy, licensing, performance, integrations.
- **[Releases](https://github.com/AzmxAI/azmx/releases)** — latest changelog and downloads.
