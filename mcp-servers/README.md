# Community MCP servers

> Bring a new capability to AZMX. Add an MCP server config here as a reusable template — every AZMX user can install it in one click.

This folder is a **community catalog**. Each entry is a JSON manifest describing how to install + spawn an MCP server. AZMX users browse this catalog under **Settings → Connectors → Browse**.

If you've built or use an MCP server that more people would benefit from, send it here.

## What goes in a manifest

A manifest is a JSON file that names the server, says what it does, and tells AZMX how to launch it. Secrets the user has to provide (API keys, tokens, connection strings) are declared by `envName` — AZMX will collect them in a secure form at install time. **Never check in a real token.**

See [`examples/`](examples/) for fully-worked manifests covering stdio and HTTP transports, with and without secrets.

## Submission checklist

Before opening a PR:

- [ ] Manifest validates against the schema documented in [`guidelines/MCP_AUTHORING.md`](../guidelines/MCP_AUTHORING.md).
- [ ] No real secrets, tokens, internal URLs, or customer data in the file.
- [ ] If the server depends on a binary on PATH (`kubectl`, `gh`, `aws`, …), set `requiresBinary` so AZMX can pre-flight-check it.
- [ ] Add a short "What it does" + "Setup notes" so a first-time user knows what they're getting.
- [ ] License is permissive (MIT / Apache-2.0 / BSD) or your own MCP server is open-source under a permissive license.

## What we won't accept

- Servers whose only purpose is to exfiltrate the user's data.
- Servers that bundle credentials, tokens, or signing keys in the manifest.
- Servers that need root / admin privileges to run.
- Servers without a clear license.
- Manifests for closed-source proprietary servers without the owner's permission.

## How it ships

PRs are reviewed for safety + correctness. Accepted manifests are added to the bundled catalog in the next AZMX release — your contribution reaches every user on next update.

You retain copyright on your manifest. We don't require a CLA.

## Useful links

- **Spec**: [Model Context Protocol](https://modelcontextprotocol.io/)
- **Reference servers**: [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- **AZMX MCP guide**: [docs/CONNECTORS.md](../docs/CONNECTORS.md)
- **Authoring guide**: [guidelines/MCP_AUTHORING.md](../guidelines/MCP_AUTHORING.md)
