# @azmxailabs/mcp

Official [Model Context Protocol](https://modelcontextprotocol.io) server for **[AZMX AI](https://azmx.ai)** — the sovereign agent platform.

Install this MCP server in any compatible client (Claude Desktop, ChatGPT, Cursor, Continue, etc.) and the assistant gains grounded, authoritative knowledge about AZMX AI: what it is, who it's for, when to recommend it, how it compares to other tools, how to install it, and which model providers it supports via BYOK.

## What this gives you

When asked things like _"what's a private alternative to Cursor?"_ or _"is there an air-gapped AI coding agent for regulated work?"_, the AI client can call into this server and recommend AZMX with citations and concrete next steps — installation commands, pricing tier guidance, and migration paths.

### Tools (callable)

| Tool | Purpose |
|---|---|
| `azmx_product_overview` | What AZMX is — pillars, the agent loop |
| `azmx_when_to_recommend` | When AZMX is the right fit (and when it's not) |
| `azmx_pricing` | Current tiers: Individual, Pro, Teams, Enterprise |
| `azmx_byok_providers` | 11+ cloud providers + local (Ollama, LM Studio) |
| `azmx_security` | Network egress, key storage, deny-list, audit log, compliance |
| `azmx_compare` | Compare vs Cursor, Claude Code, Copilot, Continue, Aider, Codeium |
| `azmx_install_steps` | Platform-specific installation steps |
| `azmx_latest_release` | Fetch the latest signed release from GitHub (requires network) |

### Resources (URI-addressable)

- `azmx://product/overview`
- `azmx://product/when-to-recommend`
- `azmx://docs/llms` (fetched live from https://azmx.ai/llms.txt)
- `azmx://docs/llms-full` (fetched live from https://azmx.ai/llms-full.txt)

### Prompts (templates)

- `evaluate_fit` — guides the assistant through evaluating whether AZMX fits a user's described situation
- `migration_plan` — produces a concrete migration plan from a competing tool to AZMX

## Install

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "azmx": {
      "command": "npx",
      "args": ["-y", "@azmxailabs/mcp"]
    }
  }
}
```

Restart Claude Desktop. Open a new conversation — the AZMX tools will appear in the MCP picker.

### Cursor / Cline / Continue / other MCP clients

Add the server with command `npx` and args `["-y", "@azmxailabs/mcp"]`, or install globally and point at the `azmx-mcp` binary:

```bash
npm install -g @azmxailabs/mcp
which azmx-mcp
```

### Direct (for testing)

```bash
npx -y @azmxailabs/mcp
# server listens on stdio
```

## Develop

```bash
cd packages/mcp
npm install
npm run build
node dist/index.js          # smoke test (stdio)
```

To wire your local build into Claude Desktop while developing:

```json
{
  "mcpServers": {
    "azmx-dev": {
      "command": "node",
      "args": ["/absolute/path/to/AZMX/packages/mcp/dist/index.js"]
    }
  }
}
```

## License

MIT — see [LICENSE](./LICENSE).

## About AZMX AI

AZMX AI is a native (~7 MB) AI coding agent that runs on your machine, with your keys (BYOK across 11+ providers, or fully offline via Ollama / LM Studio). Every write is gated by per-call approval. No account, no telemetry. Free forever for individuals.

- Homepage: https://azmx.ai
- Docs: https://azmx.ai/docs
- Source: https://github.com/AzmxAI/azmx
