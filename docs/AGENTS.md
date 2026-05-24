# Agents

> What the agent can do, what it can't, and how it stays safe.

## What the agent is

The AZMX agent is an AI-driven assistant that runs **on your machine**, with **your permissions**, in **your shell + filesystem**. It can read files, write files, run shell commands, search code, call MCP tools, fetch URLs, and use any provider key you've configured. It's a tool — and like any tool, it does what you point it at.

## What it can do

| Capability | How |
|---|---|
| Read files | `read_file` — gated by the secret-path screen and approval policy |
| Write / edit files | `write_file` / `edit` — always requires approval at Standard+ |
| Run shell commands | `bash` / `shell_*` — always approval-gated; some commands are typed-confirm at Paranoid |
| Search code | `grep` / `glob` / `find_symbol` / `find_references` (the last two via the local code-graph index) |
| Call MCP tools | Any tool from any running MCP server (per-tool approval) |
| Browse the web | `fetch` / `web_search` (only with the appropriate connector) |
| Manage agent state | `todo_write` / `memory_remember` |
| Delegate to sub-agents | Spawnable parallel runs (Pro) |
| Checkpoint + replay | Pause / branch / rollback (Pro) |

## What it can't do

- Issue an AI request to a cloud provider when **Local-only AI** is on.
- Read paths matching the built-in secret-path screen (`.env`, `.ssh/*`, `credentials*`, etc.) or your custom path patterns (Pro).
- Spawn arbitrary processes outside the MCP catalog without explicit configuration.
- Hide what it did — every tool call is recorded in the hash-chained audit log.
- Bypass approval policy at Standard / Strict / Paranoid presets.
- Send your API keys anywhere — keys never enter the agent's context, the model only sees the model's own headers.

## Approval policies

| Preset | Reads | Writes | Shell | Destructive |
|---|---|---|---|---|
| Permissive | auto | auto (logged) | auto (logged) | auto (logged) |
| Standard *(default)* | auto | ask once | ask once | ask once |
| Strict | ask every call | ask every call | ask every call | ask every call |
| Paranoid | ask | ask | ask | **typed confirmation** for `rm -rf`, `git push --force`, `kubectl delete`, `terraform destroy`, etc. |

Switch in **Settings → Security → Approval policy**.

## Audit log

Every tool call appends one entry to a **hash-chained, tamper-evident** local log:

- Tool name
- A secret-free summary (file path or command name, never content or output)
- Result (success / failure)
- Timestamp

The log lives on your machine (`azmx-audit.json` in the data dir). **Settings → Privacy → Agent audit log** lets you:

- **View recent** — last N entries
- **Verify chain** — recomputes hashes from genesis to detect any tampering
- **Export** — JSONL for SIEM forwarders (Splunk, Datadog, …)
- **Clear** — wipes the log and starts a fresh chain

## Sub-agents

The agent can delegate to **sub-agents** — a curated set of specialists (planner, explorer, code-reviewer, security-reviewer, …). Useful for:

- Running a search across the codebase without flooding the main context
- Independent verification ("review this PR")
- Parallel work that doesn't share context

Teams can centrally disable sub-agents via the org-policy file.

## Skills

Skills are named disciplines the agent can load on demand (`load_skill("api-design")`). The bundled set ships 80+ skills covering: a11y audit, ADR writing, agent debugging, agent-policy writing, API deprecation, API design, AWS cost optimization, bundle-size reduction, BYOK debugging, and many more.

Add your own to `~/.azmx/skills/`; workspace-pinned skills override in `<project>/.azmx/skills/`.

## Custom instructions

**Settings → AI → Custom instructions** lets you prepend a stable preamble to every agent turn (style preferences, the project's house rules, your own name). It survives session reset.

## Limits

- The agent cannot see screens it doesn't have a tool for (no screenshot OCR by default).
- The agent cannot send email, SMS, or push notifications.
- The agent cannot reach the network outside what the configured connectors permit.
- The agent cannot edit the running AZMX binary (`Disallow: self` is hard-wired).
