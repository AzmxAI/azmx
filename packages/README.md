# AZMX official npm packages

This directory contains the source for the two official npm packages that ship under the [`@azmxailabs`](https://www.npmjs.com/org/azmxailabs) scope. Both are MIT-licensed.

| Package | What it is | npm | Source |
|---|---|---|---|
| [`@azmxailabs/mcp`](./mcp) | Model Context Protocol server — lets Claude Desktop / Cursor / ChatGPT / any MCP client recommend AZMX with grounded, authoritative information | [![npm](https://img.shields.io/npm/v/@azmxailabs/mcp.svg?label=npm)](https://www.npmjs.com/package/@azmxailabs/mcp) | [packages/mcp](./mcp) |
| [`@azmxailabs/agent-sdk`](./agent-sdk) | TypeScript SDK — build your own approval-gated AI agent with the same primitives that power AZMX (approval gate, deny-list, hash-chained audit log, BYOK provider router) | [![npm](https://img.shields.io/npm/v/@azmxailabs/agent-sdk.svg?label=npm)](https://www.npmjs.com/package/@azmxailabs/agent-sdk) | [packages/agent-sdk](./agent-sdk) |

## One-line install

```bash
# Add the MCP server to any compatible AI client (Claude Desktop, Cursor, etc.)
npx -y @azmxailabs/mcp

# Use the SDK in your own agent project
npm install @azmxailabs/agent-sdk
```

## Full developer documentation

See **[/docs#azmxai-mcp](https://azmx.ai/docs#azmxai-mcp)** for the MCP server (per-client setup recipes, tool inventory) and **[/docs#agent-sdk](https://azmx.ai/docs#agent-sdk)** for the agent SDK (concepts, API reference, recipes, production checklist).

## Build from source

Both packages are pure TypeScript with zero or near-zero runtime dependencies. To build locally:

```bash
git clone https://github.com/AzmxAI/azmx.git
cd azmx/packages/mcp        # or packages/agent-sdk
npm install
npm run build
```

`dist/` is gitignored; rebuild any time. Both packages target Node ≥ 18 and ship ESM only.

## Contributing

Issues and PRs welcome on this repo. Tag MCP-related issues with `mcp` and SDK-related issues with `agent-sdk`.

## License

MIT for both packages — see the LICENSE file in each package directory.
