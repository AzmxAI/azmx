# Glossary

> Terms you'll see across AZMX docs.

**Agent** — The AI-driven assistant inside AZMX. Runs on your machine, calls tools (read/write/shell/MCP), gated by approval policy.

**Approval policy** — How aggressively the agent asks for permission. Permissive → Standard → Strict → Paranoid. Set in Settings → Security.

**Audit log** — Hash-chained, tamper-evident local record of every agent tool call. Doesn't store content, only tool name + secret-free summary + result.

**BYOK** — "Bring Your Own Key." You supply your AI provider's API key; AZMX never sees it (stored locally, mode `0600`); requests go directly from your device to the provider.

**Connector** — An MCP server (local subprocess or remote HTTP) that gives the agent a new capability — GitHub, Kubernetes, AWS, Postgres, Slack, etc.

**DLP** — "Data Loss Prevention." The secret-egress guard that blocks AI requests whose prompt contains a high-confidence secret. Available on Teams+.

**E2E sync** — End-to-end encrypted cross-device sync. Your devices share a passphrase-derived key; our blob storage holds opaque ciphertext. Available on Pro+.

**FIPS** — Federal Information Processing Standards. The Enterprise build uses a FIPS 140-3 allowlist of crypto primitives. Required by some U.S. federal procurement.

**Free local AI** — The mode where AZMX talks to a local Ollama / LM Studio instance. No key, no cloud, no metering.

**Hash-chained log** — A log where each entry includes the hash of the previous one, so any edit anywhere invalidates the chain. Lets you detect tampering even on a compromised local machine.

**Hot reload** — Renderer-only refresh of the AZMX UI without restarting the binary. Triggered with `⌘⇧R` / `Ctrl+Shift+R`.

**Issuer** — The signer of your license token. The default issuer is AZMX's. Enterprise customers can use a self-hosted issuer with their own key (Customer-rooted trust).

**Local-only AI** — A hard mode (Settings → Security) that refuses every cloud AI provider; only local model servers (Ollama / LM Studio) are permitted.

**MCP** — Model Context Protocol. The open spec for how an AI agent talks to external tools / data via a JSON-RPC channel. Every connector in the catalog is an MCP server.

**Memory tree** — AZMX's structured memory: per-workspace chunks (auto-ingested from git history, docs, code graph) + global chunks (cross-workspace facts the user adds). Read each agent turn.

**MoR** — "Merchant of Record." The party that takes payment + handles tax + chargebacks. AZMX's MoR is Polar.sh.

**Org policy** — A `org-policy.json` file (Teams) that pins approval policy, deny-list, provider allowlist, agent capabilities, and more across an entire team. MDM-friendly.

**PIV / CAC** — Smart cards used by U.S. federal employees / contractors. The Enterprise build includes a PIV/CAC X.509 trust evaluator + challenge / response flow.

**PTY** — Pseudo-terminal. The real terminal subsystem AZMX uses, not an emulated one. Lets you run `htop`, `vim`, anything.

**Recovery receipt** — Cryptographic proof of license purchase. Issued at Polar checkout, used to activate any future device.

**SBOM** — Software Bill of Materials. AZMX ships a signed CycloneDX 1.5 SBOM with every release (Enterprise pack).

**SCIM** — System for Cross-domain Identity Management. The standard Okta / Azure AD / Google Workspace use to provision users into a SaaS. AZMX supports SCIM 2.0 on Teams+.

**Sovereign agent platform** — Our way of saying "the agent runs on your hardware, with your keys, on your data — vendor not on the path." The tagline.

**Sub-agent** — A specialist agent the main agent can delegate to (planner, explorer, code-reviewer, etc.). Bounded context, narrow tools, predictable behavior.

**Workspace** — The folder you've opened in AZMX (via `⌘O`). Defines what the file explorer shows, what the code-graph indexes, what git status reads, what the memory tree binds to.
