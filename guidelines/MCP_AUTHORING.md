# Authoring an MCP server manifest

> Add a new connector to AZMX's bundled catalog. Manifests are JSON; every field is documented here.

## The schema

```jsonc
{
  // — Identity —
  "id": "string",            // unique, kebab-case. Becomes the catalog ID.
  "name": "string",          // human label shown in the UI.
  "category": "dev | data | local | knowledge | comm | files",

  // — Description —
  "description": "string",   // 1–2 sentences. What it does, who needs it.
  "docsUrl": "string",       // optional. Upstream README.
  "setupNote": "string",     // optional. What the user has to do before it works.

  // — Transport —
  "transport": {
    "kind": "stdio | http",
    // For stdio:
    "command": "string",
    "args": ["string", …],
    "env": { "KEY": "value" },          // optional plaintext env
    "requiresBinary": "string",         // optional. Pre-flight `which` check.
    "secrets": [                        // optional secret env vars
      {
        "envName": "string",            // env var name the server reads
        "label": "string",              // form-field label shown to user
        "helpUrl": "string"             // optional. "Get your token here →"
      }
    ],
    // For http:
    "url": "string",
    "headers": { "Header": "value" }
  }
}
```

## Stdio vs HTTP

Most MCP servers are **stdio** — spawned as a subprocess; JSON-RPC over stdin/stdout. Use stdio unless the upstream server explicitly requires HTTP.

HTTP servers go to a URL with optional headers. Useful for cloud-hosted MCP services. **Caveat**: prompts and contextual data go to that URL — your manifest should make this obvious in `description` / `setupNote`.

## Secrets — how to declare, never hardcode

A secret is **declared by name**, not by value. AZMX collects the value at install time, encrypts it, and injects it as an env var when the server spawns.

```json
"secrets": [
  {
    "envName": "GITHUB_PERSONAL_ACCESS_TOKEN",
    "label": "Fine-grained PAT (Contents read, Issues read)",
    "helpUrl": "https://github.com/settings/tokens?type=beta"
  }
]
```

**Never check in a real token or key**, even one that's been rotated. CI will refuse PRs that contain detectable secret patterns.

## `requiresBinary`

If your server shells out to an external CLI (kubectl, gh, aws, …), declare it:

```json
"requiresBinary": "kubectl"
```

AZMX walks the user's `PATH` and refuses to spawn with a clean error if the binary is missing — rather than letting the server start and silently fail every tool call.

Cross-platform: AZMX tries `name`, `name.exe`, `name.cmd`, `name.bat`, `name.com` on Windows.

## `category` — pick one

- **dev** — code repos, build tools, CI, deploy. (GitHub, GitLab, K8s.)
- **data** — databases, warehouses, caches. (Postgres, SQLite, Redis, DuckDB.)
- **local** — tools that talk to local resources only. (Filesystem, time, memory.)
- **knowledge** — search, retrieval, docs. (Brave, Maps, Wikipedia.)
- **comm** — chat, mail, calendar. (Slack, Discord, Gmail.)
- **files** — file shares. (Drive, Dropbox, S3.)

If your server crosses two, pick the more salient one.

## Required quality bar

1. **Initializes within 30 seconds** on a cold first run (npm cache miss + package fetch + boot). AZMX's initialize timeout is 90s; staying well under 30s leaves headroom.
2. **Exposes ≥ 1 useful tool.** A server with no tools provides no value.
3. **Returns structured errors.** Not "Error: undefined" — name what failed and why.
4. **Logs to stderr.** Stdout is reserved for the JSON-RPC framing; anything written there corrupts the channel and disconnects the client.
5. **Honors a `Tool` description.** Each exposed tool needs a clear human description — AZMX surfaces this in the per-tool approval UI.
6. **Per-tool semantics are stable.** Don't rename or remove tools between minor versions without a transition window.

## License

Your server **and** the manifest must be under a permissive license (MIT / Apache-2.0 / BSD / ISC). The manifest file gets a SPDX header in its first JSON comment — but JSON doesn't support comments officially, so we ship the license declaration in the PR description and the repo's `LICENSES.txt`.

## Submitting

1. Fork this repo.
2. Add your manifest at `mcp-servers/<id>.json`.
3. (If you're walking through a custom server) add `mcp-servers/examples/<id>.md` with a setup walkthrough.
4. Open a PR. Use the title `mcp: add <id>`.
5. Wait for review. Expect 2–5 business days.

If your server is closed-source / internal, don't submit it here — distribute via your workspace `.azmx/mcp.json` or your team's org policy. See [the connectors doc](../docs/CONNECTORS.md).

## After it ships

You'll be tagged in the release notes. Your manifest reaches every AZMX user on their next update. We may ping you for the occasional clarification — pre-emptive thank you.
