# Connectors

> MCP-based bridges so the agent can act outside AZMX — your code host, your cluster, your cloud.

AZMX bundles a curated catalog. **Settings → Connectors → Browse** picks one, asks for its credentials, runs it locally as a subprocess, and the agent can call its tools.

## What ships in the catalog (v0.22.x)

### Dev
- **GitHub** — read PRs, issues, repos, code search via your token.
- **GitLab** — projects, MRs, issues, pipelines.
- **Kubernetes** — `kubectl` from the agent; list/describe pods, read logs, manage deployments. Requires `kubectl` on PATH.

### Data
- **Postgres** — read-only queries over a connection string.
- **SQLite** — read + query a local database file.
- **Redis** — keys, lists, hashes, streams.

### Local
- **Filesystem** — explicit allow-listed directories.
- **Memory** — persistent key-value memory the agent shares across turns.
- **Sequential thinking** — scratchpad tool for multi-step plans.
- **Fetch** — pull a URL and convert HTML to Markdown.
- **Time** — current time, timezone conversions.
- **Puppeteer** — headless Chromium for scraping and browsing.
- **Everything** — reference MCP server (test/dev).

### Knowledge
- **Brave Search** — web search via your Brave API key.
- **Google Maps** — directions, places, geocoding.

### Communication
- **Slack** — read channels, post messages.

### Files
- **Google Drive** — list, read, search.

## Adding a connector outside the catalog

Any MCP server works. **Settings → Connectors → "Add custom"** takes:

- A **command + args** (for stdio servers — `npx`, `uvx`, a local binary)
- Or a **URL + headers** (for HTTP / SSE servers)
- Per-server env vars (secrets stored alongside your API keys in the `0600` `secrets.json`)

## Workspace MCP

A project can ship its own MCP setup via `.azmx/mcp.json` (auto-detected). The first time AZMX sees a server from a workspace it asks you to **trust** the integrity hash before spawning. Move the file, the trust is re-asked.

```json
{
  "mcpServers": {
    "my-team-tool": {
      "command": "npx",
      "args": ["-y", "@mycompany/mcp-tool"]
    }
  }
}
```

## Per-tool approval

For any running server, **Settings → Connectors → (server) → Tools** lists every tool and lets you set:

- **Inherit** — default, follows your global approval policy
- **Auto** — run without asking
- **Confirm** — ask each time
- **Block** — refuse

Useful for letting safe read tools auto-run while still gating writes.

## Org-controlled allowlist (Teams)

Operators can pin the catalog with a `mcp-allowlist.json` in the org-policy bundle. Servers not on the list refuse to spawn on the fleet.

## When something doesn't work

- Server times out at initialize → check the binary is on your PATH (`which kubectl`, `which npx`).
- Tool calls error → check the server's logs (Settings → Connectors → (server) → Logs).
- A workspace server can't spawn → re-trust it (Settings → Connectors → workspace tab).

See [`docs/TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for more.
