# Walkthrough: a custom binary MCP server

This shows how to package your own internal CLI as an MCP server for AZMX.

## The setup

You have an internal tool — `widget-cli` — that reads from your team's API. You want the AZMX agent to be able to call it.

## Step 1 — Make it an MCP server

Use the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk):

```ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "widget-cli", version: "0.1.0" });

server.setRequestHandler(/* … */, async (req) => {
  // call your internal API, return JSON
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

Build it into a single binary or publish as an npm package your team can `npx` from inside the firewall.

## Step 2 — Write the manifest

```json
{
  "id": "widget-cli",
  "name": "Widget CLI",
  "category": "dev",
  "description": "Talk to the internal Widget API.",
  "setupNote": "Requires your Widget team token. Get one at https://widgets.internal/tokens.",
  "transport": {
    "kind": "stdio",
    "command": "widget-cli",
    "args": ["--mcp"],
    "requiresBinary": "widget-cli",
    "secrets": [
      {
        "envName": "WIDGET_TOKEN",
        "label": "Widget team token"
      }
    ]
  }
}
```

## Step 3 — Distribute internally

Two routes:

1. **Workspace `.azmx/mcp.json`** — drop this manifest into your repo's `.azmx/mcp.json`. Anyone who opens the repo in AZMX gets prompted to trust + install. Best for repo-specific tooling.

2. **Org policy + custom catalog** — Teams customers can pin a private catalog via the org-policy file. The Widget CLI shows up in every seat's **Settings → Connectors → Browse** as if it were bundled.

## Step 4 — Submit to the community catalog (optional)

If your tool is generally useful and open-source, send a PR to this repo's `mcp-servers/` folder. We'll review for safety + ship it in the next AZMX release.

If your tool is internal-only, skip step 4 — keep it in the workspace or org-policy path.

## Safety checklist for any custom MCP server

- [ ] Refuses to write outside the directories the user explicitly approves.
- [ ] Doesn't shell out to arbitrary commands (use library calls).
- [ ] Returns structured errors, not raw stack traces with paths.
- [ ] Logs to stderr, not stdout (stdout is the JSON-RPC channel — corruption breaks the agent).
- [ ] Initializes within 30 seconds (AZMX's initialize timeout is 90s for first run).
- [ ] Per-tool descriptions are clear enough that the user can decide whether to auto-approve.
